import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Track } from '../../../core/model/track';
import { ScaleAnimation } from '../../../shared/scale-animation.directive';
import { Playlist } from '../../../core/model/playlist';
import { ClickAnimation } from '../../../shared/click-animation.directive';

@Component({
  selector: 'suwar',
  standalone: true,
  imports: [CommonModule, ClickAnimation],
  changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './suwar.component.html',
  styles: `
  :host{
    @apply h-[calc(100dvh-300px)] sm:h-[calc(100dvh-275px)]  w-dvw;
  }
  `,
})
export class SuwarComponent {
  @Input() playlist!: Playlist;
  @Input() activeEditingOptions = false;

  @Output() play = new EventEmitter<{ track: Track; tracks: Track[] }>();
  @Output() pause = new EventEmitter<void>();
  @Output() deleteTrack = new EventEmitter<{ playlist: string; id: string }>();

  isPlaying = signal(false);

  onPlay(track: Track, tracks: Track[]) {
    this.play.emit({ track, tracks });
  }

  onPause() {
    this.pause.emit();
  }

  onDeleteTrack(playlist: string, id: string) {
    this.deleteTrack.emit({ playlist, id });
  }
}
