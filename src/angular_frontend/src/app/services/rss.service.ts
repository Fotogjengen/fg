import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RssService {

  private rssToJsonServiceBaseUrl = 'https://rss2json.com/api.json?rss_url=';

  constructor(private http: HttpClient) {
  }


}
