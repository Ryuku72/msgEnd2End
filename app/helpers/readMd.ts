import fs from 'fs/promises';

export async function readMd(filePath: string) {
  const file = await fs.readFile(filePath);
  return file.toString();
}