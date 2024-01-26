import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from '../../../shared/slider.component';
import { VolumeComponent } from '../../../shared/volume.component';
import { PlayListComponent } from '../playlist/playlist.component';
import { Playlist } from '../../../core/model/playlist';

@Component({
  selector: 'sm-playback-controls',
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    VolumeComponent,
    FormsModule,
    PlayListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playback-controls.component.html',
  styles: `
    :host {
      z-index: 50;
      position:relative;
    }
  `,
})
export class SmallPlaybackControlsComponent {
  rangeValue = 0;
  showPlayList = signal(false);

  @Input() set setRangeValue(val: number) {
    this.rangeValue = val;
  }
  @Input() maxRangeValue = 0;
  @Input() isPlaying = false;
  @Input() playlist: Playlist[] = [];

  @Output() play = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() seek = new EventEmitter<number>();
  @Output() stop = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() loadPlaylist = new EventEmitter<void>();
  @Output() clearPlaylists = new EventEmitter<void>();
  @Output() addPlaylist = new EventEmitter<Playlist>();
  @Output() deletePlaylist = new EventEmitter<string>();

  onPlay() {
    this.play.emit();
  }

  onPause() {
    this.pause.emit();
  }

  onStop() {
    this.stop.emit();
  }

  onNext() {
    this.next.emit();
  }

  onPrevious() {
    this.previous.emit();
  }

  onSeek(val: number) {
    this.seek.emit(val);
  }

  onLoadPlaylist() {
    return this.loadPlaylist.emit();
  }

  onClearPlaylists() {
    this.clearPlaylists.emit();
  }

  onDeletePlaylist(key: string) {
    this.deletePlaylist.emit(key);
  }

  onAddPlaylist(playList: Playlist) {
    this.addPlaylist.emit(playList);
  }

  togglePlayList() {
    this.showPlayList.update((val) => !val);
  }
}
