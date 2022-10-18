import { Client, createClient } from "@urql/core";
import fetch from "cross-fetch";

import { SUBGRAPH_URL } from "./constants";
import { TokenHolderTransaction } from "./graphql/generated";
import { getEnvFinalDate } from "./helpers/env";
import { recordsFileExists, writeRecords } from "./helpers/recordFs";
import { getEarliestTransactionDate, getGraphQLRecords, getLatestTransactionDate } from "./subgraph";

const getLatestFetchedRecordsDate = async (earliestDate: Date, finalDate: Date): Promise<Date> => {
  const timeDelta = 24 * 60 * 60 * 1000; // 1 day
  let currentDate = earliestDate;

  while (currentDate < finalDate) {
    // If a file doesn't exist, return one day earlier (in case we did not get all records from the day)
    if (!(await recordsFileExists(currentDate))) {
      return new Date(currentDate.getTime() - timeDelta);
    }

    // Increment
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }

  return finalDate;
};

/**
 * Returns the date up to which the subgraph data exists.
 *
 * As the subgraph query is performed up to a certain date (< 2022-10-18T00:00:00Z),
 * the Date returned by this function will be one day after the timestamp of the latest record.
 */
const getFinalDate = async (client: Client): Promise<Date> => {
  // Timestamp of the latest transaction record
  const latestDate: Date = await getLatestTransactionDate(client);

  // We transform this into midnight of the same day/start of the next day
  const finalDate = new Date(latestDate.getTime() + 24 * 60 * 60 * 1000);
  finalDate.setUTCHours(0, 0, 0, 0);
  return finalDate;
};

/**
 * Returns the earliest date for which the subgraph data exists.
 *
 * As the subgraph query is performed from a certain date (>= 2022-10-18T00:00:00Z),
 * the Date returned by this function will be the start of the day of the earliest record.
 */
const getEarliestDate = async (client: Client): Promise<Date> => {
  // Timestamp of the earliest transaction record
  const earliestDate: Date = await getEarliestTransactionDate(client);

  // We transform this into the start of the same day
  const finalDate = new Date(earliestDate.getTime());
  finalDate.setUTCHours(0, 0, 0, 0);
  return finalDate;
};

export const getRecords = async (): Promise<void> => {
  console.info(`Fetching records`);
  const client = createClient({
    url: SUBGRAPH_URL,
    fetch,
  });

  const earliestDate: Date = await getEarliestDate(client);
  console.log(`Earliest date is ${earliestDate.toISOString()}`);
  const finalDate: Date = getEnvFinalDate() || (await getFinalDate(client));
  console.log(`Final date is ${finalDate.toISOString()}`);
  let startDate: Date = await getLatestFetchedRecordsDate(earliestDate, finalDate);
  console.log(`Start date is ${startDate.toISOString()}`);
  const timeDelta: number = 24 * 60 * 60 * 1000; // 1 day

  // We loop over each day, fetch records and write those to disk
  while (startDate < finalDate) {
    const records: TokenHolderTransaction[] = await getGraphQLRecords(client, startDate);

    // Write to file
    await writeRecords(records, startDate);

    // Increment for the next loop
    startDate = new Date(startDate.getTime() + timeDelta);
  }
};
