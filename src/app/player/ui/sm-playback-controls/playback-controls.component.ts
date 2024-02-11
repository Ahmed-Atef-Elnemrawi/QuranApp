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
import { Track } from '../../../core/model/track';
import { ClickAnimation } from '../../../shared/click-animation.directive';
import { single } from 'rxjs';
import { Utils } from '../../../shared/dom.utils';

@Component({
  selector: 'sm-playback-controls',
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    VolumeComponent,
    FormsModule,
    PlayListComponent,
    ClickAnimation
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
  private utils = new Utils();

  rangeValue = 0;
  showPlayList = signal(false);
  showTrackInfo = signal(false);

  @Input() set setRangeValue(val: number) {
    this.rangeValue = val;
  }
  @Input() maxRangeValue = 0;
  @Input() isPlaying = false;
  @Input() playlist: Playlist[] = [];
  @Input() track: Track | null = null;
  @Input() formattedCurrentTime = '';
  @Input() formattedDuration = '';

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
  @Output() renamePlaylist = new EventEmitter<{ name: string, newName: string }>();

  onPlay() {
    if (this.track)
      this.play.emit();
  }

  onPause() {
    if (this.isPlaying)
      this.pause.emit();
  }

  onStop() {
    if (this.isPlaying)
      this.stop.emit();
  }

  onNext() {
    if (this.track)
      this.next.emit();
  }

  onPrevious() {
    if (this.track)
      this.previous.emit();
  }

  onSeek(val: number) {
    if (this.track)
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

  onRenamePlaylist(name: string, newName: string) {
    this.renamePlaylist.emit({ name, newName });
  }

  onAddPlaylist(playList: Playlist) {
    this.addPlaylist.emit(playList);
  }

  togglePlayList() {
    this.showPlayList.update((val) => !val);
  }

  toggleTrackInfo($event: Event) {
    if (this.track) {
      this.showTrackInfo.update(val => !val)
    }
  }
}
