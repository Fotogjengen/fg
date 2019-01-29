import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {StoreService, ApiService} from 'app/services';
import {IForeignKey} from 'app/model';
import {DATE_OPTIONS} from 'app/config';
import {FileUploader, FileItem} from 'angular-file';
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
      motive: ['Motive_test', [Validators.required]],
      tags: [[], []],
      date_taken: [{jsdate: new Date()}, [Validators.required]],

      category: [1, [Validators.required]],
      media: [1, [Validators.required]],
      album: [, [Validators.required]],
      place: [1, [Validators.required]],
      security_level: [1, [Validators.required]],
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
    } else {
      this.splashPhotos.splice(index, 1);
    }
  }

  // Pushes/Pops splashPhotos with list index of lapel photos
  makeLapel(id: number) {
    const index = this.lapelPhotos.indexOf(id);
    if (index === -1) {
      this.lapelPhotos.push(id);
    } else {
      this.lapelPhotos.splice(index, 1);
    }
  }

  // Pushes/Pops splashPhotos with list index of homepage photos
  makeFrontPage(id: number) {
    const index = this.isFrontPagePhotos.indexOf(id);
    if (index === -1) {
      this.isFrontPagePhotos.push(id);
    } else {
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
      //  TODO: I think we can delete this entire function
      }
    }
  }
}
