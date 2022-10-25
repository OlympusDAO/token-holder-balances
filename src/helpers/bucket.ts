import { File, Storage } from "@google-cloud/storage";

export const getFile = (bucketName: string, fileName: string): File => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  return file;
};

export const putFile = async (bucketName: string, fileName: string, fileContents: string): Promise<void> => {
  const file = getFile(bucketName, fileName);
  await file.save(fileContents);
};

export const fileExists = async (bucketName: string, fileName: string): Promise<boolean> => {
  const file = getFile(bucketName, fileName);
  return (await file.exists())[0];
};

export const listFiles = async (bucketName: string, path: string): Promise<string[]> => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const [files] = await bucket.getFiles({ prefix:path });
  return files.map(file => file.name);
}