import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import {
  TokenHolderTransaction,
  TransactionsDocument,
} from "./graphql/generated";
import { Client, createClient } from "@urql/core";
import fetch from "cross-fetch";
import { getISO8601DateString } from "./dateHelper";
import * as CSV from "csv-string";
import Big from "big.js";
import path from "path";

const fetchGraphQLRecords = async (
  client: Client,
  page: number,
  startDate: Date,
  finishDate: Date
): Promise<TokenHolderTransaction[]> => {
  console.debug(
    `Fetching records for date range ${startDate.toISOString()} - ${finishDate.toISOString()} and page ${page}`
  );
  const recordCount = 1000;
  const queryResults = await client
    .query(TransactionsDocument, {
      count: recordCount,
      skip: recordCount * page,
      startDate: startDate.toISOString(),
      finishDate: finishDate.toISOString(),
    })
    .toPromise();

  if (!queryResults.data) {
    throw new Error(
      `Did not receive results from GraphQL query for page ${page}, start date ${startDate.toISOString()}, finish date ${finishDate.toISOString()}`
    );
  }

  const records = queryResults.data
    .tokenHolderTransactions as TokenHolderTransaction[];
  console.debug(`Received ${records.length} records`);
  // If we haven't hit the page limit...
  if (records.length < 1000) {
    return records;
  }

  // Otherwise we recursively fetch the next page
  return fetchGraphQLRecords(client, page + 1, startDate, finishDate);
};

const recordsPath = "output/records";
const earliestDate = new Date("2021-11-24T00:00:00.000Z");
const finalDate = new Date();

const getRecordsFilePath = (date: Date): string => {
  return `${recordsPath}/${getISO8601DateString(date)}.json`;
};

const getLatestRecordsDate = (): Date => {
  const timeDelta = 24 * 60 * 60 * 1000; // 1 day
  let currentDate = earliestDate;

  while (currentDate < finalDate) {
    // If a file doesn't exist, return one day earlier (in case we did not get all records from the day)
    if (!existsSync(getRecordsFilePath(currentDate))) {
      return new Date(currentDate.getTime() - timeDelta);
    }

    // Increment
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }

  return finalDate;
};

const writeFile = (filePath: string, content: string): void => {
  // Create folder
  const directory = path.dirname(filePath);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  // Write file
  writeFileSync(filePath, content);
};

const getRecords = async (): Promise<void> => {
  const client = createClient({
    url: "https://api.studio.thegraph.com/query/28103/token-holders/0.0.23",
    fetch,
  });

  let startDate = getLatestRecordsDate();
  const timeDelta = 6 * 60 * 60 * 1000; // 6 hours

  while (startDate < finalDate) {
    // Calculate the end of the next query loop
    const queryFinishDate = new Date(startDate.getTime() + timeDelta);

    const records = await fetchGraphQLRecords(
      client,
      0,
      startDate,
      queryFinishDate
    );

    // Write to file
    writeFile(getRecordsFilePath(startDate), JSON.stringify(records, null, 2));

    // Increment for the next loop
    startDate = queryFinishDate;
  }
};

type TokenHolderBalance = {
  balance: string;
  blockchain: string;
  date: string;
  holder: string;
  token: string;
};

const readRecords = (date: Date): TokenHolderTransaction[] => {
  const filePath = getRecordsFilePath(date);
  if (!existsSync(filePath)) {
    return [];
  }

  return JSON.parse(
    readFileSync(filePath, "utf-8")
  ) as TokenHolderTransaction[];
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

export const generateBalances = (): void => {
  // Loop through dates
  const startDate = earliestDate;
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
    // TODO FIX CSV output
    // writeFileSync(
    //   getBalancesFilePath(currentDate, "csv"),
    //   CSV.stringify(Array.from(balances.values()))
    // );

    // Increment by a day
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }
};

// TODO re-org/cleanup file

async function main() {
  await getRecords();

  generateBalances();
}

if (require.main === module) {
  main();
}
