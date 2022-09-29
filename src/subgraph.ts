import { Client } from "@urql/core";
import {
  TokenHolderTransaction,
  TransactionsDocument,
} from "./graphql/generated";

export const fetchGraphQLRecords = async (
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
