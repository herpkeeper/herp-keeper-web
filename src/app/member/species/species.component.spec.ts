import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError} from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ProfileStoreService } from '@app/core';
import { SpeciesComponent } from './species.component';

describe('SpeciesComponent', () => {
  let component: SpeciesComponent;
  let fixture: ComponentFixture<SpeciesComponent>;
  let activatedRoute;
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
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({})
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ SpeciesComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    profileStoreService = TestBed.get(ProfileStoreService);
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.snapshot = {
      params: {
      }
    };
    fixture = TestBed.createComponent(SpeciesComponent);
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

  it('should load species on init', () => {
    spyOn(profileStoreService, 'findSpecies').and.returnValue({
      _id: 'id',
      commonName: 'Common Name'
    });
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
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
    modalResolve(['id']);
    fixture.detectChanges();
    tick();
    expect(component.imageId.value).toBe('id');
  }));

  it('should remove image', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.imageId.setValue('id');
    expect(component.imageId.value).toBe('id');
    component.removeImage();
    expect(component.imageId.value).toBeFalsy();
  });

  it('should submit and fail to add new', () => {
    spyOn(profileStoreService, 'addSpecies').and.returnValue(throwError(new Error('failed')));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.commonName.setValue('Common Name');
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to save species');
  });

  it('should submit and add new', () => {
    spyOn(profileStoreService, 'addSpecies').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.commonName.setValue('Common Name');
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Species successfully added');
  });

  it('should submit and fail to update', () => {
    spyOn(profileStoreService, 'findSpecies').and.returnValue({
      _id: 'id',
      commonName: 'Common Name'
    });
    spyOn(profileStoreService, 'updateSpecies').and.returnValue(throwError(new Error('failed')));
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to save species');
  });

  it('should submit and update', () => {
    spyOn(profileStoreService, 'findSpecies').and.returnValue({
      _id: 'id',
      commonName: 'Common Name'
    });
    spyOn(profileStoreService, 'updateSpecies').and.returnValue(of({} as any));
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Species successfully updated');
  });

  it('should change class', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.class.setValue('Reptilia');
    component.changeClass();
    expect(component.orders.length).toEqual(3);
  });

  it('should change order', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.order.setValue('Squamata');
    component.changeOrder();
    expect(component.subOrders.length).toEqual(2);
  });

});
