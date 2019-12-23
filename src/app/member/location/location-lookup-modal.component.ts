import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent, GeocodeService } from '@app/core';

@Component({
  selector: 'herp-keeper-location-lookup-modal',
  templateUrl: './location-lookup-modal.component.html',
  styleUrls: ['./location-lookup-modal.component.scss']
})
export class LocationLookupModalComponent extends BaseComponent implements OnInit {

  locationLookupForm: FormGroup;

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal,
              private geocodeService: GeocodeService) {
    super();
    this.createForm();
  }

  submit() {
    const res = {
      latitude: this.latitude.value,
      longitude: this.longitude.value,
      address: this.address.value
    };
    this.activeModal.close(res);
  }

  search() {
    this.loading = true;
    this.alerts = [];
    this.geocodeService.geocodeAddress(this.address.value).subscribe(res => {
      this.loading = false;
      this.address.setValue(res[0].formatted_address);
      this.latitude.setValue(res[0].geometry.location.lat());
      this.longitude.setValue(res[0].geometry.location.lng());
    }, err => {
      this.alerts.push({type: 'danger', message: 'Could not geocode address'});
      this.loading = false;
    });
  }

  createForm() {
    this.locationLookupForm = this.fb.group({
      address: [''],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  setLatLng(lat: number, lng: number) {
    this.latitude.setValue(lat);
    this.longitude.setValue(lng);

    this.alerts = [];
    this.loading = true;
    this.geocodeService.reverseGeocode(lat, lng).subscribe(res => {
      this.address.setValue(res[0].formatted_address);
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Could not reverse geocode location'});
      this.loading = false;
    });
  }

  ngOnInit() {
  }

  get address() { return this.locationLookupForm.get('address'); }

  get latitude() { return this.locationLookupForm.get('latitude'); }

  get longitude() { return this.locationLookupForm.get('longitude'); }

}
