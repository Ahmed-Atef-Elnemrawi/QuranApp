import {
  Component,
} from '@angular/core';
import { RecitersService } from '../../data-access/reciters.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reciter-list',
  standalone: true,
  imports: [CommonModule],
  providers: [RecitersService],
  templateUrl: './reciter-list.component.html',
  styles: ``,
})
export class ReciterListComponent {

}
