import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { Reciter } from '../../../core/model/reciter';
import { Track } from '../../../core/model/track';
import { Moshaf } from '../../../core/model/moshaf';
import { FormsModule } from '@angular/forms';
import { ClickAnimation } from '../../../shared/click-animation.directive';

@Component({
  selector: 'reciter-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reciter.header.component.html',
  styles: `
  :host{

  }
  `,
})
export class ReciterHeaderComponent {
  @Input() reciter!: Reciter | null;
  @Input() tracks!: Track[];
  @Input() isPlaylistPlaying = false;
  @Input() isActiveMoshafMenu = false;

  @Output() openMoshafMenu = new EventEmitter<void>();

  @Output() closeMoshafMenu = new EventEmitter<void>();

  @Output() playPlaylist = new EventEmitter<{
    name: string;
    tracks: Track[];
  }>();

  @Output() pausePlaylist = new EventEmitter<void>();

  @Output() selectMoshaf = new EventEmitter<{
    reciterId: number;
    moshaf: Moshaf;
  }>();

  @Output() createPlayList = new EventEmitter<{
    name: string;
    tracks: Track[];
  }>();

  moshaf = '';

  selectedMoshaf = signal(0);

  onOpenMoshafMenu() {
    this.openMoshafMenu.emit();
  }

  onCloseMoshafMenu() {
    this.closeMoshafMenu.emit();
  }

  onPlayPlaylist(reciterName: string, tracks: Track[]) {
    if (this.tracks.length) {
      this.playPlaylist.emit({ name: reciterName, tracks });
    }
  }

  onCreatePlaylist(name: string, tracks: Track[]) {
    this.createPlayList.emit({ name, tracks });
  }

  onPausePlaylist() {
    if (this.isPlaylistPlaying) {
      this.pausePlaylist.emit();
    }
  }

  onSelectMoshaf(reciterId: number, moshaf: Moshaf) {
    this.selectMoshaf.emit({ reciterId, moshaf });
  }

  updateSelectedMoshaf(id: number) {
    this.selectedMoshaf.update(() => id);
    this.onCloseMoshafMenu();
  }
}
