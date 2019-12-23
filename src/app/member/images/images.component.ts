import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent, ImageService, ProfileStoreService, TitleService } from '@app/core';
import { ConfirmModalComponent, Image, Profile } from '@app/shared';
import { ImageEditModalComponent } from './image-edit-modal.component'

@Component({
  selector: 'herp-keeper-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent extends BaseComponent implements OnInit, OnDestroy {

  profile$: Observable<Profile>;
  profileSubscription: Subscription;
  numImages = 0;
  pageSize = 6;
  page = 1;

  imageUrls$: Map<string, Observable<string>> = new Map();
  images: Array<Image> = [];
  allImages: Array<Image> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private imageService: ImageService,
              private profileStoreService: ProfileStoreService,
              private titleService: TitleService) {
    super();
  }

  viewImage(url: string) {
    this.imageService.openImage(url);
  }

  deleteImage(image: Image) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = `Delete ${image.title}?`;
    modalRef.componentInstance.body = 'Are you sure you want to delete this image?';

    modalRef.result.then((res) => {
      this.alerts = [];
      this.loading = true;
      this.profileStoreService.removeImage(image).subscribe(i => {
        this.alerts.push({type: 'success', message: 'Image successfully deleted'});
        this.loading = false;
      }, err => {
        this.alerts.push({type: 'danger', message: 'Failed to delete image'});
        this.loading = false;
      });
    }).catch((err) => {
    });
  }

  editImage(image: Image) {
    const modalRef = this.modalService.open(ImageEditModalComponent, { size: 'lg' });
    modalRef.componentInstance.loadImage(image);
    modalRef.result.then((res) => {
      this.alerts = [];
      this.loading = true;
      this.profileStoreService.updateImage(image).subscribe(i => {
        this.alerts.push({type: 'success', message: 'Image successfully updated'});
        this.loading = false;
      }, err => {
        this.alerts.push({type: 'danger', message: 'Failed to save image'});
        this.loading = false;
      });
    }).catch((err) => {
    });
  }

  addImage() {
    const modalRef = this.modalService.open(ImageEditModalComponent, { size: 'lg' });
    modalRef.result.then((res) => {
      this.alerts = [];
      this.loading = true;
      this.profileStoreService.addImage(res).subscribe(image => {
        this.alerts.push({type: 'success', message: 'Image successfully added'});
        this.loading = false;
      }, err => {
        this.alerts.push({type: 'danger', message: 'Failed to save image'});
        this.loading = false;
      });
    }).catch((err) => {
    });
  }

  sortImages(images: Array<Image>) {
    return [...images].sort((i1, i2) => {
      return (new Date(i1.updatedAt) < new Date(i2.updatedAt)) ? 1 : -1;
    });
  }

  loadImages(start: number, end: number) {
    this.images = [...this.allImages].slice(start, end);
  }

  subscribeToProfileChanges() {
    this.profileSubscription = this.profile$.subscribe(profile => {
      this.numImages = profile.images.length;
      this.allImages = this.sortImages(profile.images);
      this.imageUrls$ = new Map();
      this.allImages.forEach(img => this.imageUrls$.set(img._id, this.imageService.getDataUrl(img._id)));
      this.loadImages(0, this.pageSize);
      this.page = 1;
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.loadImages(start, end);
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Images');
    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      this.subscribeToProfileChanges();
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

}
