import Big from "big.js";
import { existsSync, readFileSync } from "fs";
import JSONL from "jsonl-parse-stringify";

import { DATE_EARLIEST } from "./constants";
import { getISO8601DateString } from "./helpers/date";
import { writeFile } from "./helpers/fs";
import { readRecords } from "./records";

type TokenHolderBalance = {
  balance: string;
  blockchain: string;
  date: string;
  holder: string;
  token: string;
};

const balancesRoot = "output/balances";
const getBalancesFilePath = (date: Date, suffix: string): string => {
  return `${balancesRoot}/${getISO8601DateString(date)}.${suffix}`;
};

const getBalanceKey = (balance: TokenHolderBalance): string => {
  return `${balance.holder}/${balance.token}/${balance.blockchain}`;
};

const readBalances = (date: Date): Map<string, TokenHolderBalance> => {
  const filePath = getBalancesFilePath(date, "json");
  if (!existsSync(filePath)) {
    return new Map<string, TokenHolderBalance>();
  }

  // Stored as an array of TokenHolderBalance
  const balances = JSON.parse(readFileSync(filePath, "utf-8"));
  // Convert to the required format
  return new Map<string, TokenHolderBalance>(
    balances.map((balance: TokenHolderBalance) => [
      getBalanceKey(balance),
      balance,
    ])
  );
};

export const generateBalances = async (): Promise<void> => {
  // Loop through dates
  const startDate = DATE_EARLIEST;
  const finishDate = new Date();
  const timeDelta = 24 * 60 * 60 * 1000;
  let currentDate = startDate;
  while (currentDate <= finishDate) {
    const currentDateString = getISO8601DateString(currentDate);
    console.info(`Calculating balances for ${currentDateString}`);

    // Get balances for the previous day
    const previousDate = new Date(currentDate.getTime() - timeDelta);
    const balances = readBalances(previousDate);

    // Iterate over all of the current date's transactions and update balances
    const currentTransactions = readRecords(currentDate);
    currentTransactions.forEach((transaction) => {
      const balanceKey = `${transaction.holder.holder.toString()}/${
        transaction.holder.token.name
      }/${transaction.holder.token.blockchain}`;

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
    const trimmedBalances = Array.from(balances.values()).filter(
      (balance) => !new Big(balance.balance).eq(0)
    );
    console.info(
      `  ${trimmedBalances.length} records (${
        balances.size - trimmedBalances.length
      } trimmed)`
    );

    // Write to file
    writeFile(
      getBalancesFilePath(currentDate, "jsonl"),
      JSONL.stringify(trimmedBalances)
    );

    // TODO add flag for CSV output
    // const csvString = await new ObjectsToCsv(trimmedBalances).toString();
    // writeFile(getBalancesFilePath(currentDate, "csv"), csvString);

    // Increment by a day
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }
};
