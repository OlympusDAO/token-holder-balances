import JSONL from "jsonl-parse-stringify";
import ObjectsToCsv from "objects-to-csv";

import { fileExists, getFile, putFile } from "./bucket";
import { getISO8601DateString } from "./date";
import { getGCSBucket } from "./env";

export type TokenHolderBalance = {
  balance: string;
  blockchain: string;
  date: string;
  holder: string;
  token: string;
};

const balancesRoot = "output/balances";
const getBalancesFilePath = (date: Date, suffix: string): string => {
  return `${balancesRoot}/${getISO8601DateString(date)}.${suffix}`;
};

export const readBalances = async (date: Date): Promise<TokenHolderBalance[]> => {
  const filePath = getBalancesFilePath(date, "jsonl");
  const file = getFile(getGCSBucket(), filePath);
  if (!(await file.exists())[0]) {
    return [];
  }

  return JSONL.parse((await file.download())[0].toString("utf-8")) as TokenHolderBalance[];
};

export const writeBalances = async (balances: TokenHolderBalance[], date: Date): Promise<void> => {
  await putFile(getGCSBucket(), getBalancesFilePath(date, "jsonl"), JSONL.stringify(balances));
};

export const writeBalancesCSV = async (balances: TokenHolderBalance[], date: Date): Promise<void> => {
  const csvString = await new ObjectsToCsv(balances).toString();
  await putFile(getGCSBucket(), getBalancesFilePath(date, "csv"), csvString);
};

export const balancesFileExists = async (date: Date): Promise<boolean> => {
  const filePath = getBalancesFilePath(date, "jsonl");
  return await fileExists(getGCSBucket(), filePath);
};
