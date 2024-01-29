import { Injectable, Renderer2, inject } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, takeUntil } from 'rxjs';
import { AudioState, AudioStateService } from './audio-state.service';
//inject audioStatManager for more maintainability and testability
@Injectable({
  providedIn: 'root',
})
export class AudioStreamService {
  #stateManager = inject(AudioStateService);
  #audio = new Audio();
  #stop$ = new Subject<void>();
  #audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart',
  ];

  constructor() {
    this.#stateManager.trackState(this.#audio);
  }

  playStream(url: string): Observable<Event> {
    return this.streamObservable(url).pipe(
      takeUntil(this.#stop$),
      catchError((e) => EMPTY)
    );
  }

  play(): void {
    this.#audio.play();
  }

  pause(): void {
    this.#audio.pause();
  }

  stop(): void {
    this.#stop$.next();
  }

  seekTo(seconds: number): void {
    this.#audio.currentTime = seconds;
  }

  changeVolume(value: number): void {
    this.#audio.volume = value / 100;
  }

  mute(value: boolean): void {
    this.#audio.muted = value;
  }

  getState(): Observable<AudioState> {
    return this.#stateManager.state$.pipe(takeUntil(this.#stop$));
  }

  private streamObservable(url: string): Observable<Event> {
    return new Observable((subscriber) => {
      this.setupAudioEl(url);
      const eventHandler = (event: Event) => {
        this.#stateManager.updateState(event);
        subscriber.next(event);
      };

      this.addEvents(this.#audio, this.#audioEvents, eventHandler);

      return () => {
        this.cleanupAudioEl();
        this.removeEvents(this.#audio, this.#audioEvents, eventHandler);
      };
    });
  }

  private setupAudioEl(url: string): void {
    this.#audio.src = url;
    this.#audio.preload = 'metadata';

    this.#audio.oncanplay = (e) => {
      this.#audio.play();
    };

    this.#audio.load();
  }

  private cleanupAudioEl(): void {
    this.#audio.pause();
    this.#audio.currentTime = 0;
    this.#audio.src = '';
    this.#stateManager.resetState();
  }

  private addEvents(
    obj: HTMLAudioElement,
    events: string[],
    handler: (event: Event) => void
  ): void {
    events.forEach((event) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(
    obj: HTMLAudioElement,
    events: string[],
    handler: (event: Event) => void
  ): void {
    events.forEach((event) => {
      obj.removeEventListener(event, handler);
    });
  }
}
