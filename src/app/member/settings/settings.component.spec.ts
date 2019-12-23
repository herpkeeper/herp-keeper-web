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
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
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
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({})
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ SettingsComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    profileStoreService = TestBed.get(ProfileStoreService);
    profileStoreService.profile = {
    } as any;
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.snapshot = {
      params: {
      }
    };
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
  });

  it('should fail to load profile on init', () => {
    activatedRoute.data = of({ loading: throwError(new Error('Failed')) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(1);
  });

  it('should load profile on init', () => {
    profileStoreService.profile.foodTypes = [ 'type1' ];
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
  });

  it('should cancel add food type', fakeAsync(() => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.addFoodType({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(component.foodTypesArray.length).toEqual(0);
  }));

  it('should add food type', fakeAsync(() => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.addFoodType({} as any);
    modalResolve('type1');
    fixture.detectChanges();
    tick();
    expect(component.foodTypesArray.length).toEqual(1);
  }));

  it('should remove food type', () => {
    profileStoreService.profile.foodTypes = [ 'type1' ];
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component.foodTypesArray.length).toEqual(1);
    component.removeFoodType(0);
    expect(component.foodTypesArray.length).toEqual(0);
  });

  it('should submit food type', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.addFoodTypeModalSubmit({ close: () => {}} as any);
  });

  it('should validate password', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component.password.valid).toBeTruthy();
    component.password.setValue('weak');
    expect(component.password.valid).toBeFalsy();
    component.password.setValue('!2%%lmsMslfs');
    expect(component.password.valid).toBeTruthy();
  });

  it('should validate confirm password', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component.passwords.valid).toBeTruthy();
    component.password.setValue('!2%%lmsMslfs');
    expect(component.passwords.valid).toBeFalsy();
    component.confirmPassword.setValue('!2%%lmsMslfs');
    expect(component.passwords.valid).toBeTruthy();
  });

  it('should fail to submit', () => {
    spyOn(profileStoreService, 'updateProfile').and.returnValue(throwError('Failed'));
    profileStoreService.profile.foodTypes = [ 'type1' ];
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to update profile');
  });

  it('should submit', () => {
    spyOn(profileStoreService, 'updateProfile').and.returnValue(of({} as any));
    profileStoreService.profile.foodTypes = [ 'type1' ];
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.password.setValue('test');
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Settings saved');
  });

});
