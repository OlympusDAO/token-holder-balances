import { File } from "@google-cloud/storage";
import JSONL from "jsonl-parse-stringify";

import { fileExists, getFile, putFile } from "./bucket";
import { getISO8601DateString } from "./date";

export type TokenHolderBalance = {
  balance: string;
  blockchain: string;
  date: string;
  holder: string;
  token: string;
};

const getBalancesFilePath = (storagePrefix: string, date: Date, suffix: string): string => {
  return `${storagePrefix}/dt=${getISO8601DateString(date)}/balances.${suffix}`;
};

export const readBalances = async (storagePrefix: string, bucketName: string, date: Date): Promise<TokenHolderBalance[]> => {
  const filePath = getBalancesFilePath(storagePrefix, date, "jsonl");
  console.log(`Grabbing file ${filePath} in bucket ${bucketName}`);
  const file: File = await getFile(bucketName, filePath);
  if (!(await file.exists())[0]) {
    console.log(`Balances file ${filePath} does not exist. Returning empty array.`);
    return [];
  }

  return JSONL.parse((await file.download())[0].toString("utf-8")) as TokenHolderBalance[];
};

export const writeBalances = async (storagePrefix: string, bucketName: string, balances: TokenHolderBalance[], date: Date): Promise<void> => {
  await putFile(bucketName, getBalancesFilePath(storagePrefix, date, "jsonl"), JSONL.stringify(balances));
};

export const balancesFileExists = async (storagePrefix: string,bucketName: string, date: Date): Promise<boolean> => {
  const filePath = getBalancesFilePath(storagePrefix, date, "jsonl");
  return await fileExists(bucketName, filePath);
};
