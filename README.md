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

## Local Development - Google Cloud Setup

1. Install the `gcloud` tool using your preferred method: https://cloud.google.com/sdk/docs/install
2. Run `gcloud init`
3. Set up the default authentication: `gcloud auth application-default login`

## Google Cloud Setup

Terraform is used to ensure that the state of the infrastructure in Google Cloud matches the requirements.

Note:

- The Google Cloud Storage bucket and BigQuery dataset must be located in the same region
