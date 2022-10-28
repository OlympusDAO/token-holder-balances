import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import { FileAsset } from "@pulumi/pulumi/asset";
import { readFileSync } from "fs";

import { handler } from "./src/index";

const pulumiConfig = new pulumi.Config();
const gcpConfig = new pulumi.Config("gcp");

const RECORDS_BUCKET_NAME = pulumiConfig.require("bucketName");
const RECORDS_BUCKET_PREFIX = pulumiConfig.require("bucketPrefix");
const PUBSUB_TOPIC = pulumiConfig.require("pubSubTopic");

const BUCKET_NAME_PREFIX = `olympusdao-token-balances-${pulumi.getStack()}`;
const FUNCTION_PREFIX = `token-balances`;
const FUNCTION_NAME = `${FUNCTION_PREFIX}-${pulumi.getStack()}`;

/**
 * Record storage: GCS bucket
 */
// Create a bucket to store the cached results
const tokenBalancesBucket = new gcp.storage.Bucket(BUCKET_NAME_PREFIX, {
  location: "US", // Get this from the provider instead?
  uniformBucketLevelAccess: true,
  versioning: { enabled: false },
});

// Export the DNS name of the bucket
export const tokenBalancesBucketUrl = tokenBalancesBucket.url;

/**
 * Create a subscription to the PubSub topic that is defined in the subgraph-cache project and fired whenever transactions are stored.
 *
 * This is configured as a pull subscription, as the Cloud Function will check these messages upon its normally-scheduled run.
 * Why not push? If there is any error (e.g. a timeout), it tends to create an ever-increasing number of messages,
 * which spawn functions.
 */
const expirationSeconds = 24 * 60 * 60;
const pubSubSubscription = new gcp.pubsub.Subscription(FUNCTION_NAME, {
  topic: PUBSUB_TOPIC,
  retainAckedMessages: false,
  expirationPolicy: { ttl: `${expirationSeconds}s` },
  messageRetentionDuration: `${expirationSeconds}s`,
});

export const pubSubSubscriptionName = pubSubSubscription.name;

/**
 * Create a Google Cloud Function that will calculate balances based on the available transaction records.
 *
 * This will also check the PubSub subscription for any pending requests fired off on the PubSub topic.
 */
const functionTimeoutSeconds = 540;
const tokenBalancesFunction = new gcp.cloudfunctions.HttpCallbackFunction(
  FUNCTION_NAME,
  {
    runtime: "nodejs14",
    timeout: functionTimeoutSeconds,
    availableMemoryMb: 1024,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: async (req, res) => {
      console.log("Received callback. Initiating handler.");
      await handler(
        FUNCTION_PREFIX,
        tokenBalancesBucket.name.get(),
        RECORDS_BUCKET_PREFIX,
        RECORDS_BUCKET_NAME,
        functionTimeoutSeconds,
        pubSubSubscription.id.get(),
      );
      // It's not documented in the Pulumi documentation, but the function will timeout if `.end()` is missing.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>res).send("OK").end();
    },
  },
  { dependsOn: [pubSubSubscription] },
);

export const tokenBalancesFunctionUrl = tokenBalancesFunction.httpsTriggerUrl;
export const tokenBalancesFunctionName = tokenBalancesFunction.function.name;

/**
 * Scheduling: Cloud Scheduler
 */
const schedulerJob = new gcp.cloudscheduler.Job(
  FUNCTION_NAME,
  {
    schedule: "10 * * * *", // Start of every hour
    timeZone: "UTC",
    httpTarget: {
      httpMethod: "GET",
      uri: tokenBalancesFunctionUrl,
    },
  },
  {
    dependsOn: tokenBalancesFunction,
  },
);

export const schedulerJobName = schedulerJob.name;

/**
 * Create a dummy file in the storage bucket.
 *
 * We do this, otherwise the Hive partitioning will complain of no files being present.
 */
const dummyObject = new gcp.storage.BucketObject(
  "dummy",
  {
    bucket: tokenBalancesBucket.name,
    content: "{}", // Empty file
    name: `${FUNCTION_PREFIX}/dt=2021-01-01/dummy.jsonl`,
  },
  { dependsOn: [tokenBalancesBucket] },
);

/**
 * Create a BigQuery external table for balance records
 */
const bigQueryDataset = new gcp.bigquery.Dataset(BUCKET_NAME_PREFIX, {
  datasetId: BUCKET_NAME_PREFIX.replace(/-/g, "_"), // - is unsupported
});

export const bigQueryDatasetId = bigQueryDataset.datasetId;

