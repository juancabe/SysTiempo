import { EspFile, isEspFile } from './dataCommon';
import { saveToDBEspData, startDB } from './dbAPI';

export async function saveJsonToDB(file: File) {
  // Read the file structured content
  const fileText: string = await file.text();
  const parsedFile: EspFile = JSON.parse(fileText);
  if (!parsedFile || !isEspFile(parsedFile)) {
    throw new Error('[USER_EXCEPT] Invalid file format');
  }

  // Sort the data by time
  parsedFile.fuera.sort((a, b) => a.time - b.time);
  parsedFile.dentro.sort((a, b) => a.time - b.time);

  // DATABASE INIT
  await startDB();
  // Save data to database
  saveToDBEspData(parsedFile.fuera, 'fuera');
  saveToDBEspData(parsedFile.dentro, 'dentro');
}
