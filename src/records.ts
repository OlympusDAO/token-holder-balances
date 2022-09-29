import { createClient } from "@urql/core";
import fetch from "cross-fetch";
import { existsSync, readFileSync } from "fs";
import { DATE_EARLIEST, DATE_FINAL } from "./constants";
import { TokenHolderTransaction } from "./graphql/generated";
import { getISO8601DateString } from "./helpers/date";
import { writeFile } from "./helpers/fs";
import { fetchGraphQLRecords } from "./subgraph";

const recordsPath = "output/records";

const getRecordsFilePath = (date: Date): string => {
  return `${recordsPath}/${getISO8601DateString(date)}.json`;
};

const getLatestRecordsDate = (): Date => {
  const timeDelta = 24 * 60 * 60 * 1000; // 1 day
  let currentDate = DATE_EARLIEST;

  while (currentDate < DATE_FINAL) {
    // If a file doesn't exist, return one day earlier (in case we did not get all records from the day)
    if (!existsSync(getRecordsFilePath(currentDate))) {
      return new Date(currentDate.getTime() - timeDelta);
    }

    // Increment
    currentDate = new Date(currentDate.getTime() + timeDelta);
  }

  return DATE_FINAL;
};

export const getRecords = async (): Promise<void> => {
  const client = createClient({
    url: "https://api.studio.thegraph.com/query/28103/token-holders/0.0.29",
    fetch,
  });

  let startDate = getLatestRecordsDate();
  const timeDelta = 6 * 60 * 60 * 1000; // 6 hours

  while (startDate < DATE_FINAL) {
    // Calculate the end of the next query loop
    const queryFinishDate = new Date(startDate.getTime() + timeDelta);

    // TODO handle multiple loops within a day
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

export const readRecords = (date: Date): TokenHolderTransaction[] => {
  const filePath = getRecordsFilePath(date);
  if (!existsSync(filePath)) {
    return [];
  }

  return JSON.parse(
    readFileSync(filePath, "utf-8")
  ) as TokenHolderTransaction[];
};
