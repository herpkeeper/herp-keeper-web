import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError} from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ImageService, ProfileStoreService } from '@app/core';
import { LocationsComponent } from './locations.component';

describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;
  let profileStoreService: ProfileStoreService;
  let imageService: ImageService;
  let activatedRoute;
  let modalResolve;
  let modalReject;

  beforeEach(async(() => {
    const modalServiceStub = {
      open(modal: any) {
        return {
          componentInstance: {
          },
          result: new Promise((resolve, reject) => {
            modalResolve = resolve;
            modalReject = reject;
          })
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({})
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ LocationsComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = TestBed.get(ActivatedRoute);
    imageService = TestBed.get(ImageService);
    profileStoreService = TestBed.get(ProfileStoreService);
    profileStoreService.profile = {
      locations: [{
        _id: 'id1',
        imageId: 'id'
      }, {
        _id: 'id2'
      }],
      animals: [{
        locationId: 'id1'
      }]
    } as any;
    fixture = TestBed.createComponent(LocationsComponent);
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

  it('should cancel delete location', fakeAsync(() => {
    spyOn(profileStoreService, 'removeLocation').and.callThrough();
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteLocation({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileStoreService.removeLocation).not.toHaveBeenCalled();
  }));

  it('should fail to delete location', fakeAsync(() => {
    spyOn(profileStoreService, 'removeLocation').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteLocation({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Failed to delete location');
  }));

  it('should delete location', fakeAsync(() => {
    spyOn(profileStoreService, 'removeLocation').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteLocation({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Location successfully deleted');
  }));

  it('should view image', () => {
    spyOn(imageService, 'openImage').and.callFake(() => {});
    spyOn(profileStoreService, 'removeLocation').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.viewImage('url');
  });

});
