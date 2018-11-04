import {Observable} from 'rxjs/Observable';
import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {INgxMyDpOptions, IMyDate} from 'ngx-mydatepicker';
import {HttpEvent} from '@angular/common/http';
import {StoreService, ApiService} from 'app/services';
import {IForeignKey, ILatestImageAndPage, IFilters} from 'app/model';
import {DATE_OPTIONS} from 'app/config';
import {FileUploader, FileUploaderOptions, FileItem} from 'angular-file';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'fg-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader();
  validComboDrag = false;
  invalidComboDrag = false;
  uploadForm: FormGroup;
  uploadInfo: ILatestImageAndPage;

  options = DATE_OPTIONS;

  albums: IForeignKey[];
  categories: IForeignKey[];
  mediums: IForeignKey[];
  places: IForeignKey[];
  securityLevels: IForeignKey[];

  splashPhotos: number[] = [];
  lapelPhotos: number[] = [];
  isFrontPagePhotos: number[] = [];

  constructor(
    private store: StoreService,
    private api: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // TODO - change this to use storeservice instead of API?
    this.albums = store.getFilteredAlbumsAction('DIG');
    api.getCategories().subscribe(x => this.categories = x);
    api.getMediums().subscribe(x => this.mediums = x);
    api.getPlaces().subscribe(x => this.places = x);
    api.getSecurityLevels().subscribe(x => this.securityLevels = x);
  }

  ngOnInit() {
    const date = new Date();
    this.uploadForm = this.fb.group({
      page: [, [Validators.required, Validators.min(0), Validators.max(100)]],
      image_number: [, [Validators.required]],
      motive: ['Motive_test', [Validators.required]],
      tags: [[], []],
      date_taken: [{jsdate: new Date()}, [Validators.required]],

      category: [1, [Validators.required]],
      media: [1, [Validators.required]],
      album: [, [Validators.required]],
      place: [1, [Validators.required]],
      security_level: [1, [Validators.required]],
    });

    this.uploadForm.get('album').valueChanges.subscribe(a => {
      this.updateForm(a);
    });
  }

  // Do this in backend instead?
  updateForm(album: number, item?: FileItem, id?: number) {
    this.api.getLatestPageAndImageNumber(album).subscribe(e => {
      this.uploadInfo = e;
      this.uploadForm.patchValue({
        page: this.uploadInfo.latest_page,
        image_number: this.uploadInfo.latest_image_number + 1
      });
      if (item) {
        this.uploadItem(item, id);
      }
    });
  }

  uploadItem(item: FileItem, id: number) {
    const date_taken = this.uploadForm.value['date_taken']['jsdate'].toISOString();
    if (this.uploadForm.valid) {
      item.isUploading = true;
      item.progress = 20;
      console.log(item._file);
      this.store.postPhotoAction({
        ...this.uploadForm.value,
        photo: item._file,
        date_taken,
        splash: this.splashPhotos.indexOf(id) !== -1,
        lapel: this.lapelPhotos.indexOf(id) !== -1,
        on_home_page: this.isFrontPagePhotos.indexOf(id) !== -1
      }).subscribe(event => {
          console.log('Completed: ' + item._file.name);
          this.toastr.success(null, 'Opplasting fullført 🔥');
          item.progress = 100;
          item.isUploaded = true;
          item.isUploading = false;
          item.isSuccess = true;
        },
        error => {
          item.isError = true;
          item.isUploading = false;
          console.error(error);
        });
    }
  }

  // Pushes/Pops splashPhotos with list index of splash photos
  makeSplash(id: number) {
    const index = this.splashPhotos.indexOf(id);
    if (index === -1) {
      this.splashPhotos.push(id);
    }else {
      this.splashPhotos.splice(index, 1);
    }
  }
  // Pushes/Pops splashPhotos with list index of lapel photos
  makeLapel(id: number) {
    const index = this.lapelPhotos.indexOf(id);
    if (index === -1) {
      this.lapelPhotos.push(id);
    }else {
      this.lapelPhotos.splice(index, 1);
    }
  }
  // Pushes/Pops splashPhotos with list index of homepage photos
  makeFrontPage(id: number) {
    const index = this.isFrontPagePhotos.indexOf(id);
    if (index === -1) {
      this.isFrontPagePhotos.push(id);
    }else {
      this.isFrontPagePhotos.splice(index, 1);
    }
  }

  removeItem(item: FileItem) {
    this.uploader.removeFromQueue(item);
    if (this.uploader.queue.length === 0) {
      this.uploader = new FileUploader();
    }
  }

  uploadAll() {
    console.log('Uploading all');
    if (this.uploadForm.valid) {
      for (const item of this.uploader.queue.filter(i => !i.isSuccess)) {
        this.updateForm(this.uploadForm.value['album'], item);
      }
    }
  }
}
