import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ProfileStoreService } from '@app/core';
import { SharedModule } from '@app/shared';
import { AnimalDetailComponent } from './animal-detail.component';

describe('AnimalDetailComponent', () => {
  let component: AnimalDetailComponent;
  let fixture: ComponentFixture<AnimalDetailComponent>;
  let profileStoreService: ProfileStoreService;
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
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({}),
        SharedModule
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ AnimalDetailComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalDetailComponent);
    component = fixture.componentInstance;
    profileStoreService = TestBed.get(ProfileStoreService);
  });

  it('should create', () => {
    const feedings = [{
      feedingDate: new Date('01/01/2019')
    }, {
      feedingDate: new Date('01/01/2020')
    }, {
      feedingDate: new Date('01/01/2020')
    }];
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ locationId: 'id', speciesId: 'id', feedings: feedings, sex: 'M' } as any);
    spyOn(profileStoreService, 'findLocation').and.returnValue({} as any);
    spyOn(profileStoreService, 'findSpecies').and.returnValue({} as any);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should edit', () => {
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ locationId: 'id', speciesId: 'id', feedings: [], sex: 'M' } as any);
    spyOn(profileStoreService, 'findLocation').and.returnValue({} as any);
    spyOn(profileStoreService, 'findSpecies').and.returnValue({} as any);
    spyOn(component.edit, 'emit').and.callThrough();
    fixture.detectChanges();
    component.editAnimal();
    expect(component.edit.emit).toHaveBeenCalled();
  });

  it('should change feeding page', () => {
    const feedings = [{
      feedingDate: new Date('01/01/2019')
    }, {
      feedingDate: new Date('01/01/2020')
    }, {
      feedingDate: new Date('01/01/2020')
    }];
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ locationId: 'id', speciesId: 'id', feedings: feedings, sex: 'M' } as any);
    spyOn(profileStoreService, 'findLocation').and.returnValue({} as any);
    spyOn(profileStoreService, 'findSpecies').and.returnValue({} as any);
    fixture.detectChanges();
    component.changeFeedingPage(2);
    expect(component.feedingPage).toBe(2);
  });

  it('should cancel delete feeding', fakeAsync(() => {
    const feedings = [{
      feedingDate: new Date('01/01/2019')
    }, {
      feedingDate: new Date('01/01/2020')
    }, {
      feedingDate: new Date('01/01/2020')
    }];
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ locationId: 'id', speciesId: 'id', feedings: feedings, sex: 'M' } as any);
    spyOn(profileStoreService, 'findLocation').and.returnValue({} as any);
    spyOn(profileStoreService, 'findSpecies').and.returnValue({} as any);
    spyOn(profileStoreService, 'updateAnimal').and.callThrough();
    fixture.detectChanges();
    component.deleteFeeding({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileStoreService.updateAnimal).not.toHaveBeenCalled();
  }));

  it('should fail to delete feeding', fakeAsync(() => {
    const feedings = [{
      feedingDate: new Date('01/01/2019')
    }, {
      feedingDate: new Date('01/01/2020')
    }, {
      feedingDate: new Date('01/01/2020')
    }];
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ locationId: 'id', speciesId: 'id', feedings: feedings, sex: 'M' } as any);
    spyOn(profileStoreService, 'findLocation').and.returnValue({} as any);
    spyOn(profileStoreService, 'findSpecies').and.returnValue({} as any);
    spyOn(profileStoreService, 'updateAnimal').and.returnValue(throwError(new Error('Failed')));
    fixture.detectChanges();
    spyOn(component, 'loadFeedings').and.callThrough();
    component.deleteFeeding({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.loadFeedings).not.toHaveBeenCalled();
  }));

  it('should delete feeding', fakeAsync(() => {
    const feedings = [{
      feedingDate: new Date('01/01/2019')
    }, {
      feedingDate: new Date('01/01/2020')
    }, {
      feedingDate: new Date('01/01/2020')
    }];
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ locationId: 'id', speciesId: 'id', feedings: feedings, sex: 'M' } as any);
    spyOn(profileStoreService, 'findLocation').and.returnValue({} as any);
    spyOn(profileStoreService, 'findSpecies').and.returnValue({} as any);
    spyOn(profileStoreService, 'updateAnimal').and.returnValue(of({ locationId: 'id', speciesId: 'id', feedings: feedings, sex: 'M' } as any));
    spyOn(component, 'loadFeedings').and.callThrough();
    component.deleteFeeding({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.loadFeedings).toHaveBeenCalled();
  }));

});
