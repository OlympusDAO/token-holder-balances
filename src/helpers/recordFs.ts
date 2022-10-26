import { File } from "@google-cloud/storage";
import JSONL from "jsonl-parse-stringify";

import { TokenHolderTransaction } from "../graphql/generated";
import { getFile, listFiles } from "./bucket";
import { getISO8601DateString } from "./date";
import { extractPartitionKey } from "./fs";

const getRecordsFilePath = (storagePrefix: string, date: Date, suffix: string): string => {
  return `${storagePrefix}/dt=${getISO8601DateString(date)}/records.${suffix}`;
};

/**
 * Reads the TokenHolderTransaction records for the given date.
 *
 * Currently this is read from Google Cloud Storage, however the
 * source may change in the future. The function is designed
 * to abstract the storage layer.
 *
 * @param date
 * @returns
 */
export const readRecords = async (
  storagePrefix: string,
  bucket: string,
  date: Date,
): Promise<TokenHolderTransaction[]> => {
  const filePath = getRecordsFilePath(storagePrefix, date, "jsonl");
  console.log(`Grabbing file ${filePath} in bucket ${bucket}`);
  const file: File = await getFile(bucket, filePath);
  if (!(await file.exists())[0]) {
    console.log(`Records file ${filePath} does not exist. Returning empty array.`);
    return [];
  }

  return JSONL.parse((await file.download())[0].toString("utf-8")) as TokenHolderTransaction[];
};

export const getLatestRecordsDate = async (bucket: string, path: string): Promise<Date | null> => {
  const fileNames = await listFiles(bucket, path);
  if (fileNames.length === 0) {
    return null;
  }

  // Excludes the dummy file
  const recordsFileNames = fileNames.filter(fileName => fileName.includes("records"));
  const fileDates = recordsFileNames.map(fileName => new Date(extractPartitionKey(fileName)));
  const sortedFileDates = fileDates.sort((a, b) => b.getTime() - a.getTime());
  return sortedFileDates[0];
};

export const getEarliestRecordsDate = async (bucket: string, path: string): Promise<Date | null> => {
  const fileNames = await listFiles(bucket, path);
  if (fileNames.length === 0) {
    return null;
  }

  // Excludes the dummy file
  const recordsFileNames = fileNames.filter(fileName => fileName.includes("records"));
  const fileDates = recordsFileNames.map(fileName => new Date(extractPartitionKey(fileName)));
  const sortedFileDates = fileDates.sort((a, b) => b.getTime() - a.getTime());
  return sortedFileDates[sortedFileDates.length - 1];
};
