import { EspData, serverData } from './dataCommon';
import { getEspFromLTime } from './getEsp';

const dbName = 'espData';
const actualVersion = 3;
const URLS_STORE_NAME = 'serverURLs';

export function startDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.onerror = (event: Event) => {
        const request = event.target as IDBOpenDBRequest;
        reject(
          new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`),
        );
      };
      db.close();
      resolve(); // Resolve the promise when the operation is successful
    };

    request.onerror = (event: Event) => {
      const request = event.target as IDBOpenDBRequest;
      reject(
        new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`),
      );
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('fuera')) {
        console.log('[INFO] Creating object store: fuera');
        const objectStore = db.createObjectStore('fuera', { keyPath: 'time' });
        objectStore.createIndex('time', 'time', { unique: false });
        objectStore.createIndex('temp', 'temp', { unique: false });
        objectStore.createIndex('hum', 'hum', { unique: false });
      }
      if (!db.objectStoreNames.contains('dentro')) {
        console.log('[INFO] Creating object store: dentro');
        const objectStore = db.createObjectStore('dentro', { keyPath: 'time' });
        objectStore.createIndex('time', 'time', { unique: false });
        objectStore.createIndex('temp', 'temp', { unique: false });
        objectStore.createIndex('hum', 'hum', { unique: false });
      }
      if (!db.objectStoreNames.contains(URLS_STORE_NAME)) {
        console.log('[INFO] Creating object store: serverURLs');
        db.createObjectStore(URLS_STORE_NAME, {
          keyPath: 'placeName',
        });
      }
    };

    request.onblocked = () => {
      reject(new Error('[USER_EXCEPT] Database blocked'));
    };
  });
}

export function setURLForPlaceName(data: serverData): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const dbErrFunct = (event: Event) => {
      const request = event.target as IDBOpenDBRequest;
      reject(
        new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`),
      );
    };

    let db: IDBDatabase | null = null;
    const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);

    request.onsuccess = (event: Event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.onerror = dbErrFunct;

      const transaction = db.transaction(URLS_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(URLS_STORE_NAME);
      const request = store.put(data);
      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        resolve(false);
      };
    };

    request.onerror = dbErrFunct;
  });
}

export function getURLFromPlaceName(placeName: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const dbErrFunct = (event: Event) => {
      const request = event.target as IDBOpenDBRequest;
      reject(
        new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`),
      );
    };

    let db: IDBDatabase | null = null;
    const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);

    request.onsuccess = (event: Event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.onerror = dbErrFunct;

      const transaction = db.transaction(URLS_STORE_NAME, 'readonly');
      const store = transaction.objectStore(URLS_STORE_NAME);
      const request = store.get(placeName);
      request.onsuccess = () => {
        resolve(request.result.url);
      };

      request.onerror = () => {
        resolve(null);
      };
    };

    request.onerror = dbErrFunct;
  });
}

export function getSaveEspData(placeName: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const dbErrFunct = () => {
      resolve('Failed to save data.');
      return;
    };

    let db: IDBDatabase | null = null;
    // Open DB
    const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);

    request.onsuccess = async (event: Event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.onerror = dbErrFunct;

      // Retrieve the last time asynchronously
      const lastTime = await getLastTime_ne(db, placeName);
      // Retrieve the serverData that contains the URL
      const url = await getURLFromPlaceName(placeName);
      if (!url) {
        resolve('Failed to get url from internal database.');
        return;
      }

      // Get data from server
      const data = await getEspFromLTime(lastTime, { placeName, url });
      if (!data) {
        resolve('No data downloaded');
        return;
      }

      // Save data after lastTime is retrieved
      const transaction = db.transaction(placeName, 'readwrite');
      const writeStore = transaction.objectStore(placeName);
      data.forEach((element) => {
        if (element.time > lastTime) {
          writeStore.add(element);
        }
      });
      resolve(data.length + ' item(s) saved.');
    };

    request.onerror = dbErrFunct;

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(placeName)) {
        console.log(`[INFO] Creating object store: ${placeName}`);
        const objectStore = db.createObjectStore(placeName, {
          keyPath: 'time',
        });
        objectStore.createIndex('time', 'time', { unique: false });
        objectStore.createIndex('temp', 'temp', { unique: false });
        objectStore.createIndex('hum', 'hum', { unique: false });
      }
    };
  });
}

