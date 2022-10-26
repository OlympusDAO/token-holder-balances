import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

export const writeFile = (filePath: string, content: string): void => {
  // Create folder
  const directory = path.dirname(filePath);
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  // Write file
  writeFileSync(filePath, content);
};

export const extractPartitionKey = (filePath: string): string => {
  // Expected input: token-balances/dt=2021-01-01/dummy.jsonl
  // Converted to token-balances/dt=2021-01-01
  const directoryPath = path.dirname(filePath);

  // Split into ["token-balances/dt=", "2021-01-01"]
  return directoryPath.split("dt=")[1];
};
