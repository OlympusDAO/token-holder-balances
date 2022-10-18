import { File, Storage } from "@google-cloud/storage";

export const getFile = (bucketName: string, fileName: string): File => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  return bucket.file(fileName);
};

export const putFile = async (
  bucketName: string,
  fileName: string,
  fileContents: string
): Promise<void> => {
  const file = getFile(bucketName, fileName);
  await file.save(fileContents);
};

export const fileExists = async (
  bucketName: string,
  fileName: string
): Promise<boolean> => {
  const file = getFile(bucketName, fileName);
  return (await file.exists())[0];
};
