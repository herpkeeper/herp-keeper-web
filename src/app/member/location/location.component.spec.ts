import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError} from 'rxjs';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ProfileStoreService } from '@app/core';
import { LocationComponent } from './location.component';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  let activatedRoute;
  let profileStoreService: ProfileStoreService;
  let loader;
  let modalResolve;
  let modalReject;

  beforeEach(async(() => {
    (window as any).google = {
      maps: {
        Map: class Map {
          constructor() {
          }
          setOptions() {
          }
          addListener() {
          }
          setCenter() {
          }
        },
        Marker: class Marker {
          constructor() {
          }
          setMap() {
          }
          addListener() {
          }
        },
        Animation: [],
        event: {
          clearInstanceListeners: () => {
          }
        }
      }
    };
    const modalServiceStub = {
      open(modal: any) {
        return {
          componentInstance: {
            setLatLng: (lat, lng) => {
            }
          },
          result: new Promise((resolve, reject) => {
            modalResolve = resolve;
            modalReject = reject;
          })
        };
      }
    };
    loader = {
      load: () => {
        return Promise.resolve();
      }
    };
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({}),
        AgmCoreModule
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MapsAPILoader, useValue: loader }
      ],
      declarations: [ LocationComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.snapshot = {
      params: {
      }
    };
    profileStoreService = TestBed.get(ProfileStoreService);
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
  });

  it('should fail to load profile on init', () => {
    activatedRoute.data = of({ loading: throwError(new Error('Failed')) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(1);
  });

  it('should load profile on init', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
  });

  it('should load profile and location on init', () => {
    spyOn(profileStoreService, 'findLocation').and.returnValue({
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    });
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
    expect(component.id.value).toEqual('id');
    expect(component.name.value).toEqual('Name');
  });

  it('should fail to add location', () => {
    spyOn(profileStoreService, 'addLocation').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.name.setValue('Name');
    component.onSubmit();
    expect(component.alerts.length).toBe(1)
    expect(component.alerts[0].message).toEqual('Failed to save location');
  });

  it('should add location', () => {
    spyOn(profileStoreService, 'addLocation').and.returnValue(of({
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    }));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.name.setValue('Name');
    component.onSubmit();
    expect(component.alerts.length).toBe(1)
    expect(component.alerts[0].message).toEqual('Location successfully added');
    expect(component.id.value).toEqual('id');
    expect(component.name.value).toEqual('Name');
  });

  it('should fail to update location', () => {
    spyOn(profileStoreService, 'updateLocation').and.returnValue(throwError(new Error('Failed')));
    spyOn(profileStoreService, 'findLocation').and.returnValue({
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    });
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.name.setValue('New Name');
    component.onSubmit();
    expect(component.alerts.length).toBe(1)
    expect(component.alerts[0].message).toEqual('Failed to save location');
  });

  it('should update location', () => {
    spyOn(profileStoreService, 'updateLocation').and.returnValue(of({
      _id: 'id',
      name: 'New Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    }));
    spyOn(profileStoreService, 'findLocation').and.returnValue({
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    });
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.name.setValue('New Name');
    component.onSubmit();
    expect(component.alerts.length).toBe(1)
    expect(component.alerts[0].message).toEqual('Location successfully updated');
    expect(component.id.value).toEqual('id');
    expect(component.name.value).toEqual('New Name');
  });

  it('should lookup location and cancel', fakeAsync(() => {
    spyOn(profileStoreService, 'addLocation').and.returnValue(of({
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    }));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.lookupLocation();
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(component.geoLatitude.valid).toBeFalsy();
    expect(component.geoLongitude.valid).toBeFalsy();
  }));

  it('should lookup location', fakeAsync(() => {
    spyOn(profileStoreService, 'addLocation').and.returnValue(of({
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    }));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.lookupLocation();
    modalResolve({ latitude: 0, longitude: 1 });
    fixture.detectChanges();
    tick();
    expect(component.geoLatitude.valid).toBeTruthy();
    expect(component.geoLongitude.valid).toBeTruthy();
  }));

  it('should lookup location and set', fakeAsync(() => {
    spyOn(profileStoreService, 'addLocation').and.returnValue(of({
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    }));
    activatedRoute.data = of({ loading: of(true) });
    component.name.setValue('Name');
    component.geoLatitude.setValue('1');
    component.geoLongitude.setValue('0');
    component.lookupLocation();
    fixture.detectChanges();
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
  }));

  it('should remove image', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.imageId.setValue('id');
    component.removeImage();
    expect(component.imageId.value).toBeFalsy();
  });

  it('should cancel select image', fakeAsync(() => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.selectImage();
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(component.imageId.value).toBeFalsy();
  }));

  it('should select image', fakeAsync(() => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.selectImage();
    modalResolve(['id1', 'id2']);
    fixture.detectChanges();
    tick();
    expect(component.imageId.value).toBe('id1');
  }));

});
