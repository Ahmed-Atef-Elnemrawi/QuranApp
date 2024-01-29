import {
  Component,
  OnDestroy,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { RecitersService } from '../../data-access/reciters.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, map, tap } from 'rxjs';
import { AudioStreamService } from '../../../core/audio-stream.service';
import { Track } from '../../../core/model/track';
import { PlaylistStreamService } from '../../../core/playlist-stream.service';
import { Reciter } from '../../../core/model/reciter';
@Component({
  selector: 'app-reciter-list',
  standalone: true,
  imports: [CommonModule],
  providers: [RecitersService],
  templateUrl: './reciter-list.component.html',
  styles: ``,
})
export class ReciterListComponent {
  reciters$: Observable<Reciter[]> | undefined;
  suwar$ = toSignal(this.service.getSuraList());
  audio = inject(AudioStreamService);
  x!: Subscription;
  constructor(
    private service: RecitersService,
    private playlistStream: PlaylistStreamService
  ) {
    this.reciters$ = service.getReciters().pipe(
      map((res) => res.reciters),
      tap((v) => console.log(v[0].moshaf[0]))
    );

    // this.suwar$ = this.service.getSuraList()
  }

  playSource(server: string, surah: string) {
    this.x = this.audio.playStream(server + `${surah}.mp3`).subscribe();
  }
  playPlayList(
    reciter: Reciter,
    surah: { id: string; name: string; type: 1 | 0 }
  ) {
    const list = this.suwar$()?.map(
      (v) =>
        ({
          artist: reciter.name,
          title: v.name,
          src: reciter.moshaf[0].server + v.id + '.mp3',
        } as Track)
    );

    const current = {
      artist: reciter.name,
      title: surah.name,
      src: reciter.moshaf[0].server + surah.id + '.mp3',
    };
    this.playlistStream.setPlaylistStream(list!, current);
    const m = this.playlistStream.startPlaylistStream$().subscribe();
  }

  next() {
    this.playlistStream.nextTrack();
  }

  previous() {
    this.playlistStream.previousTrack();
  }
}
