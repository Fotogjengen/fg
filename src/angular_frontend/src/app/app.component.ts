import { Component, ViewEncapsulation } from '@angular/core';
import { StoreService } from 'app/services/store.service';
import {DownloadService} from './services/download.service';

@Component({
  selector: 'fg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'fg works!';

  constructor(public store: StoreService) {}
}
