import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Location, Profile } from '@app/shared';
import { BaseComponent, ImageService, ProfileStoreService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent extends BaseComponent implements OnInit {

  profile$: Observable<Profile>;
  locationForm: FormGroup;
  imageUrl$: Observable<string>;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private profileStoreService: ProfileStoreService,
              private imageService: ImageService,
              private titleService: TitleService) {
    super();
    this.createForm();
  }

  loadForm(location: Location) {
    this.id.setValue(location._id);
    this.name.setValue(location.name);
    this.geoLongitude.setValue(location.geoLocation.coordinates[0]);
    this.geoLatitude.setValue(location.geoLocation.coordinates[1]);
    this.imageId.setValue(location.imageId);
    this.imageUrl$ = this.imageService.getDataUrl(this.imageId.value);
    this.fullAddress.setValue(location.fullAddress);
  }

  createForm() {
    this.locationForm = this.fb.group({
      id: [ null ],
      name: ['', Validators.required],
      geoLatitude: ['', Validators.required],
      geoLongitude: ['', Validators.required],
      imageId: [ null ],
      fullAddress: ['']
    });
  }

  ngOnInit() {
    this.titleService.setTitle('New Location');
    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      if (this.activatedRoute.snapshot.params.id) {
        this.loadForm(this.profileStoreService.findLocation(this.activatedRoute.snapshot.params.id));
        this.titleService.setTitle(this.name.value);
      }
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

  get id() { return this.locationForm.get('id'); }

  get name() { return this.locationForm.get('name'); }

  get geoLatitude() { return this.locationForm.get('geoLatitude'); }

  get geoLongitude() { return this.locationForm.get('geoLongitude'); }

  get imageId() { return this.locationForm.get('imageId'); }

  get fullAddress() { return this.locationForm.get('fullAddress'); }

}
