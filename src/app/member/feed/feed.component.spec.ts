import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError} from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ProfileStoreService } from '@app/core';
import { FeedComponent } from './feed.component';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let activatedRoute;
  let profileStoreService: ProfileStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({})
      ],
      declarations: [ FeedComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    profileStoreService = TestBed.get(ProfileStoreService);
    profileStoreService.profile = {
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
      locations: [{
        _id: 'location1'
      }],
      animals: [{
        _id: 'id1',
        name: 'Name 2',
        locationId: 'location1',
        speciesId: 'species1',
        feedings: []
      }, {
        _id: 'id2',
        name: 'Name 1',
        locationId: 'location1',
        speciesId: 'species2',
        feedings: []
      }, {
        _id: 'id3',
        name: 'Name 4',
        locationId: 'location1',
        speciesId: 'species1',
        feedings: []
      }, {
        _id: 'id4',
        name: 'Name 3',
        locationId: 'location1',
        speciesId: 'species1',
        feedings: []
      }, {
        _id: 'id5',
        name: 'Name 3',
        locationId: 'location1',
        speciesId: 'species1',
        feedings: []
      }]
    } as any;
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.snapshot = {
      params: {
      }
    };
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
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

  it('should change location and clear', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.location.setValue('location1');
    component.changeLocation();
    expect(component.filteredAnimals.length).toEqual(5);
    component.location.setValue('');
    component.changeLocation();
    expect(component.filteredAnimals.length).toEqual(0);
  });

  it('should filter', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.location.setValue('location1');
    component.changeLocation();
    component.speciesFilter.setValue('species1');
    component.filterAnimals();
    expect(component.filteredAnimals.length).toEqual(4);
  });

  it('should select then deselect all', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.location.setValue('location1');
    component.changeLocation();
    component.selectAll();
    expect(component.hasSelectedAnimals()).toBeTruthy();
    component.selectNone();
    expect(component.hasSelectedAnimals()).toBeFalsy();
  });

  it('should go next then back', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.location.setValue('location1');
    component.changeLocation();
    component.animalsFormArray.at(0).get('selected').setValue(true);
    component.animalsFormArray.at(1).get('selected').setValue(true);
    component.next();
    expect(component.selectedAnimalsFormArray.length).toBe(2);
    component.back();
    expect(component.selectedAnimalsFormArray.length).toBe(0);
  });

  it('should fail to feed animals', () => {
    spyOn(profileStoreService, 'updateAnimals').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.location.setValue('location1');
    component.changeLocation();
    component.animalsFormArray.at(0).get('selected').setValue(true);
    component.animalsFormArray.at(1).get('selected').setValue(true);
    component.next();
    component.feedAnimals();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to update animals');
  });

  it('should feed animals', () => {
    spyOn(profileStoreService, 'updateAnimals').and.returnValue(of([{}, {}] as any));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.location.setValue('location1');
    component.changeLocation();
    component.animalsFormArray.at(0).get('selected').setValue(true);
    component.animalsFormArray.at(1).get('selected').setValue(true);
    component.next();
    component.feedAnimals();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Animals have been successfully fed');
  });

});
