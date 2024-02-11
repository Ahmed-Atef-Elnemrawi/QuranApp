import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
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
import { ScaleAnimation } from '../../../shared/scale-animation.directive';
import { Utils } from '../../../shared/dom.utils';
import { NEVER } from 'rxjs';
@Component({
  selector: 'playlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ScaleAnimation],
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
export class PlayListComponent implements AfterViewInit {
  #utils = new Utils();

  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() add = new EventEmitter<Playlist>();
  @Output() rename = new EventEmitter<{ name: string; newName: string }>();

  @Input() playlist: Playlist[] = [];

  playlistName = '';
  isFromActive = signal(false);
  isAddForm = signal(true);
  selectedPlaylistName = signal('');

  constructor() {}

  ngAfterViewInit(): void {
    const host = this.#utils.getHostEl();
    this.#utils.listenTo(host, 'click', (e: Event) => {
      if (e.target === host) {
        this.onClosePlaylist();
      }
    });
  }

  onAddPlaylist() {
    if (this.playlistName) {
      const playlist = this.createPlaylist(this.playlistName);
      this.add.emit(playlist);
      this.playlistName = '';
      this.toggleFormVisibility();
    }
  }

  onRenamePlaylist() {
    if (this.playlistName) {
      this.rename.emit({
        name: this.selectedPlaylistName(),
        newName: this.playlistName,
      });

      this.playlistName = '';

      this.toggleFormVisibility();
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

  toggleFormVisibility() {
    this.isFromActive.update((val) => !val);
  }

  showRenameForm() {
    this.isAddForm.update(() => false);

    const input = this.#utils.queryById('input');

    if (input) {
      input.focus();

      input.onkeydown = (e) => {
        if (e.key === 'Enter') this.onRenamePlaylist();
      };
    }
  }

  showAddForm() {
    this.isAddForm.update(() => true);

    const input = this.#utils.queryById('input');

    if (input) {
      input.focus();

      input.onkeydown = (e) => {
        if (e.key === 'Enter') this.onAddPlaylist();
      };
    }
  }

  catchPlaylistName(val: string) {
    this.selectedPlaylistName.update(() => val);
  }

  private createPlaylist(name: string) {
    return {
      name,
      tracks: [],
    } as Playlist;
  }
}
