import Big from "big.js";
import { existsSync, readFileSync } from "fs";
import ObjectsToCsv from "objects-to-csv";
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

const readBalances = (date: Date): Map<string, TokenHolderBalance> => {
  const filePath = getBalancesFilePath(date, "json");
  if (!existsSync(filePath)) {
    return new Map<string, TokenHolderBalance>();
  }

  const balances = JSON.parse(readFileSync(filePath, "utf-8"));
  return new Map<string, TokenHolderBalance>(Object.entries(balances));
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

    console.info(`  ${balances.size} records`);

    // Write to file
    writeFile(
      getBalancesFilePath(currentDate, "json"),
      JSON.stringify(Object.fromEntries(balances), null, 2)
    );

    const csvString = await new ObjectsToCsv(
      Array.from(balances.values())
    ).toString();
    writeFile(getBalancesFilePath(currentDate, "csv"), csvString);

    // Increment by a day
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }
};
