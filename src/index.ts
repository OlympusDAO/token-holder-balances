import { existsSync, readFileSync, writeFileSync } from "fs";
import {
  TokenHolderTransaction,
  TransactionsDocument,
} from "./graphql/generated";
import { Client, createClient } from "@urql/core";
import fetch from "cross-fetch";

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
  const finalDate = new Date();
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
  writeFileSync(recordsPath, JSON.stringify(baseRecords, null, 2));

  return baseRecords;
};

async function main() {
  const records = await getRecords();
  console.info(`${records.length} are available`);
}

if (require.main === module) {
  main();
}
