import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import { readFileSync } from "fs";

import { handler } from "./src/index";

// TODO shift to stack variable
const RECORDS_BUCKET_NAME = "olympusdao-subgraph-cache-prod-f962a96"; // Copied manually from subgraph-cache ouput
const RECORDS_BUCKET_PREFIX = "token-holders-transactions";
const PUBSUB_TOPIC = "token-holders-transactions-prod-8a6361b"; // Copied manually from subgraph-cache ouput

const BUCKET_NAME_PREFIX = `olympusdao-token-balances-${pulumi.getStack()}`;
const FUNCTION_PREFIX = `token-balances`;
const functionName = `${FUNCTION_PREFIX}-${pulumi.getStack()}`;

/**
 * Record storage: GCS bucket
 */
// Create a bucket to store the cached results
const storageBucket = new gcp.storage.Bucket(BUCKET_NAME_PREFIX, {
  location: "US", // Get this from the provider instead?
  uniformBucketLevelAccess: true,
  versioning: { enabled: false },
});

// Export the DNS name of the bucket
export const storageBucketUrl = storageBucket.url;

/**
 * Execution: Google Cloud Functions
 */
const functionTimeoutSeconds = 540;

// Create a function
const tokenHolderFunction = new gcp.cloudfunctions.HttpCallbackFunction(functionName, {
  runtime: "nodejs14",
  timeout: functionTimeoutSeconds,
  availableMemoryMb: 1024,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback: async (req, res) => {
    console.log("Received callback. Initiating handler.");
    await handler(FUNCTION_PREFIX, storageBucket.name.get(), RECORDS_BUCKET_PREFIX, RECORDS_BUCKET_NAME, functionTimeoutSeconds, req);
  },
});

export const functionUrl = tokenHolderFunction.httpsTriggerUrl;

// TODO set max instances

/**
 * Subscribe to PubSub events
 */
const pubSubDeadLetter = new gcp.pubsub.Topic(`${PUBSUB_TOPIC}-deadLetter`, {});

const expirationSeconds = 24*60*60;
const pubSubSubscription = new gcp.pubsub.Subscription(functionName, {
  topic: PUBSUB_TOPIC,
  pushConfig: {
    pushEndpoint: functionUrl
  },
  // If there is an issue, give up quickly, as it will be picked up later
  deadLetterPolicy: {
    deadLetterTopic: pubSubDeadLetter.id,
    maxDeliveryAttempts: 5, // Lowest possible value
  },
  expirationPolicy: { ttl: `${expirationSeconds}s` },
  messageRetentionDuration: `${expirationSeconds}s`,
});

export const pubSubSubscriptionName = pubSubSubscription.name;

/**
 * Scheduling: Cloud Scheduler
 */
const schedulerJob = new gcp.cloudscheduler.Job(functionName, {
  schedule: "10 * * * *", // Start of every hour
  timeZone: "UTC",
  httpTarget: {
    httpMethod: "GET",
    uri: functionUrl,
  },
});

export const schedulerJobName = schedulerJob.name;

/**
 * Create a dummy file in the storage bucket.
 *
 * We do this, otherwise the Hive partitioning will complain of no files being present.
 */
const dummyObject = new gcp.storage.BucketObject("dummy", {
  bucket: storageBucket.name,
  content: "{}", // Empty file
  name: `${FUNCTION_PREFIX}/dt=2021-01-01/dummy.jsonl`,
});

/**
 * Create a BigQuery external table
 */
const bigQueryDataset = new gcp.bigquery.Dataset(BUCKET_NAME_PREFIX, {
  datasetId: BUCKET_NAME_PREFIX.replace(/-/g, "_"), // - is unsupported
});

export const bigQueryDatasetId = bigQueryDataset.datasetId;

// storageBucketUrl is not known until deploy-time, so we use a pulumi-provided function to utilise it
// Source: https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#apply
const sourceUriPrefix = storageBucketUrl.apply(url => `${url}/${FUNCTION_PREFIX}/`);
const sourceUri = storageBucketUrl.apply(url => `${url}/${FUNCTION_PREFIX}/*`);

// For the moment, we generate a BigQuery schema file and store it locally
const bigQuerySchemaJson = readFileSync("bigquery_schema.json").toString("utf-8");

const bigQueryTable = new gcp.bigquery.Table(
  FUNCTION_PREFIX,
  {
    datasetId: bigQueryDatasetId,
    tableId: FUNCTION_PREFIX,
    deletionProtection: false,
    externalDataConfiguration: {
      sourceFormat: "NEWLINE_DELIMITED_JSON",
      sourceUris: [sourceUri],
      hivePartitioningOptions: {
        mode: "AUTO",
        sourceUriPrefix: sourceUriPrefix,
      },
      autodetect: false,
      schema: bigQuerySchemaJson,
    },
  },
  { dependsOn: dummyObject },
);

export const bigQueryTableId = bigQueryTable.tableId;
