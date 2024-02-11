import { Injectable, inject, signal } from '@angular/core';
import { Utils } from '../../shared/dom.utils';
import { single } from 'rxjs';

@Injectable()
export class UIStateService {
  #utils = new Utils();

  isActiveMoshafList = signal(false);
  isPlayingTrack = signal(false);

  activePlaylistMenu(btn: HTMLButtonElement) {
    const btnRect = btn.getBoundingClientRect();
    const top = btnRect.top;
    const left = btnRect.left + 24;

    const menu = this.#utils.queryById('playlist-menu');
    const dir = document.querySelector('main')?.dir;

    if (menu) {
      this.#utils.addAttribute(
        menu,
        'style',
        `
      position: fixed;
      top: ${top}px;
      left:${dir === 'rtl' ? left : left - 184}px;
      `
      );

      this.openPlaylistMenu();
    }
  }

  closePlaylistMenu() {
    const menu = this.#utils.queryById('playlist-menu')!;
    this.#utils.removeClass(menu, 'block').addClass(menu, 'hidden');
  }

  openPlaylistMenu() {
    const menu = this.#utils.queryById('playlist-menu')!;
    this.#utils.removeClass(menu, 'hidden');
  }

  openMoshafMenu() {
    this.isActiveMoshafList.update(() => true);
  }
  closeMoshafMenu() {
    this.isActiveMoshafList.update(() => false);
  }

  isPlaying(){
    this.isPlayingTrack.update(()=>true)
  }

  isPaused(){
    this.isPlayingTrack.update(() => false)
  }
}
