import { Component, Input } from '@angular/core';
import { trigger, transition, query, style, stagger, keyframes, animate } from '@angular/animations';
import { MasonryLayoutDirective } from 'app/directives';
import { IPhoto, IFilters, IMasonryOptions } from 'app/model';
import { StoreService } from 'app/services/store.service';
import { OnInit, AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'fg-masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss']
})
export class MasonryComponent implements OnInit {
  @Input() photos: IPhoto[];
  inCartPhotos: number[];

  masonryOptions: IMasonryOptions = {
    itemSelector: '.grid-item',
    fitWidth: true,
    stagger: 50
  };

  constructor(protected store: StoreService) {
    store.photoShoppingCart$.filter(p => !!p).subscribe(ps => this.inCartPhotos = ps.map(x => x.id));
  }

  onPhotoClick(i: number) {
    this.store.photoModal$.next([this.photos, i]);
  }

  ngOnInit() {
    this.photos.forEach(p => {
      if (this.inCartPhotos !== undefined && this.inCartPhotos.indexOf(p.id) !== -1) {
        p.addedToCart = true;
      }
    });
  }

  addToShoppingCart(photo: IPhoto) {
    this.store.addPhotoToCartAction(photo);
  }

  removeFromShoppingCart(photo: IPhoto) {
    this.store.removePhotoFromCartAction(photo);
  }

  disableRightClick(event) {
    event.preventDefault();
  }

}
