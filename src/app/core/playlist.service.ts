import { Injectable, inject } from '@angular/core';
import { AppIDBService } from './DB/app-idb.service';
import { Playlist } from './model/playlist';
import { APP_LOGGER } from '.';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  #appDB = inject(AppIDBService);
  #playlistStore = this.#appDB.store<Playlist>('playlists');
  #logger = inject(APP_LOGGER);

  async getAllPlaylists(): Promise<Playlist[]> {
    try {
      return await this.#playlistStore.getAll();
    } catch (error) {
      this.#logger.error('Error retrieving playlists:', error);
      return [];
    }
  }

  async getPlaylist(name: string): Promise<Playlist | undefined> {
    try {
      return await this.#playlistStore.get(name);
    } catch (error) {
      this.#logger.error('Error retrieving playlist:', error);
      return undefined;
    }
  }

  async addPlaylist(item: Playlist): Promise<void> {
    try {
      const result = await this.getPlaylist(item.name);
      if (!result) {
        await this.#playlistStore.add(item);
      }
    } catch (error) {
      this.#logger.error('Error adding playlist:', error);
    }
  }

  async removePlaylist(name: string): Promise<void> {
    try {
      const result = await this.getPlaylist(name);
      if (result) {
        await this.#playlistStore.delete(name);
      }
    } catch (error) {
      this.#logger.error('Error removing playlist:', error);
    }
  }

  async updatePlaylist(item: Playlist): Promise<void> {
    try {
      const result = await this.getPlaylist(item.name);
      if (result) {
        await this.#playlistStore.update(item);
      }
    } catch (error) {
      this.#logger.error('Error updating playlist:', error);
    }
  }

  async clearPlaylist(): Promise<void> {
    try {
      await this.#playlistStore.clear();
    } catch (error) {
      this.#logger.error('Error clearing playlists', error);
    }
  }
}
