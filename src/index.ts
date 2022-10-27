import { generateBalances, getLatestBalanceDate } from "./balances";
import { getISO8601DateString } from "./helpers/date";
import { getEarliestStartDate } from "./helpers/pubsub";
import { getEarliestRecordsDate } from "./helpers/recordFs";

export const handler = async (
  balancesBucketPrefix: string,
  balancesBucketName: string,
  recordsBucketPrefix: string,
  recordsBucketName: string,
  functionTimeoutSeconds: number,
  pubSubSubscriptionName: string,
): Promise<void> => {
  console.log(`Bucket name: ${balancesBucketName}`);

  const initialTimestamp = new Date().getTime();
  const shouldTerminate = (): boolean => {
    const BUFFER_MS = 30000;
    const currentTimestamp = new Date().getTime();

    // If the current time is > initialTimestamp + functionTimeoutSeconds*1000 - buffer, exit
    if (currentTimestamp > initialTimestamp + functionTimeoutSeconds * 1000 - BUFFER_MS) {
      console.log(`Current timestamp ${currentTimestamp} is outside of buffer. Exiting.`);
      return true;
    }

    return false;
  };

  /**
   * Determines the start date, based on the following inputs:
   * - PubSub message queue
   * - The latest date for which balances have been calculated
   * - The earliest date for which transaction records exist
   *
   * @returns
   */
  const getFetchStartDate = async (): Promise<Date | null> => {
    // Get the earliest date from any PubSub messages
    const pubSubEarliestStartDate: Date | null = await getEarliestStartDate(pubSubSubscriptionName);

    // Get the dates from balances and records
    const latestBalanceDate: Date | null = await getLatestBalanceDate(balancesBucketName, balancesBucketPrefix);
    const earliestRecordsDate: Date | null = await getEarliestRecordsDate(recordsBucketName, recordsBucketPrefix);

    // If there are no records, then we can't proceed
    if (!earliestRecordsDate) {
      console.log(`getFetchStartDate: No records found. Returning null.`);
      return null;
    }

    // If there are no balances, we start from the earliest records
    if (!latestBalanceDate) {
      console.log(
        `getFetchStartDate: No balances found, using earliest records date: ${getISO8601DateString(
          earliestRecordsDate,
        )}`,
      );
      return earliestRecordsDate;
    }

    // If a PubSub message has passed a startDate (and balances exist before that), use that
    if (pubSubEarliestStartDate !== null && pubSubEarliestStartDate < latestBalanceDate) {
      console.log(
        `getFetchStartDate: Found start date in PubSub and it is less than the latest balance date: ${getISO8601DateString(
          pubSubEarliestStartDate,
        )}`,
      );
      return pubSubEarliestStartDate;
    }

    // Otherwise use the last balance date
    console.log(`getFetchStartDate: Using latest balance date: ${getISO8601DateString(latestBalanceDate)}`);
    return latestBalanceDate;
  };

  const startDate: Date | null = await getFetchStartDate();
  if (!startDate) {
    console.log(`Exiting, as there was no start date`);
    return;
  }

  console.log(`Start date is ${startDate.toISOString()}`);
  await generateBalances(
    balancesBucketName,
    balancesBucketPrefix,
    recordsBucketName,
    recordsBucketPrefix,
    startDate,
    shouldTerminate,
  );
};

// Run locally using `yarn execute`. Inputs may need to be changed if re-deployments occur.
if (require.main === module) {
  handler(
    "token-balances",
    "olympusdao-token-balances-dev-4cf74c6",
    "token-holders-transactions",
    "olympusdao-subgraph-cache-dev-47c613e",
    540,
    "projects/utility-descent-365911/subscriptions/token-balances-dev-1ed7686",
  );
}
