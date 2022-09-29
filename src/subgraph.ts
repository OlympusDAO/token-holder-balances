import { Client } from "@urql/core";
import {
  TokenHolderTransaction,
  TransactionsDocument,
} from "./graphql/generated";
import { getISO8601DateString } from "./helpers/date";

/**
 * Fetches GraphQL records for the given range and page
 *
 * @param client
 * @param page
 * @param startDate
 * @param finishDate
 * @returns
 */
const fetchGraphQLRecords = async (
  client: Client,
  page: number,
  startDate: Date,
  finishDate: Date
): Promise<TokenHolderTransaction[]> => {
  console.debug(
    `Fetching records for date range ${startDate.toISOString()} - ${finishDate.toISOString()} and page ${page}`
  );
  const RECORD_COUNT = 1000;
  const queryResults = await client
    .query(TransactionsDocument, {
      count: RECORD_COUNT,
      skip: RECORD_COUNT * page,
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
  const nextRecords = await fetchGraphQLRecords(
    client,
    page + 1,
    startDate,
    finishDate
  );
  return [...records, ...nextRecords];
};

/**
 * Returns the GraphQL records for the given day (UTC)
 *
 * @param client
 * @param date
 */
export const getGraphQLRecords = async (
  client: Client,
  date: Date
): Promise<TokenHolderTransaction[]> => {
  const timeDelta = 6 * 60 * 60 * 1000; // 6 hours for each loop

  // Ensure the starting date is at midnight
  let queryStartDate = new Date(date.getTime());
  queryStartDate.setUTCHours(0);

  // Ending date is the start of the next day
  const finalDate = new Date(queryStartDate.getTime());
  finalDate.setUTCHours(24);

  const records: TokenHolderTransaction[] = [];
  while (queryStartDate < finalDate) {
    const queryFinishDate = new Date(queryStartDate.getTime() + timeDelta);

    const queryRecords = await fetchGraphQLRecords(
      client,
      0,
      queryStartDate,
      queryFinishDate
    );
    records.push(...queryRecords);

    // Increment for the next looo
    queryStartDate = queryFinishDate;
  }

  console.info(
    `Total of ${records.length} records for date ${getISO8601DateString(date)}`
  );
  return records;
};
