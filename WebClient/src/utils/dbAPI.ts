import { EspData } from './dataCommon';

const dbName = 'espData';

export function startDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(dbName, 1);

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
    };

    request.onblocked = (event: Event) => {
      reject(new Error('[USER_EXCEPT] Database blocked'));
    };
  });
}

export function saveToDB(data: EspData[], storeName: string): void {
  const dbErrFunct = (event: Event) => {
    const request = event.target as IDBOpenDBRequest;
    throw new Error(`[USER_EXCEPT] Database error: ${request.error?.message}`);
  };

  let db: IDBDatabase | null = null;
  // Open DB
  const request: IDBOpenDBRequest = indexedDB.open(dbName, 1);

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
    const lastTime = await getLastTime(db, storeName);

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

function getLastTime(db: IDBDatabase, storeName: string): Promise<number> {
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

    request.onerror = (event: Event) => {
      reject(
        new Error(
          `[USER_EXCEPT] Failed to retrieve last time: ${request.error?.message}`,
        ),
      );
    };
  });
}
