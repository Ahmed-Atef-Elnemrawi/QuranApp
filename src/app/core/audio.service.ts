import { Injectable, Renderer2, inject } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AudioState, AudioStateManager } from './audio-state-manager';

@Injectable({
  providedIn:'root'
})
export class AudioService{
  #audio = new Audio();
  #stateManager = new AudioStateManager(this.#audio);
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

  playStream(url: string): Observable<Event> {
    return this.streamObservable(url).pipe(takeUntil(this.#stop$));
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
        this.removeEvents(this.#audio,this.#audioEvents, eventHandler)
      };
    });
  }

  private setupAudioEl(url: string): void {
    this.#audio.src = url;
    this.#audio.load();
    this.#audio.play();
  }

  private cleanupAudioEl(): void {
    this.#audio.pause();
    this.#audio.currentTime = 0;
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
