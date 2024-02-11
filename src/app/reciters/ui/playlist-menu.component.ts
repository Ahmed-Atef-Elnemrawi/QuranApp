import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Host,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { Playlist } from '../../core/model/playlist';
import { Utils } from '../../shared/dom.utils';
import { ScaleAnimation } from '../../shared/scale-animation.directive';

@Component({
  selector: 'playlist-menu',
  standalone: true,
  imports: [CommonModule, ScaleAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="menu"
      class="w-fit h-fit  py-4 ring-1 ring-primary rounded-sm shadow-lg bg-container"
    >
      <div class="w-[160px] h-[120px] overflow-y-scroll flex flex-col gap-y-0.5 py-1 px-2.5 scroll-smooth snap-y snap-proximity">
        @for (playlist of playlists; track $index) {
        <button
          (click)="onAddToPlaylist(playlist.name)"
          class=" w-full whitespace-break-spaces block relative py-2 px-4 z-50 hover:bg-primary hover:rounded-sm capitalize snap-start"
        >
          {{ playlist.name }}
        </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host{
    }
   `,
})
export class PlaylistsMenu {
  #utils = new Utils();

  @Input() playlists: Playlist[] = [];
  @Output() addToPlaylist = new EventEmitter<string>();

  onAddToPlaylist(playlistName: string) {
    this.addToPlaylist.emit(playlistName);
  }
}
