import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { RegisterComponent } from './register.component';
import { RegisterService } from './register.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerService: RegisterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({})
      ],
      declarations: [ RegisterComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    registerService = TestBed.get(RegisterService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should validate form', () => {
    fixture.detectChanges();
    // Username is required
    expect(component.username.valid).toBeFalsy();
    component.username.setValue('test');
    expect(component.username.valid).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();

    // Name is required
    expect(component.name.valid).toBeFalsy();
    component.name.setValue('test');
    expect(component.name.valid).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();

    // Email is required
    expect(component.email.valid).toBeFalsy();
    component.email.setValue('test1@test.com');
    expect(component.email.valid).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();

    // Confirm email is required
    expect(component.confirmEmail.valid).toBeFalsy();
    component.confirmEmail.setValue('test2@test.com');
    expect(component.confirmEmail.valid).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();

    // Emails must match
    expect(component.emails.valid).toBeFalsy();
    component.email.setValue('test@test.com');
    component.confirmEmail.setValue('test@test.com');
    expect(component.emails.valid).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();

    // Password is required and must be strong or medium
    expect(component.password.valid).toBeFalsy();
    component.password.setValue('weak');
    expect(component.password.valid).toBeFalsy();
    component.password.setValue('!2%%lmsMslfs');
    expect(component.password.valid).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();

    // Confirm password is required
    expect(component.confirmPassword.valid).toBeFalsy();
    component.confirmPassword.setValue('test');
    expect(component.confirmPassword.valid).toBeTruthy();
    expect(component.registerForm.valid).toBeFalsy();

    // Passwords must match
    expect(component.passwords.valid).toBeFalsy();
    component.confirmPassword.setValue('!2%%lmsMslfs');
    expect(component.passwords.valid).toBeTruthy();

    // Form should be valid now
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should fail to submit', () => {
    spyOn(registerService, 'register').and.returnValue(throwError(new Error('Failed!')));
    fixture.detectChanges();
    component.username.setValue('test');
    component.name.setValue('test');
    component.email.setValue('test@test.com');
    component.confirmEmail.setValue('test@test.com');
    component.password.setValue('!2%%lmsMslfs');
    component.confirmPassword.setValue('!2%%lmsMslfs');
    component.onSubmit();
    expect(component.complete).toBeFalsy();
    expect(component.alerts.length).toBe(1);
  });

  it('should submit', () => {
    spyOn(registerService, 'register').and.returnValue(of(true));
    fixture.detectChanges();
    component.username.setValue('test');
    component.name.setValue('test');
    component.email.setValue('test@test.com');
    component.confirmEmail.setValue('test@test.com');
    component.password.setValue('!2%%lmsMslfs');
    component.confirmPassword.setValue('!2%%lmsMslfs');
    component.onSubmit();
    expect(component.complete).toBeTruthy();
    expect(component.alerts.length).toBe(0);
  });

});
