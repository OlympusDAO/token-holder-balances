
import { generateBalances, getLatestBalanceDate } from "./balances";

// TODO PubSub topic with date

export const handler = async (balancesBucketPrefix: string, balancesBucketName: string, recordsBucketPrefix: string, recordsBucketName: string): Promise<void> => {
  console.log(`Bucket name: ${balancesBucketName}`);

  // TODO recalculation when transactions are updated
  const startDate: Date = await getLatestBalanceDate(balancesBucketName, balancesBucketPrefix);
  console.log(`Start date is ${startDate.toISOString()}`);

  await generateBalances(balancesBucketName, balancesBucketPrefix, recordsBucketName, recordsBucketPrefix, startDate);
};

