
import { generateBalances, getLatestBalanceDate } from "./balances";
import { getPubSubMessage } from "./helpers/pubsub";
import { getEarliestRecordsDate } from "./helpers/recordFs";

export const handler = async (balancesBucketPrefix: string, balancesBucketName: string, recordsBucketPrefix: string, recordsBucketName: string, functionTimeoutSeconds: number, req: unknown): Promise<void> => {
  console.log(`Bucket name: ${balancesBucketName}`);

  const initialTimestamp = new Date().getTime();
  const shouldTerminate = (): boolean => {
    const BUFFER_MS = 30000;
    const currentTimestamp = new Date().getTime();

    // If the current time is > initialTimestamp + functionTimeoutSeconds*1000 - buffer, exit
    if (currentTimestamp > initialTimestamp + (functionTimeoutSeconds*1000) - BUFFER_MS) {
      console.log(`Current timestamp ${currentTimestamp} is outside of buffer. Exiting.`);
      return true;
    }

    return false;
  }

  // Determine from the request if we have received a PubSub message
  const pubSubMessage: Record<string, string> = getPubSubMessage(req);
  const transactionStartDate: Date | null = pubSubMessage.startDate ? new Date(pubSubMessage.startDate) : null;
  console.log(`Transaction start date from PubSub: ${transactionStartDate}`);

  // Determine the current status of transactions and balances
  const latestBalanceDate: Date | null = await getLatestBalanceDate(balancesBucketName, balancesBucketPrefix);
  const earliestRecordsDate: Date | null = await getEarliestRecordsDate(recordsBucketName, recordsBucketPrefix);

  const getStartDate = (): Date | null => {
    // If there are no records, then we can't proceed
    if (!earliestRecordsDate) {
      return null;
    }

    // If there are no balances, we start from the earliest records
    if (!latestBalanceDate) {
      return earliestRecordsDate;
    }

    // If a PubSub message has passed a startDate (and balances exist before that), use that
    if (transactionStartDate !== null && transactionStartDate < latestBalanceDate) {
      return transactionStartDate;
    }

    // Otherwise use the last balance date
    return latestBalanceDate;
  }

  const startDate: Date | null = getStartDate();
  if (!startDate) {
    console.log(`Exiting, as there was no start date`);
    return;
  }

  console.log(`Start date is ${startDate.toISOString()}`);
  await generateBalances(balancesBucketName, balancesBucketPrefix, recordsBucketName, recordsBucketPrefix, startDate, shouldTerminate);
};

// Run locally using `yarn execute`. Inputs may need to be changed if re-deployments occur.
if (require.main === module) {
  handler("token-balances", "olympusdao-token-balances-dev-561e14f", "token-holders-transactions", "olympusdao-subgraph-cache-prod-f962a96", 540, {});
}