// tokenBalancesBucketUrl is not known until deploy-time, so we use a pulumi-provided function to utilise it
// Source: https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#apply
const tokenBalancesSourceUriPrefix = tokenBalancesBucketUrl.apply(url => `${url}/${FUNCTION_PREFIX}/`);
const tokenBalancesSourceUri = tokenBalancesBucketUrl.apply(url => `${url}/${FUNCTION_PREFIX}/*`);

// For the moment, we generate a BigQuery schema file and store it locally
const tokenBalancesSchema = readFileSync("schema-token-balances.json").toString("utf-8");

const tokenBalancesTable = new gcp.bigquery.Table(
  FUNCTION_PREFIX,
  {
    datasetId: bigQueryDatasetId,
    tableId: FUNCTION_PREFIX,
    deletionProtection: false,
    externalDataConfiguration: {
      sourceFormat: "NEWLINE_DELIMITED_JSON",
      sourceUris: [tokenBalancesSourceUri],
      hivePartitioningOptions: {
        mode: "AUTO",
        sourceUriPrefix: tokenBalancesSourceUriPrefix,
      },
      autodetect: false,
      schema: tokenBalancesSchema,
    },
  },
  { dependsOn: [dummyObject, tokenBalancesBucket] },
);

export const tokenBalancesTableId = tokenBalancesTable.tableId;

/**
 * Upload the contract addresses to the GCS bucket
 */
const contractAddressesBucketPrefix = "contract-addresses";
const contractAddressesObject = new gcp.storage.BucketObject(
  "contract-addresses",
  {
    bucket: tokenBalancesBucket.name,
    source: new FileAsset("addresses.csv"),
    name: `${contractAddressesBucketPrefix}/addresses.csv`,
  },
  {
    dependsOn: [tokenBalancesBucket],
  },
);
const contractAddressesSourceUri = tokenBalancesBucketUrl.apply(url => `${url}/${contractAddressesBucketPrefix}/*`);

/**
 * Create a BigQuery external table for contract names
 */
const contractAddressesSchema = readFileSync("schema-contract-addresses.json").toString("utf-8");

const contractAddressesTable = new gcp.bigquery.Table(
  "contract-addresses",
  {
    datasetId: bigQueryDatasetId,
    tableId: "contract-addresses",
    deletionProtection: false,
    externalDataConfiguration: {
      sourceFormat: "CSV",
      sourceUris: [contractAddressesSourceUri],
      autodetect: false,
      schema: contractAddressesSchema,
      csvOptions: {
        quote: '"',
        skipLeadingRows: 1,
      },
    },
  },
  { dependsOn: contractAddressesObject },
);

export const contractAddressesTableId = contractAddressesTable.tableId;

/**
 * Create a BigQuery view with the token balances and contract names.
 *
 * A materialised view (persisted) would be ideal, but external tables are not supported.
 */
const tokenBalancesNamedQuery = pulumi.interpolate`
  SELECT
  balances.*,
  IF(addresses.Custom_Name, addresses.Name, balances.holder) AS holder_name,
  IFNULL(addresses.Type, "Unknown") AS holder_type,
  FROM \`${gcpConfig.require("project")}.${bigQueryDatasetId}.${tokenBalancesTableId}\` as balances
  LEFT JOIN \`${bigQueryDatasetId}.${contractAddressesTableId}\` as addresses ON addresses.Address = balances.holder
  `;

const tokenBalancesNamedTable = new gcp.bigquery.Table(
  "token-balances-named",
  {
    datasetId: bigQueryDatasetId,
    tableId: "token-balances-named",
    deletionProtection: false,
    view: {
      query: tokenBalancesNamedQuery,
      useLegacySql: false,
    },
  },
  { dependsOn: [contractAddressesTable, tokenBalancesTable] },
);

export const tokenBalancesNamedTableId = tokenBalancesNamedTable.tableId;

/**
 * Create Alert Policies
 */
const NOTIFICATION_CHANNEL_EMAIL_JEM = "projects/utility-descent-365911/notificationChannels/11383785782274723218";
const NOTIFICATION_CHANNEL_DISCORD = "projects/utility-descent-365911/notificationChannels/13547536167280065674";

