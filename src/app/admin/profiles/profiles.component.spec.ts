import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ProfileService } from '@app/core';
import { ProfilesComponent } from './profiles.component';

describe('ProfilesComponent', () => {
  let component: ProfilesComponent;
  let fixture: ComponentFixture<ProfilesComponent>;
  let profileService: ProfileService;
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
        NgxLoadingModule
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ ProfilesComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const account = {
      username: 'admin'
    };
    localStorage.setItem('account', JSON.stringify(account));
    fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    profileService = TestBed.get(ProfileService);
  });

  afterEach(() => {
    localStorage.removeItem('account');
  });

  it('should fail to load profiles due to count error', () => {
    spyOn(profileService, 'count').and.returnValue(throwError(new Error('Failed')));
    fixture.detectChanges();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to get profile count');
  });

  it('should fail to load profiles', () => {
    spyOn(profileService, 'count').and.returnValue(of(3));
    spyOn(profileService, 'find').and.returnValue(throwError(new Error('Failed')));
    fixture.detectChanges();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to find profiles');
  });

  it('should load profiles on init', () => {
    spyOn(profileService, 'count').and.returnValue(of(3));
    spyOn(profileService, 'find').and.returnValue(of([{}, {}, {}] as any));
    fixture.detectChanges();
    expect(component.alerts.length).toBe(0);
    expect(component.profiles.length).toBe(3);
  });

  it('should change page', () => {
    spyOn(profileService, 'count').and.returnValue(of(3));
    spyOn(profileService, 'find').and.returnValue(of([{}, {}, {}] as any));
    fixture.detectChanges();
    component.changePage(1);
    expect(component.page).toBe(1);
  });

  it('should search', () => {
    spyOn(profileService, 'count').and.returnValue(of(3));
    spyOn(profileService, 'find').and.returnValue(of([{}, {}, {}] as any));
    fixture.detectChanges();
    component.username.setValue('test');
    component.email.setValue('test');
    component.role.setValue('test');
    component.search();
    expect(component.alerts.length).toBe(0);
    expect(component.profiles.length).toBe(3);
  });

  it('should cancel delete', fakeAsync(() => {
    spyOn(profileService, 'delete').and.callThrough();
    spyOn(profileService, 'count').and.returnValue(of(3));
    spyOn(profileService, 'find').and.returnValue(of([{}, {}, {}] as any));
    fixture.detectChanges();
    component.delete({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileService.delete).not.toHaveBeenCalled();
  }));

  it('should fail to delete', fakeAsync(() => {
    spyOn(profileService, 'delete').and.returnValue(throwError(new Error('Failed')));
    spyOn(profileService, 'count').and.returnValue(of(3));
    spyOn(profileService, 'find').and.returnValue(of([{}, {}, {}] as any));
    fixture.detectChanges();
    component.delete({ username: 'test' } as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Failed to delete profile');
  }));

  it('should delete', fakeAsync(() => {
    spyOn(profileService, 'delete').and.returnValue(of({ username: 'test' } as any ));
    spyOn(profileService, 'count').and.returnValue(of(3));
    spyOn(profileService, 'find').and.returnValue(of([{}, {}, {}] as any));
    fixture.detectChanges();
    component.delete({ username: 'test' } as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Profile test deleted');
  }));

});
