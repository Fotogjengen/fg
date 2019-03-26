import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class RssService {

  private SAMFUNDET_RSS_URL = 'http://samfundet.no/rss';

  constructor(private http: HttpClient) {
  }

  async parseSamfundetFeed() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      }),
    };
    // const rawFeed = await this.http.get(this.SAMFUNDET_RSS_URL, httpOptions).subscribe(res => console.log(res));
  }

}
