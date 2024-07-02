import fs from 'fs/promises';
import path from 'path';

export async function readMd(filePath: string) {
  const pathFind = path.join(process.cwd(), filePath);
  const file = await fs.readFile(pathFind);
  return file.toString();
}