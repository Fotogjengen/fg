import {Component, OnInit, HostListener} from '@angular/core';
import {StoreService} from 'app/services/store.service';
import {IPhoto} from 'app/model';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'fg-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss']
})
export class PhotoModalComponent {
  photos: IPhoto[];
  shown_photo: {
    shown: boolean,
    photo: IPhoto,
    index: number
  };

  constructor(private store: StoreService) {
    // Might have to make sure these two fetches from store is done after one another???
    store.photoModal$.filter(p => !!p).subscribe(p => {
      this.photos = p[0]; // Index 0 is the array of photos
      this.shown_photo = {
        shown: true,
        index: p[1],
        photo: p[0][p[1]] // Index p[1] is the index of the photo to open in modal first
      };
    });
  }

  // Changes to next photo in photo modal


  // Listenes to keyevents
  @HostListener('document:keyup', ['$event'])
  keyEvent(event) {
    if (event.keyCode === 27) { // 27 = escape
      this.shown_photo.shown = false;
    } else if (event.keyCode === 39) { // 39 = right arrow
      this.nextPhoto();
    } else if (event.keyCode === 37) { // 39 = right arrow
      this.previousPhoto();
    }
  }

  nextPhoto() {
    // If right arrow key is pressed change to next photo
    // If you are on the last photo, change to the first one
    if (this.shown_photo.index + 1 >= this.photos.length) {
      this.shown_photo.index = 0;
    } else {
      this.shown_photo.index++;
    }
    this.shown_photo.photo = this.photos[this.shown_photo.index];
  }

  previousPhoto() {
    // If left arrow key is pressed change to previous photo
    // If you are on the first photo, change to the last one
    if (this.shown_photo.index - 1 < 0) {
      this.shown_photo.index = this.photos.length - 1;
    } else {
      this.shown_photo.index--;
    }
    this.shown_photo.photo = this.photos[this.shown_photo.index];
  }

  addToShoppingCart() {
    this.store.addPhotoToCartAction(this.shown_photo.photo);
  }

  removeFromShoppingCart() {
    this.store.removePhotoFromCartAction(this.shown_photo.photo);
  }

  disableRightClick(event) {
    event.preventDefault();
  }
}