export function saveToDBEspData(data: EspData[], storeName: string): void {
  const dbErrFunct = (event: Event) => {
    const request = event.target as IDBOpenDBRequest;
    throw new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`);
  };

  let db: IDBDatabase | null = null;
  // Open DB
  const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);

  request.onsuccess = async (event: Event) => {
    db = (event.target as IDBOpenDBRequest).result;
    db.onerror = dbErrFunct;

    if (!db.objectStoreNames.contains(storeName)) {
      console.log(`[INFO] Creating object store: ${storeName}`);
      const objectStore = db.createObjectStore(storeName, { keyPath: 'time' });
      objectStore.createIndex('time', 'time', { unique: false });
      objectStore.createIndex('temp', 'temp', { unique: false });
      objectStore.createIndex('hum', 'hum', { unique: false });
    }

    // Retrieve the last time asynchronously
    const lastTime = await getLastTime_ne(db, storeName);

    // Save data after lastTime is retrieved
    const transaction = db.transaction(storeName, 'readwrite');
    const writeStore = transaction.objectStore(storeName);
    data.forEach((element) => {
      if (element.time > lastTime) {
        writeStore.add(element);
      }
    });
  };

  request.onerror = dbErrFunct;

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains(storeName)) {
      console.log(`[INFO] Creating object store: ${storeName}`);
      const objectStore = db.createObjectStore(storeName, { keyPath: 'time' });
      objectStore.createIndex('time', 'time', { unique: false });
      objectStore.createIndex('temp', 'temp', { unique: false });
      objectStore.createIndex('hum', 'hum', { unique: false });
    }
  };
}

export async function getLastTime(placeName: string): Promise<number> {
  startDB();

  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = () => {
      reject(0);
    };
  });

  return getLastTime_ne(db, placeName);
}

function getLastTime_ne(db: IDBDatabase, storeName: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('time');
    const request = index.openCursor(null, 'prev');

    request.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        resolve(cursor.value.time);
      } else {
        resolve(0); // If no records are found, return 0
      }
    };

    request.onerror = () => {
      reject(
        new Error(
          `[USER_EXCEPT] Failed to retrieve last time: ${request.error?.message}`,
        ),
      );
    };
  });
}

export function getFromTimeDB(
  startTime: number,
  storeName: string,
): Promise<EspData[]> {
  return new Promise((resolve, reject) => {
    const dbErrFunct = (event: Event) => {
      const request = event.target as IDBOpenDBRequest;
      reject(
        new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`),
      );
    };

    let db: IDBDatabase | null = null;
    const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);

    request.onsuccess = (event: Event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.onerror = dbErrFunct;

      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index('time');
      const request = index.openCursor(IDBKeyRange.lowerBound(startTime));

      const data: EspData[] = [];
      request.onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          resolve(data);
        }
      };

      request.onerror = dbErrFunct;
    };

    request.onerror = dbErrFunct;
  });
}

export function getAllEspData(storeName: string): Promise<EspData[]> {
  return new Promise((resolve, reject) => {
    const dbErrFunct = (event: Event) => {
      const request = event.target as IDBOpenDBRequest;
      reject(
        new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`),
      );
    };

    let db: IDBDatabase | null = null;
    const request: IDBOpenDBRequest = indexedDB.open(dbName, actualVersion);

    request.onsuccess = (event: Event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.onerror = dbErrFunct;

      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = dbErrFunct;
    };

    request.onerror = dbErrFunct;
  });
}
