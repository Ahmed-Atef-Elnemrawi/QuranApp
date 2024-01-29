import { Routes } from '@angular/router';
import { ReciterShellComponent } from './reciters/feature/reciter-shell/reciter-shell.component';


export const routes: Routes = [
  {
    path:'reciters',
    component:ReciterShellComponent,
    pathMatch:'prefix',
  },
];
