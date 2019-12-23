import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AgmCoreModule } from '@agm/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { GeocodeService } from '@app/core';
import { LocationLookupModalComponent } from './location-lookup-modal.component';

describe('LocationLookupModalComponent', () => {
  let component: LocationLookupModalComponent;
  let fixture: ComponentFixture<LocationLookupModalComponent>;
  let geocodeService: GeocodeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({}),
        AgmCoreModule.forRoot({
        })
      ],
      providers: [ NgbActiveModal ],
      declarations: [ LocationLookupModalComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    geocodeService = TestBed.get(GeocodeService);
    fixture = TestBed.createComponent(LocationLookupModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    fixture.detectChanges();
    component.submit();
  });

  it('should fail to search', () => {
    spyOn(geocodeService, 'geocodeAddress').and.returnValue(throwError(new Error('Failed')));
    fixture.detectChanges();
    component.address.setValue('test');
    component.search();
    expect(component.alerts.length).toEqual(1);
    expect(component.address.value).toEqual('test');
    expect(component.alerts[0].message).toEqual('Could not geocode address');
  });

  it('should search', () => {
    spyOn(geocodeService, 'geocodeAddress').and.returnValue(of([{
      formatted_address: 'address',
      geometry: {
        location: {
          lat: () => 0,
          lng: () => 1
        }
      }
    }]));
    fixture.detectChanges();
    component.search();
    expect(component.alerts.length).toEqual(0);
    expect(component.address.value).toEqual('address');
    expect(component.latitude.value).toEqual(0);
    expect(component.longitude.value).toEqual(1);
  });

  it('should fail to reverse geocode when setting lat lng', () => {
    spyOn(geocodeService, 'reverseGeocode').and.returnValue(throwError(new Error('Failed')));
    fixture.detectChanges();
    component.setLatLng(0, 1);
    expect(component.alerts.length).toEqual(1);
    expect(component.address.value).toEqual('');
    expect(component.alerts[0].message).toEqual('Could not reverse geocode location');
  });

  it('should reverse geocode when setting lat lng', () => {
    spyOn(geocodeService, 'reverseGeocode').and.returnValue(of([{ formatted_address: 'address' }]));
    fixture.detectChanges();
    component.setLatLng(0, 1);
    expect(component.alerts.length).toEqual(0);
    expect(component.address.value).toEqual('address');
  });

});
