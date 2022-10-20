# token-holder balances

region: us-east1

## Purpose

This project generates daily balances for each token and holder permutation, and makes the data accessible in BigQuery.

## Reasoning

- It is currently prohibitively slow to generate timeseries data for token holders in a Graph Protocol subgraph.
- The Graph Protocol limits the number of records in a single query to 1000 and in an `offset` query to 5000. Even with indexing improvements, the query limit becomes a limitation.
- The GraphQL API has no support for aggregation, which makes fetching from a frontend slow.

## Architecture

Within Google Cloud Functions:
1. Transaction records are fetched from the `token-holders` subgraph, and stored in Google Cloud Storage
2. Balances for each token and holder permutation are generated on a daily basis, and stored in Google Cloud Storage

Within BigQuery:

3. BigQuery is configured to have an external table that uses the stored balances as a data source

## Local Development Setup

1. Run `yarn`
2. Install `terraform` if you need to set up infrastructure in Google Cloud Platform
3. Install the `gcloud` tool using your preferred method: https://cloud.google.com/sdk/docs/install
4. Run `gcloud init`
5. Set up the default authentication: `gcloud auth application-default login`

## Google Cloud Setup

Terraform is used to ensure that the state of the infrastructure in Google Cloud matches the requirements.

Note:

- The Google Cloud Storage bucket and BigQuery dataset must be located in the same region. This is enforced in the Terraform configuration
- Terraform state is stored in a Google Cloud Storage bucket, `olympusdao-terraform-tfstate`, with the state stored under a directory corresponding to the current git branch. 

Steps:

- Run `yarn terraform:init` on first-run. This will pull the state for the current branch.
- Run `yarn terraform plan` to see pending changes
- Run `yarn terraform apply` to apply changes (this requires authentication with GCP first)

Running `yarn terraform` ensurs that you are acting on the correct directory.

## Subgraph Changes

Transactions are stored in a Google Cloud Storage bucket, to avoid having to fetch the data (and dramatically extend execution time) on each run.

If a new subgraph version is deployed that changes historical data (such as a new token being indexed, or a different calcultion being used), this function will not (yet) detect those changes. To force re-fetching of the transactions, delete the `output/records/` directory in the `olympusdao-token-holders-<GIT BRANCH>` bucket. Balances will be re-calculated automatically.
