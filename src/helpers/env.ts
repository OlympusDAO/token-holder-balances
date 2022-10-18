export const validateEnvironment = (): void => {
  // TODO add validation
};

export const getEnvFinalDate = (): Date | null => {
  if (!process.env.FINAL_DATE) {
    return null;
  }

  const envFinalDateString = process.env.FINAL_DATE;
  console.log(`Overriding final date from FINAL_DATE: ${envFinalDateString}`);
  return new Date(envFinalDateString);
};

export const isCSVEnabled = (): boolean => {
  if (typeof process.env.OUTPUT_CSV === "undefined") return false;

  return process.env.OUTPUT_CSV.toLowerCase() === "true";
};
