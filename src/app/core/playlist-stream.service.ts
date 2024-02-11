import { Injectable, OnDestroy, inject } from '@angular/core';
import { Track } from './model/track';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AudioStreamService } from './audio-stream.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistStreamService implements OnDestroy {
  #audio = inject(AudioStreamService);
  #cursor: number = 0;
  #stop$ = new Subject<void>();
  #tracks: Track[] = [];
  #current: Track | undefined;
  #currentTrack$ = new BehaviorSubject<Track | null>(null);

  get getCurrentTrack(): Observable<Track |null> {
    return this.#currentTrack$.asObservable();
  }

  startPlaylistStream$() {
    return this.#currentTrack$.pipe(
      switchMap((track) => {
        if (track) {
          return this.#audio.playStream(track.src).pipe(
            tap((event) => {
              if (event.type === 'ended') {
                this.nextTrack();
              }
            })
          );
        } else {
          return EMPTY;
        }
      }),
      takeUntil(this.#stop$)
    );
  }

  setPlaylistStream(playlist: Track[], current?: Track) {
    this.#tracks = playlist;
    this.#current = current;

    //in situation there is no current track is passed, for that the playlist will start from beginning.
    this.#cursor = current
      ? this.#tracks.findIndex((track) => track.src === current.src)
      : 0;

    this.#current ??= this.#tracks[0];

    if (this.#cursor === -1) {
      this.#cursor = 0;
    }
    this.#currentTrack$.next(this.#tracks[this.#cursor]);
  }

  nextTrack() {
    if (!this.#tracks || this.#tracks.length === 0) {
      console.error(
        'No tracks available in the playlist to play the next track.'
      );
      return;
    }

    if (!this.#current) {
      console.error(
        'Current track is not set, cannot proceed to the next track.'
      );
      return;
    }

    // Moving to the next track
    this.#cursor = (this.#cursor + 1) % this.#tracks.length;

    this.#current = this.#tracks[this.#cursor];
    this.#currentTrack$.next(this.#current);
  }

  previousTrack() {
    if (!this.#tracks || this.#tracks.length === 0) {
      console.error(
        'No tracks available in the playlist to play the previous track.'
      );
      return;
    }

    if (!this.#current) {
      console.error(
        'Current track is not set, cannot proceed to the previous track.'
      );
      return;
    }

    //moving to the previous track
    this.#cursor =
      (this.#cursor - 1 + this.#tracks.length) % this.#tracks.length;
    this.#current = this.#tracks[this.#cursor];
    this.#currentTrack$.next(this.#current);
  }

  pausePlaylistStream(){
    this.#audio.pause();
  }

  stopPlaylistStream() {
    this.#stop$.next();
    this.#stop$.complete();
  }

  ngOnDestroy(): void {
    this.stopPlaylistStream();
  }
}
