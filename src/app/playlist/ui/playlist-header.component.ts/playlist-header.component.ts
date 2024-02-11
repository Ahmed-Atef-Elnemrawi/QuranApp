import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Track } from '../../../core/model/track';
import { Playlist } from '../../../core/model/playlist';
import { ClickAnimation } from '../../../shared/click-animation.directive';

@Component({
  selector: 'playlist-header',
  standalone: true,
  imports: [CommonModule, ClickAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playlist-header.component.html',
  styles: `
  :host{
    @apply w-[95%] sm:w-fit h-fit flex gap-x-5 place-content-center place-items-center mt-14 mb-3 py-5 px-10 shadow-sm rounded-sm bg-container mx-auto
  }
  `,
})
export class PlaylistHeaderComponent {
  @Input() playlist!: Playlist | undefined;

  @Output() playPlaylist = new EventEmitter<Track[]>();
  @Output() pausePlaylist = new EventEmitter<void>();
  @Output() showEditingOptions = new EventEmitter<void>();

  isPlaying = signal(false);

  onPlayPlaylist(tracks: Track[]) {
    if (tracks.length) {
      this.playPlaylist.emit(tracks);
      this.isPlaying.update(() => true);
    }
  }

  onPausePlaylist() {
    if (this.isPlaying()) {
      this.pausePlaylist.emit();
      this.isPlaying.update(() => false);
    }
  }

  onShowEditingOptions() {
    this.showEditingOptions.emit();
  }
}
