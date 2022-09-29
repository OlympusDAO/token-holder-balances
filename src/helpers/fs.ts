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
