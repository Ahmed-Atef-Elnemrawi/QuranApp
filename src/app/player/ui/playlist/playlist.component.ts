import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Playlist } from '../../../core/model/playlist';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'playlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playlist.component.html',
  styles: `
    :host{
      @apply flex place-content-center place-items-center rounded-sm shadow-sm z-50;
      -ms-overflow-style: none;

    }
    ::-webkit-scrollbar{
      display: none;
    }
  `,
})
export class PlayListComponent {
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() add = new EventEmitter<Playlist>();

  @Input() playlist: Playlist[] = [];

  playlistName = '';
  isAddFromActive = signal(false);

  constructor() {}

  onAddPlaylist() {
    if (this.playlistName) {
      const playlist = this.createPlaylist(this.playlistName);
      this.add.emit(playlist);
      this.playlistName = '';
      this.toggleAddForm();
    }
  }

  onDeletePlaylist(name: string) {
    this.delete.emit(name);
  }

  onClear() {
    const isConfirmed = confirm(
      'you are going to clear all playlists, are you sure?'
    );

    if (isConfirmed) {
      this.clear.emit();
    }
  }

  onClosePlaylist() {
    this.close.emit();
  }

  toggleAddForm() {
    this.isAddFromActive.update((val) => !val);
  }

  private createPlaylist(name: string) {
    return {
      name,
      tracks: [],
    } as Playlist;
  }
}
