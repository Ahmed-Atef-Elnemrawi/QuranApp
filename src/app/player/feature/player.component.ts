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
  #playListService = inject(PlaylistService);
  #deviceDetector = inject(DeviceDetectorService);

  isPlaying = signal(false);
  formattedDuration = signal('');
  formattedCurrentTime = signal('');
  currentTime = signal(0);
  duration = signal(0);

  playlists = signal<Playlist[]>([]);

  isMobile = this.#deviceDetector.isMobile();
  isTablet = this.#deviceDetector.isTablet();
  isDesktop = this.#deviceDetector.isDesktop();
  deviceWidth = signal(innerWidth);

  @HostListener('window:resize') onResize() {
    this.deviceWidth.update(() => innerWidth);
  }

  ngOnInit(): void {
    this.#audioService.getState().subscribe((state) => this.updateState(state));
  }

  onPlay() {
    this.#audioService.play();
  }

  onPause() {
    this.#audioService.pause();
  }

  onSeek(val: number) {
    this.#audioService.seekTo(val);
  }

  onStop() {
    this.#audioService.stop();
  }

  onVolume(val: number) {
    this.#audioService.changeVolume(val);
  }

  onNext() {
    console.log('next track');
  }

  onPrevious() {
    console.log('previous track');
  }

  async loadPlaylist() {
    const playlist = await this.#playListService.getAllPlaylists();
    this.playlists.update((val) => (val = playlist));
  }

  async addPlaylist(playlist: Playlist) {
    await this.#playListService.addPlaylist(playlist);
    await this.loadPlaylist();
  }

  async clearPlaylists() {
    await this.#playListService.clearPlaylist();
    await this.loadPlaylist();
  }

  async deletePlaylist(name: string) {
    await this.#playListService.removePlaylist(name);
    await this.loadPlaylist();
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
