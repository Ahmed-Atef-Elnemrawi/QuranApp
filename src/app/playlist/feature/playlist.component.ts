import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../core/playlist.service';
import { Playlist } from '../../core/model/playlist';
import { CommonModule } from '@angular/common';
import { PlaylistHeaderComponent } from '../ui/playlist-header.component.ts/playlist-header.component';
import { SuwarComponent } from '../ui/surah/suwar.component';
import { PlaylistStreamService } from '../../core/playlist-stream.service';
import { Track } from '../../core/model/track';
import { Subject, takeUntil, tap } from 'rxjs';
import { NotificationService } from '../../core/app-notification/notification.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, PlaylistHeaderComponent, SuwarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playlist.component.html',
  styles: ``,
})
export class PlaylistComponent implements OnInit, OnDestroy {
  #route = inject(ActivatedRoute);
  #playlistService = inject(PlaylistService);
  #PlaylistStream = inject(PlaylistStreamService);
  #notificationService = inject(NotificationService);

  #destroy = new Subject<void>();

  #playlistSource = new Subject<Playlist>();
  playlist$ = this.#playlistSource.asObservable();

  isEditingOptionsActive = signal(false);
  playlistName = '';

  ngOnInit(): void {
    this.#route.paramMap
      .pipe(
        tap((param) => {
          const name = param.get('name');
          if (name) {
            this.loadPlaylist(name);
            this.playlistName = name;
          }
        }),
        takeUntil(this.#destroy)
      )
      .subscribe();
  }

  playPlaylist(tracks: Track[], track?: Track) {
    this.#PlaylistStream.setPlaylistStream(tracks, track);
    this.#PlaylistStream.startPlaylistStream$().subscribe();
    this.#notificationService.notify(`${this.playlistName} stream is started`);
  }

  pausePlaylist() {
    this.#PlaylistStream.pausePlaylistStream();
  }

  activeEditingOptions() {
    this.isEditingOptionsActive.update((v) => !v);
  }

  async deleteTrack(playlistName: string, id: string) {
    const playlist = await this.#playlistService.getPlaylist(playlistName);
    if (playlist) {
      const tracks = playlist.tracks.filter((tr) => tr.id !== id);
      playlist.tracks = [...tracks];
      this.#playlistService
        .updatePlaylist(playlist)
        .then(() => this.loadPlaylist(playlistName));
    }
  }

  ngOnDestroy(): void {
    this.#destroy.next();
  }

  private async loadPlaylist(name: string) {
    await this.#playlistService.getPlaylist(name).then((val) => {
      if (val) {
        this.#playlistSource.next(val);
      }
    });
  }
}
