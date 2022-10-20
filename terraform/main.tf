terraform {
    required_providers {
      google = {
        source  = "hashicorp/google"
        version = ">= 4.41.0"
      }
    }

    # Configuration input via *.tfbackend files. Use `yarn terraform:init`
    backend "gcs" {}
}

variable "region" {
    default     = "us-east1"
}

provider "google" {
    project     = "utility-descent-365911"
    region      = "${var.region}"
}

# Returns the name of the current git branch
data "external" "git-branch" {
    # Source: https://gist.github.com/alastairmccormack/a8c290738145f1c94a86029aca66cb8e
    program     = ["/bin/bash", "-c", "jq -n --arg branch `git rev-parse --abbrev-ref HEAD` '{\"branch\":$branch}'"]
}

# Google Cloud Storage
resource "google_storage_bucket" "bucket" {
    provider                        = google
    name                            = "olympusdao-token-holders-${data.external.git-branch.result.branch}"
    location                        = "${var.region}"
    uniform_bucket_level_access     = true

    versioning {
      enabled                       = false
    }
}

# BigQuery Dataset
resource "google_bigquery_dataset" "dataset" {
    dataset_id      = "token_holders_${data.external.git-branch.result.branch}"
    description     = "token holders data for the ${data.external.git-branch.result.branch} branch"
    location        = "${var.region}"
}

# BigQuery Table
resource "google_bigquery_table" "balances" {
    dataset_id      = google_bigquery_dataset.dataset.dataset_id
    table_id        = "balances"

    external_data_configuration {
      autodetect    = false
      schema        = file("${path.module}/balances_schema.json")
      source_format = "NEWLINE_DELIMITED_JSON"
      source_uris   = [ "gs://olympusdao-token-holders-${data.external.git-branch.result.branch}/output/balances/*" ]

      # We can automatically partition the data, since it is structured in the format of:
      # /output/balances/dt=<YYYY-MM-DD>/balances.jsonl
      hive_partitioning_options {
        source_uri_prefix       = "gs://olympusdao-token-holders-${data.external.git-branch.result.branch}/output/balances"
      }
    }
}

# service account
