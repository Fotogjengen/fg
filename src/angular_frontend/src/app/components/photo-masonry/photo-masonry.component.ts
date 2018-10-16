import {Component, Input} from '@angular/core';
import {trigger, transition, query, style, stagger, keyframes, animate} from '@angular/animations';
import {MasonryLayoutDirective} from 'app/directives';
import {IPhoto, IFilters, IMasonryOptions} from 'app/model';
import {StoreService} from 'app/services/store.service';
import {OnInit, AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'fg-photo-masonry',
  templateUrl: './photo-masonry.component.html',
  styleUrls: ['./photo-masonry.component.scss']
})
export class PhotoMasonryComponent implements OnInit {
  @Input() photos: IPhoto[];
  inCartPhotos: number[];

  masonryOptions: IMasonryOptions = {
    itemSelector: '.grid-item',
    fitWidth: true,
    stagger: 50
  };


  constructor(protected store: StoreService) {
    /* TODO: When we decide to do shopping cart
     * Gets what is in the shopping cart
    store.photoShoppingCart$.filter(p => !!p).subscribe(ps => this.inCartPhotos = ps.map(x => x.id));
    */
  }

  onPhotoClick(i: number) {
    this.store.photoModal$.next([this.photos, i]);
  }

  ngOnInit() {
    /* TODO: When we decide to do shopping cart
     * Updates each photo that is added to shopping cart to show that it is added to shopping cart
    this.photos.forEach(p => {
      if (this.inCartPhotos !== undefined && this.inCartPhotos.indexOf(p.id) !== -1) {
        p.addedToCart = true;
      }
    });*/
  }

  /* TODO: When we decide to do shopping cart
   * Adds to shopping cart
  addToShoppingCart(photo: IPhoto) {
    this.store.addPhotoToCartAction(photo);
  }

   * Removes from shopping cart
  removeFromShoppingCart(photo: IPhoto) {
    this.store.removePhotoFromCartAction(photo);
  }*/

  /*
   * Create link from photos prod photo link
  */
  createDownloadlink(photo: string) {
    const loc = location.href.split('/');
    const str = loc[0] + '//' + loc[2] + photo;
    return str;
  }

  disableRightClick(event) {
    event.preventDefault();
  }
}
