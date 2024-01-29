
import { BehaviorSubject, Observable } from 'rxjs';
import moment from 'moment';
import { Injectable } from '@angular/core';

export interface AudioState {
  playing: boolean;
  formattedCurrentTime: string;
  formattedDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  canplay: boolean;
  ended:boolean;
  error: boolean;
}

@Injectable({
  providedIn:'root'
})
export class AudioStateManager {
  #state: AudioState = this.initializeState();
  #stateChange = new BehaviorSubject(this.#state);
  #audio: HTMLAudioElement | undefined;

  // Update state based on audio event type
  #stateHandlers: Record<string, (event: Event) => void> = {
    canplay: (event: Event) => this.handleCanPlayState(event),
    playing: (event: Event) => this.handlePlayingState(event),
    pause: (event: Event) => this.handlePauseState(event),
    timeupdate: (event: Event) => this.handleTimeUpdatedState(event),
    ended:(event: Event) => this.handleEndedState(event),
    error: (event: Event) => this.handleErrorState(event),
  };

  trackState(audio: HTMLAudioElement): this{
    this.#audio = audio
    return this
  }

  get state$(): Observable<AudioState> {
    return this.#stateChange.asObservable();
  }

  //this is the main method.
  updateState(event: Event): void {
    const eventType = event.type;
    const stateHandler = this.#stateHandlers[eventType];

    if (stateHandler) {
      stateHandler(event);
    }
    this.#stateChange.next(this.#state);
  }

  private handleCanPlayState(event: Event): void {
    this.#state.duration = this.getAudioDuration();
    this.#state.formattedDuration = this.formatTime(this.#state.duration!);
    this.#state.canplay = true;
  }

  private handlePlayingState(event: Event): void {
    this.#state.playing = true;
  }

  private handlePauseState(event: Event): void {
    this.#state.playing = false;
  }

  private handleTimeUpdatedState(event: Event): void {
    this.#state.currentTime = this.getAudioCurrentTime();
    this.#state.formattedCurrentTime = this.formatTime(this.#state.currentTime!);
  }

  private handleEndedState(event: Event):void{
    this.#state.playing = false;
    this.#state.canplay = true;
    this.#state.currentTime = 0;
    this.#state.formattedCurrentTime = '00:00'
    this.#state.ended = true;
  }

  private handleErrorState(event: Event): void {
    this.resetState();
    this.#state.error = true;
  }

  private formatTime(time: number): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format('HH:mm:ss');
  }

  private getAudioDuration(): number | undefined {
    return (this.#state.duration = this.#audio?.duration);
  }

  private getAudioCurrentTime(): number | undefined {
    return (this.#state.currentTime = this.#audio?.currentTime);
  }

  resetState(): void {
    this.#state = this.initializeState();
    this.#stateChange.next(this.#state);
  }

  private initializeState(): AudioState {
    return {
      playing: false,
      formattedCurrentTime: '00:00',
      formattedDuration: '00:00',
      duration: 0,
      currentTime: 0,
      canplay: false,
      ended: false,
      error: false,
    };
  }
}
