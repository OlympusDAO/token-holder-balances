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

const balancesRoot = "token-holder-balances";
const getBalancesFilePath = (date: Date, suffix: string): string => {
  return `${balancesRoot}/dt=${getISO8601DateString(date)}/balances.${suffix}`;
};

export const readBalances = async (bucketName: string, date: Date): Promise<TokenHolderBalance[]> => {
  const filePath = getBalancesFilePath(date, "jsonl");
  const file = getFile(bucketName, filePath);
  if (!(await file.exists())[0]) {
    return [];
  }

  return JSONL.parse((await file.download())[0].toString("utf-8")) as TokenHolderBalance[];
};

export const writeBalances = async (bucketName: string, balances: TokenHolderBalance[], date: Date): Promise<void> => {
  await putFile(bucketName, getBalancesFilePath(date, "jsonl"), JSONL.stringify(balances));
};

export const balancesFileExists = async (bucketName: string, date: Date): Promise<boolean> => {
  const filePath = getBalancesFilePath(date, "jsonl");
  return await fileExists(bucketName, filePath);
};
