import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, single } from 'rxjs';
import { PlaylistService } from '../core/playlist.service';
import { Playlist } from '../core/model/playlist';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './playlist.component.html',
  styles: ``,
})
export class PlaylistComponent implements OnInit, OnDestroy {
  #route = inject(ActivatedRoute);
  #playlistService = inject(PlaylistService);

  #name$: Subscription | undefined;
  playlist = signal<Playlist | undefined>({
    name: '',
    tracks: []
  });

  ngOnInit(): void {
    this.#name$ = this.#route.queryParamMap.subscribe((query) => {
      const name = query.get('name');
      if (name) {
        this.loadPlaylist(name);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.#name$) {
      this.#name$.unsubscribe();
    }
  }

  private async loadPlaylist(name: string) {
    const playlist = await this.#playlistService.getPlaylist(name);
    this.playlist.update(() => playlist)
  }
}
