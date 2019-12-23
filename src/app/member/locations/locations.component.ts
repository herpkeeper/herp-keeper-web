import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent, ImageService, ProfileStoreService, TitleService } from '@app/core';
import { ConfirmModalComponent, Location, Profile } from '@app/shared';

@Component({
  selector: 'herp-keeper-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent extends BaseComponent implements OnInit {

  profile$: Observable<Profile>;
  profileSubscription: Subscription;
  imageUrls$: Map<string, Observable<string>> = new Map();

  constructor(private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private profileStoreService: ProfileStoreService,
              private imageService: ImageService,
              private titleService: TitleService) {
    super();
  }

  viewImage(url: string) {
    this.imageService.openImage(url);
  }

  isReferenced(location: Location) {
    return this.profileStoreService.isLocationReferenced(location._id);
  }

  deleteLocation(location: Location) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = `Delete ${location.name}?`;
    modalRef.componentInstance.body = 'Are you sure you want to delete this location?';

    modalRef.result.then((res) => {
      this.alerts = [];
      this.loading = true;
      this.profileStoreService.removeLocation(location).subscribe(l => {
        this.alerts.push({type: 'success', message: 'Location successfully deleted'});
        this.loading = false;
      }, err => {
        this.alerts.push({type: 'danger', message: 'Failed to delete location'});
        this.loading = false;
      });
    }).catch((err) => {
    });
  }

  subscribeToProfileChanges() {
    this.profileSubscription = this.profile$.subscribe(profile => {
      this.imageUrls$ = new Map();
      profile.locations.forEach(loc => {
        if (loc.imageId) {
          this.imageUrls$.set(loc.imageId, this.imageService.getDataUrl(loc.imageId));
        }
      });
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Locations');
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
