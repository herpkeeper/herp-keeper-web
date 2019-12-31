import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { ProfileService } from '@app/core';
import { ProfileComponent } from './profile.component';

@Component({
  template: ''
})
class DummyComponent {
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let profileService: ProfileService;
  let activatedRoute;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'admin/profiles', component: DummyComponent }
        ]),
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule
      ],
      declarations: [ DummyComponent, ProfileComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    profileService = TestBed.get(ProfileService);
    router = TestBed.get(Router);
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.snapshot = {
      params: {
      }
    };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fail to load profile on init', () => {
    spyOn(profileService, 'getById').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.snapshot.params.id = 'id';
    fixture.detectChanges();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to load profile');
  });

  it('should load profile on init', () => {
    spyOn(profileService, 'getById').and.returnValue(of({
      _id: 'id',
      username: 'username',
      email: 'email',
      role: 'role',
      active: true
    } as any));
    activatedRoute.snapshot.params.id = 'id';
    fixture.detectChanges();
    expect(component.alerts.length).toBe(0);
    expect(component.id.value).toBe('id');
    expect(component.username.value).toBe('username');
    expect(component.email.value).toBe('email');
    expect(component.role.value).toBe('role');
    expect(component.active.value).toBeTruthy();
    expect(component.showPassword).toBeFalsy();
  });

  it('should fail to save', () => {
    spyOn(profileService, 'save').and.returnValue(throwError(new Error('Failed')));
    fixture.detectChanges();
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('Failed to save profile');
  });

  it('should save new', () => {
    spyOn(profileService, 'save').and.returnValue(of({} as any));
    spyOn(router, 'navigate').and.callThrough();
    fixture.detectChanges();
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should save existing, updating password', () => {
    spyOn(profileService, 'getById').and.returnValue(of({
      _id: 'id',
      username: 'username',
      email: 'email',
      role: 'role',
      active: true
    } as any));
    spyOn(profileService, 'save').and.returnValue(of({} as any));
    spyOn(router, 'navigate').and.callThrough();
    activatedRoute.snapshot.params.id = 'id';
    fixture.detectChanges();
    component.password.setValue('newpassword');
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalled();
  });

});
