import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Image } from '../model/image';
import { Profile } from '../model/profile';
import { ImageService, ProfileStoreService } from '@app/core';

@Component({
  selector: 'herp-keeper-image-selector-modal',
  templateUrl: './image-selector-modal.component.html',
  styleUrls: ['./image-selector-modal.component.scss']
})
export class ImageSelectorModalComponent implements OnInit {

  profile: Profile;
  allImages: Array<Image> = [];
  images: Array<Image> = [];
  selected: Array<string> = [];
  numImages = 0;
  pageSize = 6;
  page = 1;
  maxSelected = 999;
  imageUrls$: Map<string, Observable<string>> = new Map();

  constructor(public activeModal: NgbActiveModal,
              private imageService: ImageService,
              private profileStoreService: ProfileStoreService) {
  }

  onSubmit() {
    this.activeModal.close(this.selected);
  }

  clearSelected() {
    this.selected = [];
  }

  selectImage(image: Image) {
    this.selected.push(image._id);
  }

  removeImage(image: Image) {
    this.selected = this.selected.filter(id => image._id !== id);
  }

  isSelected(image: Image): boolean {
    return (this.selected.find(id => image._id === id)) ? true : false;
  }

  sortImages(images: Array<Image>) {
    return [...images].sort((i1, i2) => {
      return (new Date(i1.updatedAt) < new Date(i2.updatedAt)) ? 1 : -1;
    });
  }

  loadImages(start: number, end: number) {
    this.images = [...this.allImages].slice(start, end);
  }

  changePage(newPage: number) {
    this.page = newPage;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.loadImages(start, end);
  }

  ngOnInit() {
    this.profile = this.profileStoreService.profile;
    this.allImages = this.sortImages(this.profile.images);
    this.imageUrls$ = new Map();
    this.allImages.forEach(img => this.imageUrls$.set(img._id, this.imageService.getDataUrl(img._id)));
    this.numImages = this.allImages.length;
    this.loadImages(0, this.pageSize);
  }

}
