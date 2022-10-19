import Big from "big.js";

import { TokenHolderTransaction } from "./graphql/generated";
import {
  balancesFileExists,
  readBalances,
  TokenHolderBalance,
  writeBalances,
  writeBalancesCSV,
} from "./helpers/balanceFs";
import { getISO8601DateString } from "./helpers/date";
import { isCSVEnabled } from "./helpers/env";
import { readRecords } from "./helpers/recordFs";

/**
 * Determines the key for a balance map
 *
 * @param balance
 * @returns
 */
const getBalanceKey = (balance: TokenHolderBalance): string => {
  return `${balance.holder}/${balance.token}/${balance.blockchain}`;
};

/**
 * Assign TokenHolderBalance objects to the keys returned by {getBalanceKey}
 *
 * @param balances
 * @returns
 */
const getBalanceMap = (balances: TokenHolderBalance[]): Map<string, TokenHolderBalance> => {
  // Convert to the required format
  return new Map<string, TokenHolderBalance>(
    balances.map((balance: TokenHolderBalance) => [getBalanceKey(balance), balance]),
  );
};

/**
 * Determines the latest date for which balances have been generated.
 *
 * @param earliestDate The earliest date for which balances can be generated
 * @param transactionDate The date for which transactions have been fetched
 * @returns
 */
export const getLatestBalancesDate = async (earliestDate: Date, transactionDate: Date): Promise<Date> => {
  console.log("\n\nChecking for latest balances");
  const timeDelta = 24 * 60 * 60 * 1000; // 1 day
  let currentDate = earliestDate;

  while (currentDate < transactionDate) {
    if (!(await balancesFileExists(currentDate))) {
      return currentDate;
    }

    // Increment
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }

  return transactionDate;
};

/**
 * Generates balances and writes them
 *
 * @param startDate
 */
export const generateBalances = async (startDate: Date): Promise<void> => {
  const shouldOutputCSV = isCSVEnabled();

  // Start at the startDate or earlier (if there are no balances)
  let currentDate: Date = startDate;

  // Loop through dates
  const finishDate = new Date();
  const timeDelta = 24 * 60 * 60 * 1000;
  while (currentDate <= finishDate) {
    const currentDateString = getISO8601DateString(currentDate);
    console.info(`Calculating balances for ${currentDateString}`);

    // Get balances for the previous day
    const previousDate = new Date(currentDate.getTime() - timeDelta);
    const balancesArray: TokenHolderBalance[] = await readBalances(previousDate);
    const balances: Map<string, TokenHolderBalance> = getBalanceMap(balancesArray);

    // Iterate over all of the current date's transactions and update balances
    const currentTransactions: TokenHolderTransaction[] = await readRecords(currentDate);
    currentTransactions.forEach(transaction => {
      const balanceKey = `${transaction.holder.holder.toString()}/${transaction.holder.token.name}/${
        transaction.holder.token.blockchain
      }`;

      // Fetch the existing balance, or create a new one
      const currentBalance = balances.get(balanceKey) || {
        balance: "0",
        blockchain: transaction.holder.token.blockchain,
        date: currentDateString,
        holder: transaction.holder.holder.toString(),
        token: transaction.holder.token.name,
      };

      currentBalance.date = currentDateString;
      // We use big.js here to ensure accuracy with floating point numbers
      currentBalance.balance = new Big(currentBalance.balance)
        .add(new Big(transaction.value))
        .toFixed(18)
        .replace(/(?:\.0+|(\.\d+?)0+)$/, "$1"); // Trim trailing zeroes

      balances.set(balanceKey, currentBalance);
    });

    // Trim 0 balances
    const trimmedBalances = Array.from(balances.values()).filter(balance => !new Big(balance.balance).eq(0));
    console.info(`  ${trimmedBalances.length} records (${balances.size - trimmedBalances.length} trimmed)`);

    await writeBalances(trimmedBalances, currentDate);

    // Write to CSV
    if (shouldOutputCSV) {
      await writeBalancesCSV(trimmedBalances, currentDate);
    }

    // Increment by a day
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }
};
