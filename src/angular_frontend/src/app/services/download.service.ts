import {Injectable} from '@angular/core';


@Injectable()
export class DownloadService {
  private photos: string[];


  constructor() {
  }

  /*
  * Create link from photos prod photo link
 */
  createDownloadlink(photo: string) {
    const loc = location.href.split('/');
    const str = loc[0] + '//' + loc[2] + photo;
    return str;
  }

}
