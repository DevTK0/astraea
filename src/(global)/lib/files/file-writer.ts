import "server-only";

import { promises as fs } from "fs";

export async function writeToFile(fileName: string, fileContents: string) {
    await fs.writeFile(`/tmp/${fileName}`, `${fileContents}`);
}