// Alert when functions crash
const ALERT_POLICY_FUNCTION_ERROR = `${FUNCTION_NAME}-function-error`;
const ALERT_POLICY_FUNCTION_ERROR_WINDOW_SECONDS = 15 * 60;
new gcp.monitoring.AlertPolicy(ALERT_POLICY_FUNCTION_ERROR, {
  displayName: ALERT_POLICY_FUNCTION_ERROR,
  conditions: [
    {
      displayName: "Function Status Not OK",
      conditionThreshold: {
        filter: `resource.type = "cloud_function" AND resource.labels.function_name = "${tokenBalancesFunctionName}" AND metric.type = "cloudfunctions.googleapis.com/function/execution_count" AND metric.labels.status != "ok"`,
        aggregations: [
          {
            alignmentPeriod: `${ALERT_POLICY_FUNCTION_ERROR_WINDOW_SECONDS}s`,
            crossSeriesReducer: "REDUCE_NONE",
            perSeriesAligner: "ALIGN_SUM",
          },
        ],
        comparison: "COMPARISON_GT",
        duration: "0s",
        trigger: {
          count: 1,
        },
      },
    },
  ],
  alertStrategy: {
    autoClose: "604800s",
  },
  combiner: "OR",
  enabled: true,
  notificationChannels: [NOTIFICATION_CHANNEL_EMAIL_JEM, NOTIFICATION_CHANNEL_DISCORD],
});

// Alert when there are more executions than expected (1 every hour)
const ALERT_POLICY_FUNCTION_EXECUTIONS = `${FUNCTION_NAME}-function-executions`;
const ALERT_POLICY_FUNCTION_EXECUTIONS_WINDOW_SECONDS = 15 * 60;
new gcp.monitoring.AlertPolicy(ALERT_POLICY_FUNCTION_EXECUTIONS, {
  displayName: ALERT_POLICY_FUNCTION_EXECUTIONS,
  conditions: [
    {
      displayName: `Function Executions > 1 / ${ALERT_POLICY_FUNCTION_EXECUTIONS_WINDOW_SECONDS / 60} minutes`,
      conditionThreshold: {
        filter: `resource.type = "cloud_function" AND resource.labels.function_name = "${tokenBalancesFunctionName}" AND metric.type = "cloudfunctions.googleapis.com/function/execution_count"`,
        aggregations: [
          {
            alignmentPeriod: `${ALERT_POLICY_FUNCTION_EXECUTIONS_WINDOW_SECONDS}s`,
            crossSeriesReducer: "REDUCE_NONE",
            perSeriesAligner: "ALIGN_SUM",
          },
        ],
        comparison: "COMPARISON_GT",
        duration: "0s",
        trigger: {
          count: 1,
        },
        thresholdValue: 1,
      },
    },
  ],
  alertStrategy: {
    autoClose: "604800s",
  },
  combiner: "OR",
  enabled: true,
  notificationChannels: [NOTIFICATION_CHANNEL_EMAIL_JEM, NOTIFICATION_CHANNEL_DISCORD],
});

// Alert when the GCS bucket network activity is greater than expected
const ALERT_POLICY_GCS_NETWORK = `${FUNCTION_NAME}-gcs-activity`;
const ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS = 15 * 60;
const NETWORK_THRESHOLD_BYTES = 100000000;
new gcp.monitoring.AlertPolicy(ALERT_POLICY_GCS_NETWORK, {
  displayName: ALERT_POLICY_GCS_NETWORK,
  conditions: [
    {
      displayName: `GCS Bucket Received > 100 MB / ${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS / 60} min`,
      conditionThreshold: {
        filter: `resource.type = "gcs_bucket" AND resource.labels.bucket_name = "${tokenBalancesBucket}" AND metric.type = "storage.googleapis.com/network/received_bytes_count"`,
        aggregations: [
          {
            alignmentPeriod: `${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS}s`,
            crossSeriesReducer: "REDUCE_NONE",
            perSeriesAligner: "ALIGN_SUM",
          },
        ],
        comparison: "COMPARISON_GT",
        duration: "0s",
        trigger: {
          count: 1,
        },
        thresholdValue: NETWORK_THRESHOLD_BYTES,
      },
    },
    {
      displayName: `GCS Bucket Sent > 100 MB / ${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS / 60} min`,
      conditionThreshold: {
        filter: `resource.type = "gcs_bucket" AND resource.labels.bucket_name = "${tokenBalancesBucket}" AND metric.type = "storage.googleapis.com/network/sent_bytes_count"`,
        aggregations: [
          {
            alignmentPeriod: `${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS}s`,
            crossSeriesReducer: "REDUCE_NONE",
            perSeriesAligner: "ALIGN_SUM",
          },
        ],
        comparison: "COMPARISON_GT",
        duration: "0s",
        trigger: {
          count: 1,
        },
        thresholdValue: NETWORK_THRESHOLD_BYTES,
      },
    },
  ],
  alertStrategy: {
    autoClose: "604800s",
  },
  combiner: "OR",
  enabled: true,
  notificationChannels: [NOTIFICATION_CHANNEL_EMAIL_JEM, NOTIFICATION_CHANNEL_DISCORD],
});

/**
 * Create a dashboard for monitoring activity
 */
