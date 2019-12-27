import { Component } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError} from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ProfileStoreService } from '@app/core';
import { AnimalEditComponent } from './animal-edit.component';

describe('AnimalEditComponent', () => {
  @Component({
    template: ''
  })
  class DummyComponent {
  }

  let component: AnimalEditComponent;
  let fixture: ComponentFixture<AnimalEditComponent>;
  let profileStoreService: ProfileStoreService;
  let router: Router;
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
        RouterTestingModule.withRoutes([
          { path: 'member/animal/:id', component: DummyComponent },
          { path: 'member/animals', component: DummyComponent }
        ]),
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({})
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ DummyComponent, AnimalEditComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalEditComponent);
    profileStoreService = TestBed.get(ProfileStoreService);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.profile = { locations: [] } as any;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load form on init if animal id set', () => {
    spyOn(component, 'loadForm').and.callThrough();
    spyOn(profileStoreService, 'findAnimal').and.returnValue({images: []} as any);
    component.animalId = 'id';
    component.profile ={ locations: [] } as any;
    fixture.detectChanges();
    expect(component.loadForm).toHaveBeenCalled();
  });

  it('should fail to add animal', () => {
    spyOn(profileStoreService, 'addAnimal').and.returnValue(throwError(new Error('Failed')));
    spyOn(component.alerts, 'emit').and.callThrough();
    component.profile = { locations: [] } as any;
    fixture.detectChanges();
    component.onSubmit();
    expect(component.alerts.emit).toHaveBeenCalled();
  });

  it('should add animal', () => {
    spyOn(profileStoreService, 'addAnimal').and.returnValue(of({ _id: 'id' } as any));
    spyOn(router, 'navigate').and.callThrough();
    component.profile = { locations: [] } as any;
    fixture.detectChanges();
    component.preferredFood.setValue('type');
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should fail to add animal', () => {
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ _id: 'id', images: []} as any);
    spyOn(profileStoreService, 'updateAnimal').and.returnValue(throwError(new Error('Failed')));
    spyOn(component.alerts, 'emit').and.callThrough();
    component.animalId = 'id';
    component.profile ={ locations: [] } as any;
    fixture.detectChanges();
    component.onSubmit();
    expect(component.alerts.emit).toHaveBeenCalled();
  });

  it('should update animal', () => {
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ _id: 'id', images: [], birthDate: new Date(), acquisitionDate: new Date() } as any);
    spyOn(profileStoreService, 'updateAnimal').and.returnValue(of({ _id: 'id', birthDate: new Date(), acquisitionDate: new Date() } as any));
    spyOn(component.edit, 'emit').and.callThrough();
    component.animalId = 'id';
    component.profile ={ locations: [] } as any;
    fixture.detectChanges();
    component.onSubmit();
    expect(component.edit.emit).toHaveBeenCalled();
  });

  it('should cancel existing animal', () => {
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ _id: 'id', images: []} as any);
    spyOn(component.edit, 'emit').and.callThrough();
    component.animalId = 'id';
    component.profile = { locations: [] } as any;
    fixture.detectChanges();
    component.cancel();
    expect(component.edit.emit).toHaveBeenCalled();
  });

  it('should cancel new animal', () => {
    spyOn(router, 'navigate').and.callThrough();
    component.profile = { locations: [] } as any;
    fixture.detectChanges();
    component.cancel();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should cancel add images', fakeAsync(() => {
    component.profile = { locations: [] } as any;
    fixture.detectChanges();
    component.addImages();
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(component.images.length).toEqual(0);
  }));

  it('should add images', fakeAsync(() => {
    component.animalId = 'id';
    component.profile = { _id: 'id', locations: [], images: [ { imageId: 'id1' } ] } as any;
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ _id: 'id', locations: [], images: [ { imageId: 'id1' } ] } as any);
    fixture.detectChanges();
    component.addImages();
    modalResolve([ 'id1', 'id2' ]);
    fixture.detectChanges();
    tick();
    expect(component.images.length).toEqual(2);
  }));

  it('should remove image', () => {
    component.animalId = 'id';
    component.profile = { _id: 'id', locations: [], images: [ { imageId: 'id1' } ] } as any;
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ _id: 'id', locations: [], images: [ { imageId: 'id1' } ] } as any);
    fixture.detectChanges();
    component.removeImage({ imageId: 'id1' });
    expect(component.images.length).toEqual(0);
  });

  it('should set default image', () => {
    component.animalId = 'id';
    component.profile = { _id: 'id', locations: [], images: [ { imageId: 'id1' }, { imageId: 'id2' } ] } as any;
    spyOn(profileStoreService, 'findAnimal').and.returnValue({ _id: 'id', locations: [], images: [ { imageId: 'id1' }, { imageId: 'id2' } ] } as any);
    fixture.detectChanges();
    component.setDefaultImage({ imageId: 'id1' });
    expect(component.images[0].default).toBeTruthy();
    expect(component.images[1].default).toBeFalsy();
  });

});
