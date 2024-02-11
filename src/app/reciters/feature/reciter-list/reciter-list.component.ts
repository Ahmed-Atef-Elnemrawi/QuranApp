import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { RecitersService } from '../../data-access/reciters.service';
import { CommonModule } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { Reciter } from '../../../core/model/reciter';
import {
  RouterLink,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';
import { ScaleAnimation } from '../../../shared/scale-animation.directive';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-reciter-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ScaleAnimation, LoaderComponent],
  providers: [RecitersService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reciter-list.component.html',
  styles: `
  :host{
    @apply fixed inset-x-0 top-32 bottom-24 sm:bottom-20 overflow-y-scroll scroll-smooth  snap-proximity snap-y;
  }
  `,
})
export class ReciterListComponent implements OnInit {
  #recitersService = inject(RecitersService);

  reciters$: Observable<Reciter[]> | undefined;
  alphabet: Set<string> | undefined;

  ngOnInit(): void {
    this.reciters$ = this.#recitersService.getReciters().pipe(
      map(({ reciters }) => reciters),
      tap((val) => {
        this.alphabet = new Set(val.map((r) => r.letter).sort());
      })
    );
  }
}
