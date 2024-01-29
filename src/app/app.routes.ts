import { Routes } from '@angular/router';
import { PlaylistComponent } from './playlist/playlist.component';
import { ReciterShellComponent } from './reciters/feature/reciter-shell/reciter-shell.component';


export const routes: Routes = [
  {
    path:'reciters',
    component:ReciterShellComponent,
    pathMatch:'prefix',
  },
{
  path:'playlist',
  component:PlaylistComponent,
  pathMatch:'prefix',
  resolve:{},
}
];
