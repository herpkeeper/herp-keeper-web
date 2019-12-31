import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError, Subscription } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ImageService, ProfileStoreService } from '@app/core';
import { SpeciesListComponent } from './species-list.component';

describe('SpeciesListComponent', () => {
  let component: SpeciesListComponent;
  let fixture: ComponentFixture<SpeciesListComponent>;
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
      declarations: [ SpeciesListComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = TestBed.get(ActivatedRoute);
    imageService = TestBed.get(ImageService);
    profileStoreService = TestBed.get(ProfileStoreService);
    profileStoreService.profile = {
      species: [{
        _id: 'species1',
        imageId: 'id',
        commonName: 'Name 2'
      }, {
        _id: 'species2',
        commonName: 'Name 1'
      }, {
        _id: 'species3',
        commonName: 'Name 3'
      }],
      animals: []
    } as any;
    fixture = TestBed.createComponent(SpeciesListComponent);
    component = fixture.componentInstance;
  });

  it('should fail to load profile on init', () => {
    activatedRoute.data = of({ loading: throwError(new Error('Failed')) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(1);
  });

  it('should load profile on init', () => {
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
  });

  it('should destroy', () => {
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
    component.ngOnDestroy();
  });

  it('should destroy on failed load', () => {
    activatedRoute.data = of({ loading: throwError(new Error('Failed')) });
    fixture.detectChanges();
    component.ngOnDestroy();
  });

  it('should cancel delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeSpecies').and.callThrough();
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteSpecies({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileStoreService.removeSpecies).not.toHaveBeenCalled();
  }));

  it('should fail to delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeSpecies').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteSpecies({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Failed to delete species');
  }));

  it('should delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeSpecies').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteSpecies({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Species successfully deleted');
  }));

  it('should view image', () => {
    spyOn(imageService, 'openImage').and.callFake(() => {});
    spyOn(profileStoreService, 'removeSpecies').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.viewImage('url');
  });

});
