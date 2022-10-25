
import { generateBalances, getLatestBalanceDate } from "./balances";
import { getEarliestRecordsDate, getLatestRecordsDate } from "./helpers/recordFs";

// TODO PubSub topic with date

export const handler = async (balancesBucketPrefix: string, balancesBucketName: string, recordsBucketPrefix: string, recordsBucketName: string): Promise<void> => {
  console.log(`Bucket name: ${balancesBucketName}`);

  // TODO recalculation when transactions are updated
  const latestBalanceDate: Date | null = await getLatestBalanceDate(balancesBucketName, balancesBucketPrefix);
  const earliestRecordsDate: Date | null = await getEarliestRecordsDate(recordsBucketName, recordsBucketPrefix);
  if (latestBalanceDate == null && earliestRecordsDate == null) {
    throw new Error("Unable to fetch balance or record dates");
  }

  const startDate: Date = latestBalanceDate === null ? earliestRecordsDate! : latestBalanceDate;

  console.log(`Start date is ${startDate.toISOString()}`);

  await generateBalances(balancesBucketName, balancesBucketPrefix, recordsBucketName, recordsBucketPrefix, startDate);
};

