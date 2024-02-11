import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Track } from '../../../core/model/track';
import { ScaleAnimation } from '../../../shared/scale-animation.directive';

@Component({
  selector: 'suwar',
  standalone: true,
  imports: [CommonModule, ScaleAnimation],
  templateUrl: './suwar.component.html',
  styles: `
  :host{
    @apply h-[calc(100dvh-312px)] sm:h-[calc(100dvh-275px)]  w-dvw;
  }
  `,
})
export class SuwarComponent {
  @Input() tracks!: Track[];

  isPlaying = signal(false);

  @Output() play = new EventEmitter<{ track: Track; tracks: Track[] }>();
  @Output() pause = new EventEmitter<void>();
  @Output() activePlaylistMenu = new EventEmitter<HTMLButtonElement>();
  @Output() selectTrackToAddToPlaylist = new EventEmitter<Track>();

  onPlay(track: Track, tracks: Track[]) {
    this.play.emit({ track, tracks });
  }

  onPause() {
    this.pause.emit();
  }

  onActivePlaylistMenu(btn: HTMLButtonElement) {
    this.activePlaylistMenu.emit(btn);
  }

  onSetCurrentTrack(track: Track) {
    this.selectTrackToAddToPlaylist.emit(track);
  }
}
