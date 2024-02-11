import { Routes } from '@angular/router';
import { ReciterListComponent } from './reciters/feature/reciter-list/reciter-list.component';
import { ReciterDetailComponent } from './reciters/feature/reciter-detail/reciter-detail.component';
import { PlaylistComponent } from './playlist/feature/playlist.component';

export const routes: Routes = [
  {
    path: 'reciters',
    component: ReciterListComponent,
    title: 'reciters',
  },
  {
    path: 'reciters/:id',
    component: ReciterDetailComponent,
  },

  {
    path: 'playlists/:name',
    component: PlaylistComponent,
  },
];
