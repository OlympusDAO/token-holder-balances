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
- Alert policy to inform about failures in Discord

The Pulumi tool is used to manage the orchestration of resources in Google Cloud Platform, and has `dev` and `prod` stacks (environments).

## Caveats

- This project has the details of resources from the `subgraph-cache` project hard-coded. Those values will need to be manually updated if the resource ids change (which is rare).
