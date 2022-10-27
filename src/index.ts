import { generateBalances, getLatestBalanceDate } from "./balances";
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
  const getStartDate = async (): Promise<Date | null> => {
    // Get the earliest date from any PubSub messages
    const pubSubEarliestStartDate: Date | null = await getEarliestStartDate(pubSubSubscriptionName);

    // Get the dates from balances and records
    const latestBalanceDate: Date | null = await getLatestBalanceDate(balancesBucketName, balancesBucketPrefix);
    const earliestRecordsDate: Date | null = await getEarliestRecordsDate(recordsBucketName, recordsBucketPrefix);

    // If there are no records, then we can't proceed
    if (!earliestRecordsDate) {
      return null;
    }

    // If there are no balances, we start from the earliest records
    if (!latestBalanceDate) {
      return earliestRecordsDate;
    }

    // If a PubSub message has passed a startDate (and balances exist before that), use that
    if (pubSubEarliestStartDate !== null && pubSubEarliestStartDate < latestBalanceDate) {
      return pubSubEarliestStartDate;
    }

    // Otherwise use the last balance date
    return latestBalanceDate;
  };

  const startDate: Date | null = await getStartDate();
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
    "olympusdao-token-balances-dev-561e14f",
    "token-holders-transactions",
    "olympusdao-subgraph-cache-prod-f962a96",
    540,
    "token-balances-dev",
  );
}
