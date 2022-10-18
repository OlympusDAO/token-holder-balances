import { Client, createClient } from "@urql/core";
import fetch from "cross-fetch";
import { existsSync, readFileSync } from "fs";

import { SUBGRAPH_URL } from "./constants";
import { TokenHolderTransaction } from "./graphql/generated";
import { getISO8601DateString } from "./helpers/date";
import { writeFile } from "./helpers/fs";
import {
  getEarliestTransactionDate,
  getGraphQLRecords,
  getLatestTransactionDate,
} from "./subgraph";

const recordsPath = "output/records";

const getRecordsFilePath = (date: Date): string => {
  return `${recordsPath}/${getISO8601DateString(date)}.json`;
};

const getLatestFetchedRecordsDate = (
  earliestDate: Date,
  finalDate: Date
): Date => {
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

/**
 * Returns the date up to which the subgraph data exists.
 *
 * As the subgraph query is performed up to a certain date (< 2022-10-18T00:00:00Z),
 * the Date returned by this function will be one day after the timestamp of the latest record.
 */
const getFinalDate = async (client: Client): Promise<Date> => {
  // Timestamp of the latest transaction record
  const latestDate = await getLatestTransactionDate(client);

  // We transform this into midnight of the same day/start of the next day
  const finalDate = new Date(latestDate.getTime() + 24 * 60 * 60 * 1000);
  finalDate.setUTCHours(0, 0, 0, 0);
  console.log(`Final date is ${finalDate.toISOString()}`);
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
  const earliestDate = await getEarliestTransactionDate(client);

  // We transform this into the start of the same day
  const finalDate = new Date(earliestDate.getTime());
  finalDate.setUTCHours(0, 0, 0, 0);
  console.log(`Earliest date is ${finalDate.toISOString()}`);
  return finalDate;
};

export const getRecords = async (): Promise<void> => {
  console.info(`Fetching records`);
  const client = createClient({
    url: SUBGRAPH_URL,
    fetch,
  });

  const earliestDate = await getEarliestDate(client);
  // TODO add flag for final date
  const finalDate = new Date("2022-02-01"); //await getFinalDate(client);
  let startDate = getLatestFetchedRecordsDate(earliestDate, finalDate);
  console.log(`Start date is ${startDate.toISOString()}`);
  const timeDelta = 24 * 60 * 60 * 1000; // 1 day

  // We loop over each day, fetch records and write those to disk
  while (startDate < finalDate) {
    const records = await getGraphQLRecords(client, startDate);

    // Write to file
    writeFile(getRecordsFilePath(startDate), JSON.stringify(records, null, 2));

    // Increment for the next loop
    startDate = new Date(startDate.getTime() + timeDelta);
  }
};

export const readRecords = (date: Date): TokenHolderTransaction[] => {
  const filePath = getRecordsFilePath(date);
  if (!existsSync(filePath)) {
    return [];
  }

  return JSON.parse(
    readFileSync(filePath, "utf-8")
  ) as TokenHolderTransaction[];
};
