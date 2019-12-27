import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError, Subscription } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';
import { ProfileStoreService } from '@app/core';
import { AnimalsComponent } from './animals.component';

describe('AnimalsComponent', () => {
  let component: AnimalsComponent;
  let fixture: ComponentFixture<AnimalsComponent>;
  let profileStoreService: ProfileStoreService;
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
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({}),
        SharedModule
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ AnimalsComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = TestBed.get(ActivatedRoute);
    profileStoreService = TestBed.get(ProfileStoreService);
    profileStoreService.profile = {
      locations: [{
        _id: 'location1'
      }],
      species: [{
        _id: 'species1',
        commonName: 'Name 2'
      }, {
        _id: 'species2',
        commonName: 'Name 1'
      }, {
        _id: 'species3',
        commonName: 'Name 3'
      }],
      animals: [{
        name: 'Name 2',
        sex: 'M',
        locationId: 'location1',
        speciesId: 'species1',
        images: [{
        }, {
          default: true
        }],
        feedings: [{
          feedingDate: new Date('01/01/2019')
        }, {
          feedingDate: new Date('01/01/2020')
        }, {
          feedingDate: new Date('01/01/2018')
        }]
      }, {
        name: 'Name 1',
        sex: 'F',
        locationId: 'location1',
        speciesId: 'species2',
        images: [],
        feedings: []
      }, {
        name: 'Name 4',
        sex: 'F',
        locationId: 'location1',
        speciesId: 'species1',
        images: [],
        feedings: []
      }, {
        name: 'Name 3',
        sex: 'F',
        locationId: 'location1',
        speciesId: 'species1',
        images: [],
        feedings: []
      }, {
        name: 'Name 3',
        sex: 'F',
        locationId: 'location1',
        speciesId: 'species1',
        images: [],
        feedings: []
      }]
    } as any;
    fixture = TestBed.createComponent(AnimalsComponent);
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
    spyOn(profileStoreService, 'removeAnimal').and.callThrough();
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteAnimal({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileStoreService.removeAnimal).not.toHaveBeenCalled();
  }));

  it('should fail to delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeAnimal').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteAnimal({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Failed to delete animal');
  }));

  it('should delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeAnimal').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.deleteAnimal({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Animal successfully deleted');
  }));

  it('should filter', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.speciesFilter.setValue('species1');
    component.sexFilter.setValue('M');
    component.filter();
    expect(component.filteredAnimals.length).toEqual(1);
  });

});
