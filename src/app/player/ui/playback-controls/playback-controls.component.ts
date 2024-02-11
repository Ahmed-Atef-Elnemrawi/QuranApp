import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderComponent } from '../../../shared/slider.component';
import { VolumeComponent } from '../../../shared/volume.component';
import { Playlist } from '../../../core/model/playlist';
import { PlayListComponent } from '../playlist/playlist.component';
import { TrackNavigationComponent } from '../track-navigation/track-navigation.component';
import { Track } from '../../../core/model/track';
import { ClickAnimation } from '../../../shared/click-animation.directive';

@Component({
  selector: 'playback-controls',
  standalone: true,
  imports: [
    CommonModule,
    SliderComponent,
    VolumeComponent,
    FormsModule,
    PlayListComponent,
    TrackNavigationComponent,
    ClickAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playback-controls.component.html',
  styles: `
    :host {
      z-index: 50;
    }
  `,
})
export class PlaybackControlsComponent implements AfterViewInit {
  @Input() set setRangeValue(val: number) {
    this.rangeValue = val;
  }

  hostWidth = signal(innerWidth);

  rangeValue = 0;
  volumeValue = 100;
  isPlaylistActive = signal(false);
  isVolumeControllerActive = signal(false);
  isTrackNavigationActive = signal(false);

  @Input() maxRangeValue = 0;
  @Input() isPlaying = false;
  @Input() formattedDuration = '';
  @Input() formattedCurrentTime = '';
  @Input() playlist: Playlist[] = [];
  @Input() track: Track | null = {
    id: '',
    title: '',
    artist: '',
    src: ''
  };

  @Output() play = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() seek = new EventEmitter<number>();
  @Output() volume = new EventEmitter<number>();
  @Output() stop = new EventEmitter<void>();
  @Output() loadPlaylist = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() clearPlaylists = new EventEmitter<void>();
  @Output() addPlaylist = new EventEmitter<Playlist>();
  @Output() deletePlaylist = new EventEmitter<string>();
  @Output() renamePlaylist = new EventEmitter<{ name: string, newName: string }>()

  @HostListener('window:resize') onResize() {
    this.hostWidth.update((val) => (val = innerWidth));
  }

  ngAfterViewInit(): void { }

  onPlay($event: Event) {
    if (this.track)
      this.play.emit();
  }

  onPause($event: Event) {
    if (this.isPlaying)
      this.pause.emit();
  }

  onStop() {
    if (this.isPlaying)
      this.stop.emit();
  }

  onSeek(val: number) {
    if (this.track)
      this.seek.emit(val);
  }

  onVolume(val: number) {
    this.volume.emit(val);
  }

  onLoadPlaylist($event: Event) {
    this.loadPlaylist.emit();
  }

  onNext() {
    if (this.track)
      this.next.emit();
  }

  onPrevious() {
    if (this.track)
      this.previous.emit();
  }

  onClearPlaylists() {
    this.clearPlaylists.emit();
  }

  onAddPlaylist(playlist: Playlist) {
    this.addPlaylist.emit(playlist);
  }

  onDeletePlaylist(key: string) {
    this.deletePlaylist.emit(key);
  }

  onRenamePlaylist(name: string, newName: string) {
    this.renamePlaylist.emit({ name, newName })
  }

  togglePlayList() {
    this.toggleControl(this.isPlaylistActive, 'playlistController');
  }

  toggleTrackNavigationControls($event: Event) {
    this.toggleControl(this.isTrackNavigationActive, 'trackNavigation');
  }

  toggleVolumeController($event: Event) {
    this.toggleControl(this.isVolumeControllerActive, 'volumeController');
  }

  private toggleControl(
    controlSignal: WritableSignal<boolean>,
    controllerType:
      | 'trackNavigation'
      | 'volumeController'
      | 'playlistController'
  ) {
    controlSignal.update((val) => !val);
    this.deactivateAllExcept(controllerType);
  }

  private deactivateAllExcept(
    controllerType:
      | 'trackNavigation'
      | 'volumeController'
      | 'playlistController'
  ) {
    const controllersMap = new Map<string, WritableSignal<boolean>>([
      ['trackNavigation', this.isTrackNavigationActive],
      ['volumeController', this.isVolumeControllerActive],
      ['playlistController', this.isPlaylistActive],
    ]);

    [...controllersMap]
      .filter(([key]) => key !== controllerType)
      .forEach(([_, value]) => value.update(() => false));
  }
}
