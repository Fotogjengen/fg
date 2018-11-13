import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {IForeignKey, IResponse, IPhoto, IFilters} from 'app/model';
import {DATE_OPTIONS} from 'app/config';
import {ApiService, StoreService} from 'app/services';
import {Router, ActivatedRoute} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'fg-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  response: IResponse<IPhoto>;
  options = DATE_OPTIONS;

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];
  securityLevels: IForeignKey[];


  /*
  * We will send this to store when we press edit or multi edit
  * and use it when we are done editing to automatically search with the same
  * params when we get back
  */
  lastSearchString: string;
  motives: string[];
  filteredMotives: string[] = [];
  searching = false;
  photosAreLoaded = false;

  oldParams = {};

  truthies = [
    {name: '-- Alle --', value: null},
    {name: 'Sant', value: true},
    {name: 'Usant', value: false}
  ];

  constructor(
    private api: ApiService,
    private store: StoreService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    api.getAlbums().subscribe(x => this.albums = [{id: null, name: '-- Alle --'}, ...x]);
    api.getCategories().subscribe(x => this.categories = [{id: null, name: '-- Alle --'}, ...x]);
    api.getMediums().subscribe(x => this.mediums = [{id: null, name: '-- Alle --'}, ...x]);
    api.getPlaces().subscribe(x => this.places = [{id: null, name: '-- Alle --'}, ...x]);
    api.getSecurityLevels().subscribe(x => this.securityLevels = [{id: null, name: '-- Alle --'}, ...x]);
    api.getAllMotives().subscribe(x => {
      this.motives = x['motives'];
      this.filteredMotives = x['motives'];
    });
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      motive: [, []],
      tags: [, []],
      date_taken_from: [, []],
      date_taken_to: [, []],

      category: [, []],
      media: [, []],
      album: [, []],
      place: [, []],
      security_level: [, []],

      lapel: [, []],
      on_home_page: [, []],
      splash: [, []]
    });
    this.searchForm.get('motive').valueChanges.subscribe(m => {
      this.filteredMotives = this.motives.filter(motive => motive.toLowerCase().indexOf(m) !== -1);
    });
    // If we are routed back from "edit" then we will automatically search for the same as we had before we edited
    if (this.store.lastSearchedString !== undefined && this.store.lastSearchedString.length > 0) {
      this.initialize(JSON.parse(this.store.lastSearchedString));
      this.store.lastSearchedString = '';
    }
  }

  initialize(filter: any) {
    this.searchForm = this.fb.group({
      motive: [filter.motive, []],
      tags: [filter.tags ? this.initTags(filter.tags) : [], []],
      date_taken_from: [filter.date_taken_from, []],
      date_taken_to: [filter.date_taken_to, []],
      category: [filter.category, []],
      media: [filter.media, []],
      album: [filter.album, []],
      place: [filter.place, []],
      security_level: [filter.security_level, []],
      lapel: [filter.lapel, []],
      on_home_page: [filter.on_home_page, []],
      splash: [filter.splash, []]
    });
    this.search(filter);
  }

  search(filter: IFilters) {
    const searchVal = this.searchForm.value;
    searchVal.tags = [];
    this.store.getSearchTagsValue().forEach(t => searchVal.tags.push(t.id));
    this.searchHasOwnProperty(filter);

    this.router.navigate([], {
      queryParams: filter
    });

    this.searching = true;
    this.searchWithParams(filter);
  }

  searchHasOwnProperty(valObj) {
    for (const key in valObj) {
      if (valObj.hasOwnProperty(key)) {
        if (valObj[key] !== null && valObj[key].length < 1) {
          valObj[key] = null;
        }
      }
    }
  }

  searchWithParams(params) {
    this.api.getPhotos(params).subscribe(res => {
      this.response = res;
      this.oldParams = params; // saving old params to use later when changing page
      this.searching = false;
      this.photosAreLoaded = true;
      this.lastSearchString = JSON.stringify(params);
    });
  }

  initTags(tagNames): string[] {
    tagNames = Array.isArray(tagNames) ? tagNames : [tagNames];
    const tags: string[] = [];
    this.api.getForeignKey('tags').subscribe(ts => {
      if (ts['results']) {
        ts['results'].forEach(tag => {
          if (tagNames.includes(tag.id.toString())) {
            tags.push(tag.name);
            this.store.setSearchTagsAction(tag);
          }
        });
      }
    });
    return tags;
  }

  delete(photo: IPhoto) {
    console.log('TODO');
  }

  async editAllMarked() {
    this.store.lastSearchedString = this.lastSearchString;
    const ids = this.response.results.filter(p => p.checkedForEdit).map(p => p.id);
    await this.router.navigate(['../rediger'], {
      relativeTo: this.route,
      queryParams: {id: ids},
    });
  }

  async editSingle(photoID: number) {
    this.store.lastSearchedString = this.lastSearchString;
    console.log('hei');
    await this.router.navigate(['../rediger'], {
      relativeTo: this.route,
      queryParams: {id: photoID},
    });
  }

  check(photo: IPhoto) {
    photo.checkedForEdit = !photo.checkedForEdit;
  }

  onPhotoClick(i: number) {
    this.store.photoModal$.next([this.response.results, i]);
  }

  newParams(params: string) {
    if (!params) { // if last page were without any params (page 1, no tags etc)
      this.search({});
    } else if (params.indexOf('=') === -1) {
      this.search({...this.oldParams, page: params}); // unpacking old params and adding in new page param
      // doing this to avoid passing all params from paginator.component
    } else {
      const paramObj = {};
      params.split('&').forEach(param => {
        paramObj[param.split('=')[0]] = param.split('=')[1];
      });
      this.search(paramObj);
    }
  }
}
