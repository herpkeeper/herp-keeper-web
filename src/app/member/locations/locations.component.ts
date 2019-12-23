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
