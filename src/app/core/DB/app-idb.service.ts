import { Injectable } from '@angular/core';
import { Operations } from './operations';

/**
 * A service for interacting with an IndexedDB database.
 */
@Injectable({
  providedIn: 'root',
})
export class AppIDBService {
  private db?: IDBDatabase;
  private readonly dbName = 'AppDB';
  private readonly dbVersion = 1;
  private readonly readOnly = 'readonly';
  private readonly readWrite = 'readwrite';

  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initializeDatabase();
  }

  /**
   * Initializes the database and returns a promise that resolves to the database instance.
   */
  private async initializeDatabase(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const playlists = db.createObjectStore('playlists', {
          keyPath: 'name',
          autoIncrement: true,
        });
        playlists.createIndex('name', 'name', { unique: true });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  /**
   * Executes a request on the specified object store and returns a promise that resolves to the result.
   */
  private async handleRequest<T>(
    storeName: string,
    mode: IDBTransactionMode,
    requestCallback: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    const db = await this.dbPromise;
    const transaction = db.transaction([storeName], mode);
    const objectStore = transaction.objectStore(storeName);
    const request = requestCallback(objectStore);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Returns an object that provides methods for interacting with the specified object store.
   * @function
   * @param {string} storeName The name of the object store to interact with.
   * @returns {Object} An object that provides methods for interacting with the object store.
   */
  store<T>(storeName: string): Operations<T> {
    return {
      get: (key: number | string): Promise<T> => {
        return this.handleRequest<T>(storeName, this.readOnly, (store) =>
          store.get(key)
        );
      },

      getAll: (): Promise<T[]> => {
        return this.handleRequest<T[]>(storeName, this.readOnly, (store) =>
          store.getAll()
        );
      },

      add: (item: T): Promise<void> => {
        return this.handleRequest<void>(storeName, this.readWrite, (store) =>
          store.add(item)
        );
      },

      update: (item: T): Promise<void> => {
        return this.handleRequest<void>(storeName, this.readWrite, (store) =>
          store.put(item)
        );
      },

      delete: (key: number | string): Promise<void> => {
        return this.handleRequest<void>(storeName, this.readWrite, (store) =>
          store.delete(key)
        );
      },

      clear: (): Promise<void> => {
        return this.handleRequest<void>(storeName, this.readWrite, (store) =>
          store.clear()
        );
      },
    };
  }
}
