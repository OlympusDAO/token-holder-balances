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

/**
 * Returns the dates present in the specified GCS bucket.
 *
 * This function will check the contents of {bucket}/{path} for files in the format: {bucket}/{path}/dt=YYYY-MM-DD/records.jsonl
 *
 * @param bucket name of the GCS bucket
 * @param path path/prefix under which the partition directories are present
 * @returns Array of Date objects, in descending order
 */
const getRecordDates = async (bucket: string, path: string): Promise<Date[]> => {
  const fileNames = await listFiles(bucket, path);
  if (fileNames.length === 0) {
    return [];
  }

  // Excludes the dummy file
  const recordsFileNames = fileNames.filter(fileName => fileName.includes("records.jsonl"));
  const fileDates = recordsFileNames.map(fileName => new Date(extractPartitionKey(fileName)));
  return fileDates.sort((a, b) => b.getTime() - a.getTime());
};

/**
 * Returns the latest date for which a record file exists.
 *
 * @param bucket name of the GCS bucket
 * @param path path/prefix under which the partition directories are present
 * @returns Date of the latest records file, or null
 */
export const getLatestRecordsDate = async (bucket: string, path: string): Promise<Date | null> => {
  const sortedFileDates: Date[] = await getRecordDates(bucket, path);
  if (sortedFileDates.length === 0) {
    return null;
  }

  return sortedFileDates[0];
};

/**
 * Returns the earliest date for which a record file exists.
 *
 * @param bucket name of the GCS bucket
 * @param path path/prefix under which the partition directories are present
 * @returns Date of the earliest records file, or null
 */
export const getEarliestRecordsDate = async (bucket: string, path: string): Promise<Date | null> => {
  const sortedFileDates: Date[] = await getRecordDates(bucket, path);
  if (sortedFileDates.length === 0) {
    return null;
  }

  return sortedFileDates[sortedFileDates.length - 1];
};
