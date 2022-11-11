# token-holder-balances

## Purpose

This project generates daily balances for each token and holder permutation, and makes the data accessible in BigQuery.

## Reasoning

- It is currently prohibitively slow to generate timeseries data for token holders in a Graph Protocol subgraph.
- The Graph Protocol limits the number of records in a single query to 1000 and in an `offset` query to 5000. Even with indexing improvements, the query limit becomes a limitation.
- The GraphQL API has no support for aggregation, which makes fetching from a frontend slow.

## Architecture

This project has a few components:

- Google Cloud Storage (GCS) to store records (in JSON file)
  - Files are stored in the following location: `<bucket>/<token-balances>/dt=<YYYY-MM-DD>/balances.jsonl`.
  - Files are stored in the `JSONL` (newline-delimited) format in order to make it easy to ingest into BigQuery.
  - The parent directory of the `balances.jsonl` file contains `dt=` followed by the date, so that [Hive partitioning](https://cloud.google.com/bigquery/docs/hive-partitioned-queries-gcs#supported_data_layouts) is supported without further transformation.
- Google Cloud Function (GCF) to calculate the daily balances
  - Determines the date to start generating balances from: either the latest balance date, or the earliest start date contained within the PubSub messages.
  - Calculates daily balances from the start date, and stores them in the GCS bucket.
  - If the function detects that the timeout is approaching, it will exit fetching the records.
- Google Cloud Scheduler Job to trigger the function in GCF.
- BigQuery table exposing the data stored in the GCS bucket.
- Alert policies to inform about failures and extraneous executions in Discord/email.
- Monitoring dashboard for key metrics: function executions and status, GCS network activity

The Pulumi tool is used to manage the orchestration of resources in Google Cloud Platform, and has `dev` and `prod` stacks (environments).

## Discord Integration

GCP monitoring does not have a direct integration with Discord, and it seemed like overkill to write a GCP -> Discord webhook integration.

Instead, a [scenario](https://us1.make.com/126792/scenarios/446857/edit) is defined in Make (formerly Integromat) that does the following:

- Watches an email address supplied by the custom mailhook
- Send a HTTP post request to the Discord webhook

This results in a small message being sent into the alerts channel.

## Caveats

- This project has the details of resources from the `subgraph-cache` project hard-coded. Those values will need to be manually updated if the resource ids change (which is rare). These can be output by running `pulumi stack` on the respective stack.
- If the underlying token-holders subgraph radically changes (e.g. a new token is added), then a PubSub message will be sent that will force a re-fetching (& re-calculation) of records and balances. However, if that re-calculation does not finish within a single run, this function will not currently pick up where it left off. For that reason, it is advisable to delete the directories under `token-balances/` in the GCS bucket, so that it re-calculates from scratch.
