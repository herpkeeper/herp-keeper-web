import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { LoginComponent } from './login.component';
import { AuthService } from '@app/core';

@Component({
  template: ''
})
class DummyComponent {
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent }
        ]),
        ReactiveFormsModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({})
      ],
      declarations: [ DummyComponent, LoginComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fail to log in', () => {
    spyOn(authService, 'authenticate').and.returnValue(throwError(new Error('Failed!')));
    fixture.detectChanges();
    expect(component.loginForm.valid).toBeFalsy();
    component.username.setValue('test');
    expect(component.loginForm.valid).toBeFalsy();
    component.password.setValue('password');
    expect(component.loginForm.valid).toBeTruthy();
    component.onSubmit();
    expect(component.alerts.length).toBe(1);
  });

  it('should log in', () => {
    spyOn(authService, 'authenticate').and.returnValue(of({} as any));
    fixture.detectChanges();
    expect(component.loginForm.valid).toBeFalsy();
    component.username.setValue('test');
    expect(component.loginForm.valid).toBeFalsy();
    component.password.setValue('password');
    expect(component.loginForm.valid).toBeTruthy();
    component.onSubmit();
    expect(component.alerts.length).toBe(0);
  });

});
