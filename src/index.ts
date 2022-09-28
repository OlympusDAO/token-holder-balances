import { existsSync, readFileSync, writeFileSync } from "fs";
import {
  TokenHolderTransaction,
  TransactionsDocument,
} from "./graphql/generated";
import { Client, createClient } from "@urql/core";
import fetch from "cross-fetch";
import { getISO8601DateString } from "./dateHelper";
import * as CSV from "csv-string";
import Big from "big.js";

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

const getRecords = async (): Promise<TokenHolderTransaction[]> => {
  const recordsPath = "output/records.json";
  // TODO split into files by date
  // If the file exists, read and return
  if (existsSync(recordsPath)) {
    console.info(`Reading existing records from ${recordsPath}`);
    const content = readFileSync(recordsPath);

    return JSON.parse(content.toString());
  }

  const client = createClient({
    url: "https://api.studio.thegraph.com/query/28103/token-holders/0.0.23",
    fetch,
  });

  let startDate = new Date("2021-11-24");
  // const finalDate = new Date();
  const finalDate = new Date("2021-12-20");
  const timeDelta = 6 * 60 * 60 * 1000; // 6 hours
  const baseRecords = [];

  while (startDate < finalDate) {
    // Calculate the end of the next query loop
    const queryFinishDate = new Date(startDate.getTime() + timeDelta);

    const records = await fetchGraphQLRecords(
      client,
      0,
      startDate,
      queryFinishDate
    );
    baseRecords.push(...records);

    // Increment for the next loop
    startDate = queryFinishDate;
  }

  console.info(`Writing records to ${recordsPath}`);
  // TODO write to by-date files
  writeFileSync(recordsPath, JSON.stringify(baseRecords, null, 2));

  return baseRecords;
};

type TokenHolderBalance = {
  balance: string;
  blockchain: string;
  date: string;
  holder: string;
  token: string;
};

export const generateBalances = (
  records: TokenHolderTransaction[]
): Map<string, Map<string, TokenHolderBalance>> => {
  // Index by date
  const transactionsByDate = records.reduce((map, record) => {
    const recordDate = getISO8601DateString(new Date(record.date));
    const existingRecords = map.get(recordDate) || [];
    existingRecords.push(record);
    map.set(recordDate, existingRecords);
    return map;
  }, new Map<string, TokenHolderTransaction[]>());
  const balances = new Map<string, Map<string, TokenHolderBalance>>();

  // Loop through dates
  const startDate = new Date(
    Math.min(
      ...Array.from(transactionsByDate.keys()).map((dateString) =>
        new Date(dateString).getTime()
      )
    )
  );
  const finishDate = new Date();
  const timeDelta = 24 * 60 * 60 * 1000;
  let currentDate = startDate;
  while (currentDate <= finishDate) {
    const currentDateString = getISO8601DateString(currentDate);
    console.info(`Calculating balances for ${currentDateString}`);

    // Get balances for the previous day & restrict to balances that need to be updated for the current date
    const previousDate = getISO8601DateString(
      new Date(currentDate.getTime() - timeDelta)
    );
    const previousBalances = new Map<string, TokenHolderBalance>(
      Array.from(
        balances.get(previousDate) || new Map<string, TokenHolderBalance>()
      ).filter(([_key, value]) => parseFloat(value.balance) > 0)
    );
    // Use the previous day's balances as a starting point. Deep copy.
    const currentBalances: Map<string, TokenHolderBalance> = new Map<
      string,
      TokenHolderBalance
    >(JSON.parse(JSON.stringify([...previousBalances])));

    // Iterate over all of the current date's transactions and update balances
    const currentTransactions = transactionsByDate.get(currentDateString) || [];
    currentTransactions.forEach((transaction) => {
      const balanceKey = `${transaction.holder.holder.toString()}/${
        transaction.holder.token.name
      }/${transaction.holder.token.blockchain}`;

      // Fetch the existing balance, or create a new one
      const currentBalance = currentBalances.get(balanceKey) || {
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

      currentBalances.set(balanceKey, currentBalance);
    });

    console.info(`  ${currentBalances.size} records`);
    balances.set(currentDateString, currentBalances);

    // Increment by a day
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }

  return balances;
};

async function main() {
  const records = await getRecords();
  console.info(`${records.length} are available`);

  const balances = generateBalances(records);
  const flatBalances = Array.from(balances.values()).flatMap((value) => {
    return Array.from(value.values());
  });

  console.info(`Writing balances`);
  writeFileSync("output/balances.json", JSON.stringify(flatBalances, null, 2));
  // writeFileSync("output/balances.csv", CSV.stringify(flatBalances));
}

if (require.main === module) {
  main();
}
