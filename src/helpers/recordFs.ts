import { TokenHolderTransaction } from "../graphql/generated";
import { fileExists, getFile, listFiles, putFile } from "./bucket";
import { getISO8601DateString } from "./date";

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
export const readRecords = async (storagePrefix: string, bucket: string, date: Date): Promise<TokenHolderTransaction[]> => {
  const filePath = getRecordsFilePath(storagePrefix, date, "jsonl");
  const file = getFile(bucket, filePath);
  if (!(await file.exists())[0]) {
    return [];
  }

  return JSON.parse((await file.download())[0].toString("utf-8")) as TokenHolderTransaction[];
};

/**
 * Writes the TokenHolderTransaction records for the given date.
 *
 * Currently this is written to Google Cloud Storage, however the
 * destination may change in the future. The function is designed
 * to abstract the storage layer.
 */
export const writeRecords = async (storagePrefix: string, bucket: string, records: TokenHolderTransaction[], date: Date): Promise<void> => {
  const fileName = getRecordsFilePath(storagePrefix, date, "jsonl");

  await putFile(bucket, fileName, JSON.stringify(records));
};

/**
 * Determines if the records file for the given date exists.
 */
export const recordsFileExists = async (storagePrefix: string, bucket: string, date: Date): Promise<boolean> => {
  const filePath = getRecordsFilePath(storagePrefix, date, "jsonl");
  return await fileExists(bucket, filePath);
};

export const getLatestRecordsDate = async (bucket: string, path: string): Promise<Date> => {
  const fileNames = await listFiles(bucket, path);
  if (fileNames.length === 0) {
    throw new Error(`Expected record files to be present in ${bucket}/${path}, but there were none`);
  }

  return fileNames.map(fileName => new Date(fileName.split(".")[0] /* Before the file extension */)).sort((a, b) => b.getTime() - a.getTime())[0];
}