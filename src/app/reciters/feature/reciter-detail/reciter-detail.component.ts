import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RecitersService } from '../../data-access/reciters.service';
import { Reciter } from '../../../core/model/reciter';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PlaylistStreamService } from '../../../core/playlist-stream.service';
import { Track } from '../../../core/model/track';
import { ScaleAnimation } from '../../../shared/scale-animation.directive';
import { PlaylistService } from '../../../core/playlist.service';
import { Playlist } from '../../../core/model/playlist';
import { PlaylistsMenu } from '../../ui/playlist-menu.component';
import { UIStateService } from '../../data-access/ui.state.service';
import { ReciterStateService } from '../../data-access/reciters.state.service';
import { ReciterHeaderComponent } from '../../ui/reciter-header.component.ts/reciter-header.component';
import { SuwarComponent } from '../../ui/surah/suwar.component';
import { Moshaf } from '../../../core/model/moshaf';
import { AppNotificationComponent } from '../../../core/app-notification/notification.component';
import { NotificationService } from '../../../core/app-notification/notification.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-reciter-detail',
  standalone: true,
  imports: [
    CommonModule,
    ScaleAnimation,
    PlaylistsMenu,
    ReciterHeaderComponent,
    SuwarComponent,
    LoaderComponent
  ],
  providers: [UIStateService, ReciterStateService, RecitersService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reciter-detail.component.html',
  styles: `
  `,
})
export class ReciterDetailComponent implements OnInit {
  #playlistStore = inject(PlaylistService);
  #UIState = inject(UIStateService);
  #reciterState = inject(ReciterStateService);
  #playlistStream = inject(PlaylistStreamService);
  #notificationService = inject(NotificationService);

  playlists: Playlist[] = [];
  tracks$!: Observable<Track[]>;
  reciter$!: Observable<Reciter>;
  trackToAddToPlaylist = signal<Track>({} as Track);

  isActiveMoshafList = this.#UIState.isActiveMoshafList;

  ngOnInit() {
    this.tracks$ = this.#reciterState.tracks$;
    this.reciter$ = this.#reciterState.reciter$;
    this.loadPlaylists();
  }

  selectTrackToAddToPlaylist(track: Track) {
    this.trackToAddToPlaylist.update(() => track);
  }

  playPlaylist(tracks?: Track[], track?: Track, reciterName?: string) {
    if (tracks) {
      this.#playlistStream.setPlaylistStream(tracks, track);
      this.#playlistStream.startPlaylistStream$().subscribe();
    }
    if (track === undefined) {
      this.#notificationService.notify(
        `${reciterName} playlist stream is started`
      );
    }
  }

  pausePlaylist() {
    this.#playlistStream.pausePlaylistStream();
  }

  switchToMoshaf(reciterId: number, moshaf: Moshaf) {
    this.#reciterState.switchToMoshaf(moshaf);
  }

  async addToPlaylist(name: string) {
    const playlist = await this.#playlistStore.getPlaylist(name);
    const trackToAdd = this.trackToAddToPlaylist();

    if (playlist) {
      const isExit = playlist.tracks.find(
        (tr) => tr.artist === trackToAdd.artist && tr.id === trackToAdd.id
      );

      if (isExit === undefined) {
        playlist.tracks.push(trackToAdd);
        this.#playlistStore.updatePlaylist(playlist);
      }

      this.#notificationService.notify(
        `${trackToAdd.title} is added to ${name} playlist`
      );
    }

    this.#UIState.closePlaylistMenu();
  }

  async createPlaylist(name: string, tracks: Track[]) {
    const playlist = {
      name,
      tracks,
    } as Playlist;
    await this.#playlistStore.addPlaylist(playlist);
    this.#notificationService.notify(`${name} added to playlist`);
  }

  activePlaylistMenu(btn: HTMLButtonElement) {
    this.#UIState.activePlaylistMenu(btn);
  }

  closePlaylistMenu() {
    this.#UIState.closePlaylistMenu();
  }

  openPlaylistMenu() {
    this.#UIState.openPlaylistMenu();
  }

  openMoshafMenu() {
    this.#UIState.openMoshafMenu();
  }

  closeMoshafMenu() {
    this.#UIState.closeMoshafMenu();
  }

  private async loadPlaylists() {
    this.playlists = await this.#playlistStore.getAllPlaylists();
  }
}
