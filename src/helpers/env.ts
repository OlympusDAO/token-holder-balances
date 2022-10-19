import * as dotenv from "dotenv";
dotenv.config();

export const validateEnvironment = (): void => {
  getGCSBucket();

  getBQDataset();
};

export const getEnvFinalDate = (): Date | null => {
  if (!process.env.RECORD_FINAL_DATE) {
    return null;
  }

  const envFinalDateString = process.env.RECORD_FINAL_DATE;
  console.log(`Overriding final date from FINAL_DATE: ${envFinalDateString}`);
  return new Date(envFinalDateString);
};

export const isCSVEnabled = (): boolean => {
  if (typeof process.env.OUTPUT_CSV === "undefined") return false;

  return process.env.OUTPUT_CSV.toLowerCase() === "true";
};

export const getGCSBucket = (): string => {
  if (!process.env.GCS_BUCKET || process.env.GCS_BUCKET.length === 0) {
    throw new Error("GCS_BUCKET environment variable must be defined");
  }

  return process.env.GCS_BUCKET;
};

export const getBQDataset = (): string => {
  if (!process.env.BQ_DATASET || process.env.BQ_DATASET.length === 0) {
    throw new Error("BQ_DATASET environment variable must be defined");
  }

  return process.env.BQ_DATASET;
};
