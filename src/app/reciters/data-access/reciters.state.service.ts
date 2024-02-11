// Assuming signal is part of a newer version of Angular or a compatible library.
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { Reciter } from '../../core/model/reciter';
import { Track } from '../../core/model/track';
import { RecitersService } from './reciters.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Moshaf } from '../../core/model/moshaf';

interface Surah {
  id: string;
  name: string;
  type: 0 | 1;
}

@Injectable()
export class ReciterStateService {
  private tracksSource = new BehaviorSubject<Track[]>([]);
  tracks$ = this.tracksSource.asObservable();

  private reciterSource = new BehaviorSubject<Reciter>({} as Reciter);
  reciter$ = this.reciterSource.asObservable();

  private reciterSurahListSource = new BehaviorSubject<string[]>([]);

  private moshafSource = new BehaviorSubject<Moshaf>({
    id: 0,
    name: '',
    server: '',
    surah_total: 0,
    moshaf_type: 0,
    surah_list: '',
  });

  private moshaf$ = this.moshafSource.asObservable();
  constructor(
    private recitersService: RecitersService,
    private route: ActivatedRoute
  ) {
    this.initializeData();
  }

  switchToMoshaf(moshaf: Moshaf) {
    this.moshafSource.next(moshaf);
  }

  private initializeData(): void {

    this.route.paramMap.pipe(
      map(param => param.get('id')),
      switchMap(id => {
        if (id) {
          return this.loadReciter(id)
        }
        return EMPTY;
      }),
      takeUntilDestroyed(),
    ).subscribe();

    this.moshaf$
      .pipe(
        tap((moshaf) => {
          this.updateSurahList(moshaf)
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    combineLatest([this.reciter$, this.loadSuwar(), this.moshaf$])
      .pipe(
        map(([reciter, suwar, moshaf]) =>
          this.mapSuwarToTracks(reciter, suwar, moshaf ?? reciter.moshaf[0])
        ),
        takeUntilDestroyed()
      )
      .subscribe((tracks) => {
        this.tracksSource.next(tracks);
      });
  }



  private loadReciter(id: string) {
    return this.recitersService.getReciter(id).pipe(
      map(data => data.reciters[0]),
      tap((reciter) => {
        this.reciterSource.next(reciter)
        this.moshafSource.next(reciter.moshaf[0])
      }))
  }

  private updateSurahList(moshaf: Moshaf): void {
    const surahList = moshaf.surah_list
      .split(',')
      .map((v) => v.padStart(3, '0'));
    this.reciterSurahListSource.next(surahList);
  }

  private loadSuwar(): Observable<Surah[]> {
    return this.recitersService.getSuraList();
  }

  private mapSuwarToTracks(
    reciter: Reciter,
    suwar: Surah[],
    moshaf: Moshaf
  ): Track[] {
    return suwar
      .filter((surah) =>
        this.reciterSurahListSource.getValue().includes(surah.id)
      )
      .map((surah) => ({
        id: surah.id,
        artist: reciter.name,
        title: surah.name,
        src: `${moshaf.server}${surah.id}.mp3`,
        album: moshaf.name,
      }));
  }
}