const DASHBOARD_NAME = `${FUNCTION_NAME}`;
new gcp.monitoring.Dashboard(
  DASHBOARD_NAME,
  {
    dashboardJson: pulumi.interpolate`
      {
        "category": "CUSTOM",
        "displayName": "${DASHBOARD_NAME}",
        "mosaicLayout": {
          "columns": 12,
          "tiles": [
            {
              "height": 4,
              "widget": {
                "title": "Function Executions per ${ALERT_POLICY_FUNCTION_EXECUTIONS_WINDOW_SECONDS / 60} minutes",
                "xyChart": {
                  "chartOptions": {
                    "mode": "COLOR"
                  },
                  "dataSets": [
                    {
                      "minAlignmentPeriod": "${ALERT_POLICY_FUNCTION_EXECUTIONS_WINDOW_SECONDS}s",
                      "plotType": "STACKED_AREA",
                      "targetAxis": "Y1",
                      "timeSeriesQuery": {
                        "apiSource": "DEFAULT_CLOUD",
                        "timeSeriesFilter": {
                          "aggregation": {
                            "alignmentPeriod": "${ALERT_POLICY_FUNCTION_EXECUTIONS_WINDOW_SECONDS}s",
                            "crossSeriesReducer": "REDUCE_SUM",
                            "groupByFields": [
                              "metric.label.status"
                            ],
                            "perSeriesAligner": "ALIGN_SUM"
                          },
                          "filter": "resource.type = \\"cloud_function\\" resource.labels.function_name = \\"${tokenBalancesFunctionName}\\" metric.type = \\"cloudfunctions.googleapis.com/function/execution_count\\""
                        }
                      }
                    }
                  ],
                  "thresholds": [],
                  "timeshiftDuration": "0s",
                  "yAxis": {
                    "label": "y1Axis",
                    "scale": "LINEAR"
                  }
                }
              },
              "width": 6,
              "xPos": 0,
              "yPos": 0
            },
            {
              "height": 4,
              "widget": {
                "title": "GCS Bucket Received Bytes per ${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS / 60} minutes",
                "xyChart": {
                  "chartOptions": {
                    "mode": "COLOR"
                  },
                  "dataSets": [
                    {
                      "minAlignmentPeriod": "${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS}s",
                      "plotType": "STACKED_AREA",
                      "targetAxis": "Y1",
                      "timeSeriesQuery": {
                        "apiSource": "DEFAULT_CLOUD",
                        "timeSeriesFilter": {
                          "aggregation": {
                            "alignmentPeriod": "${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS}s",
                            "crossSeriesReducer": "REDUCE_NONE",
                            "perSeriesAligner": "ALIGN_SUM"
                          },
                          "filter": "resource.type=\\"gcs_bucket\\" resource.label.bucket_name=\\"${tokenBalancesBucket}\\" metric.type=\\"storage.googleapis.com/network/received_bytes_count\\""
                        }
                      }
                    }
                  ],
                  "thresholds": [],
                  "timeshiftDuration": "0s",
                  "yAxis": {
                    "label": "y1Axis",
                    "scale": "LINEAR"
                  }
                }
              },
              "width": 6,
              "xPos": 6,
              "yPos": 0
            },
            {
              "height": 4,
              "widget": {
                "title": "GCS Bucket Sent Bytes per ${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS / 60} minutes",
                "xyChart": {
                  "chartOptions": {
                    "mode": "COLOR"
                  },
                  "dataSets": [
                    {
                      "minAlignmentPeriod": "${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS}s",
                      "plotType": "STACKED_AREA",
                      "targetAxis": "Y1",
                      "timeSeriesQuery": {
                        "apiSource": "DEFAULT_CLOUD",
                        "timeSeriesFilter": {
                          "aggregation": {
                            "alignmentPeriod": "${ALERT_POLICY_GCS_NETWORK_WINDOW_SECONDS}s",
                            "crossSeriesReducer": "REDUCE_NONE",
                            "perSeriesAligner": "ALIGN_SUM"
                          },
                          "filter": "resource.type=\\"gcs_bucket\\" resource.label.bucket_name=\\"${tokenBalancesBucket}\\" metric.type=\\"storage.googleapis.com/network/sent_bytes_count\\""
                        }
                      }
                    }
                  ],
                  "thresholds": [],
                  "timeshiftDuration": "0s",
                  "yAxis": {
                    "label": "y1Axis",
                    "scale": "LINEAR"
                  }
                }
              },
              "width": 6,
              "xPos": 6,
              "yPos": 4
            }
          ]
        }
      }`,
  },
  { dependsOn: [tokenBalancesBucket, tokenBalancesFunction] },
);
export const dashboardName = DASHBOARD_NAME;
