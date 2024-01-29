import { Component } from '@angular/core';
import { ReciterListComponent } from '../reciter-list/reciter-list.component';

@Component({
  selector: 'app-reciter-shell',
  standalone: true,
  imports: [ReciterListComponent],
  template: ` <app-reciter-list /> `,
  styles: ``,
})
export class ReciterShellComponent {}
