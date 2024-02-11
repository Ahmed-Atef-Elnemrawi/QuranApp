export interface Operations<T> {
  /**
   * Gets an item from the object store by key.
   * @param {string} key The key of the item to get.
   * @returns {Promise<T>} A promise that resolves to the item.
   */
  get: (key: number | string) => Promise<T>;

  /**
   * Gets all items from the object store.
   * @returns {Promise<T[]>} A promise that resolves to an array of items.
   */
  getAll: () => Promise<T[]>;

  /**
   * Adds an item to the object store.
   * @param {T} item The item to add.
   * @returns {Promise<void>} A promise that resolves when the item is added.
   */
  add: (item: T) => Promise<void>;

  /**
   * Updates an item in the object store.
   * @param {T} item The item to update.
   * @returns {Promise<void>} A promise that resolves when the item is updated.
   */
  update: (item: T) => Promise<void>;

  /**
   * Deletes an item from the object store by ID.
   * @param {number} id The ID of the item to delete.
   * @returns {Promise<void>} A promise that resolves when the item is deleted.
   */
  delete: (key: string) => Promise<void>;

  /**
   * Clears the object store.
   * @returns {Promise<void>} A promise that resolves when the store is cleared.
   */
  clear: () => Promise<void>;
}
