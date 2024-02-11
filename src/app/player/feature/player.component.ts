import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PlaylistService } from '../../core/playlist.service';

import { Playlist } from '../../core/model/playlist';
import { PlaybackControlsComponent } from '../ui/playback-controls/playback-controls.component';
import { SmallPlaybackControlsComponent } from '../ui/sm-playback-controls/playback-controls.component';
import { AudioStreamService } from '../../core/audio-stream.service';
import { AudioState } from '../../core/audio-state.service';
import { PlaylistStreamService } from '../../core/playlist-stream.service';
import { Observable, Subject } from 'rxjs';
import { Track } from '../../core/model/track';

function fn<T>(value: T) {
  return (val: T) => (val = value);
}

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    PlaybackControlsComponent,
    SmallPlaybackControlsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './player.component.html',
  styles: `
  :host{
      z-index:50;
    }
  `,
})
export class PlayerComponent implements OnDestroy {
  #audioService = inject(AudioStreamService);
  #playlistStream = inject(PlaylistStreamService);
  #playListService = inject(PlaylistService);
  #deviceDetector = inject(DeviceDetectorService);

  #playlistsSrc = new Subject<Playlist[]>();
  playlists$ = this.#playlistsSrc.asObservable();

  isPlaying = signal(false);
  formattedDuration = signal('');
  formattedCurrentTime = signal('');
  currentTime = signal(0);
  duration = signal(0);

  currentTrack!: Observable<Track | null>;

  isMobile = this.#deviceDetector.isMobile();
  isTablet = this.#deviceDetector.isTablet();
  isDesktop = this.#deviceDetector.isDesktop();
  deviceWidth = signal(innerWidth);

  @HostListener('window:resize') onResize() {
    this.deviceWidth.update(() => innerWidth);
  }

  ngOnInit(): void {
    this.#audioService
      .getState()
      .subscribe((state) => this.updateState(state));

    this.currentTrack = this.#playlistStream
      .getCurrentTrack;
  }

  onPlay() {
    this.#audioService
      .play();
  }

  onPause() {
    this.#audioService
      .pause();
  }

  onSeek(val: number) {
    this.#audioService
      .seekTo(val);
  }

  onStop() {
    this.#audioService
      .stop();
  }

  onVolume(val: number) {
    this.#audioService
      .changeVolume(val);
  }

  onNext() {
    this.#playlistStream
      .nextTrack();
  }

  onPrevious() {
    this.#playlistStream
      .previousTrack();
  }

  async loadPlaylist() {
    await this.#playListService
      .getAllPlaylists()
      .then((val) => this.#playlistsSrc.next(val));
  }

  async addPlaylist(playlist: Playlist) {
    await this.#playListService
      .addPlaylist(playlist)
      .then(() => this.loadPlaylist());
  }

  async clearPlaylists() {
    await this.#playListService.clearPlaylist().then(() => this.loadPlaylist());
  }

  async deletePlaylist(name: string) {
    await this.#playListService
      .removePlaylist(name)
      .then(() => this.loadPlaylist());
  }

  async renamePlaylist(name: string, newName: string) {
    if (name !== newName) {
      await this.#playListService
        .getPlaylist(name)
        .then((target) => {
          if (target) {
            target.name = newName;
            this.deletePlaylist(name);
            this.addPlaylist(target);
          }
        });
    }
  }

  private updateState(state: AudioState) {
    this.isPlaying.update(fn(state.playing));
    this.formattedDuration.update(fn(state.formattedDuration));
    this.duration.update(fn(state.duration ?? 0));
    this.formattedCurrentTime.update(fn(state.formattedCurrentTime));
    this.currentTime.update(fn(state.currentTime ?? 0));
  }

  ngOnDestroy(): void {
    this.#audioService.stop();
  }
}
