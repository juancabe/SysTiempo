interface EspData {
  index: number;
  temp: number;
  hum: number;
  time: number;
}

function isEspData(data: any): data is EspData {
  return (
    typeof data === 'object' &&
    typeof data.index === 'number' &&
    typeof data.temp === 'number' &&
    typeof data.hum === 'number' &&
    typeof data.time === 'number'
  );
}

interface EspFile {
  fuera: EspData[];
  dentro: EspData[];
}

function isEspFile(data: any): data is EspFile {
  return (
    typeof data === 'object' &&
    Array.isArray(data.fuera) &&
    Array.isArray(data.dentro) &&
    data.fuera.every(isEspData) &&
    data.dentro.every(isEspData)
  );
}

const dbName = 'espData';

function saveToDB(data: EspData[], storeName: string): void {
  const dbErrFunct = (event: Event) => {
    const request = event.target as IDBOpenDBRequest;
    throw new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`);
  };

  let db: IDBDatabase | null = null;
  let objectStore: IDBObjectStore | null = null;
  // Open DB
  const request: IDBOpenDBRequest = indexedDB.open(dbName, 1);
  // Create handlers
  request.onsuccess = (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
    db.onerror = dbErrFunct;

    // MAIN DATABASE FUNCTIONALITY, needs to be inside this handler
    // to ensure db is not null
    // Gather last time from both object stores
    let lastTime = 0;
    let lastTimeDentro = 0;
    const transaction = db.transaction(storeName, 'readwrite');
  };

  request.onerror = dbErrFunct;

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains(storeName)) {
      objectStore = db.createObjectStore(storeName, { keyPath: 'time' });
      objectStore.createIndex('temp', 'temp', { unique: false });
      objectStore.createIndex('hum', 'hum', { unique: false });
    }
  };
}

export async function saveJsonToDB(file: File): Promise<boolean> {
  // Read the file structured content
  const fileText: string = await file.text();
  const parsedFile: EspFile = JSON.parse(fileText);
  if (!parsedFile || !isEspFile(parsedFile)) {
    throw new Error('[USER_EXCEPT] Invalid file format');
  }

  // Sort the data by time
  parsedFile.fuera.sort((a, b) => a.time - b.time);
  parsedFile.dentro.sort((a, b) => a.time - b.time);

  // DATABASE

  const dbErrFunct = (event: Event) => {
    const request = event.target as IDBOpenDBRequest;
    throw new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`);
  };

  let db: IDBDatabase | null = null;
  let objectStoreFuera: IDBObjectStore | null = null;
  let objectStoreDentro: IDBObjectStore | null = null;
  // Open DB
  const request: IDBOpenDBRequest = indexedDB.open('espData', 1);
  // Create handlers
  request.onsuccess = (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
    db.onerror = dbErrFunct;

    // MAIN DATABASE FUNCTIONALITY, needs to be inside this handler
    // to ensure db is not null
    // Gather last time from both object stores
    let lastTimeFuera = 0;
    let lastTimeDentro = 0;
    const transaction = db.transaction(['fuera', 'dentro'], 'readwrite');
  };
  request.onerror = dbErrFunct;

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains('fuera')) {
      objectStoreFuera = db.createObjectStore('fuera', { keyPath: 'time' });
      objectStoreFuera.createIndex('temp', 'temp', { unique: false });
      objectStoreFuera.createIndex('hum', 'hum', { unique: false });
    }
    if (!db.objectStoreNames.contains('dentro')) {
      objectStoreDentro = db.createObjectStore('dentro', { keyPath: 'time' });
      objectStoreDentro.createIndex('temp', 'temp', { unique: false });
      objectStoreDentro.createIndex('hum', 'hum', { unique: false });
    }
  };

  if (!db || !objectStoreFuera || !objectStoreDentro)
    throw new Error('[USER_EXCEPT] Database error: Database not opened');

  return true;
}
