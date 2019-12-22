import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import * as owasp from 'owasp-password-strength-test';

import { RegisterService } from './register.service';
import { Registration } from './registration';
import { BaseComponent, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  registerForm: FormGroup;
  complete = false;

  constructor(private fb: FormBuilder,
              private registerService: RegisterService,
              private titleService: TitleService) {
    super();
    owasp.config({
      allowPassphrases       : true,
      maxLength              : 128,
      minLength              : 8,
      minPhraseLength        : 20,
      minOptionalTestsToPass : 4,
    });
    this.createForm();
  }

  onSubmit() {
    this.loading = true;
    this.alerts = [];
    const registration: Registration = {
      username: this.username.value,
      name: this.name.value,
      email: this.email.value,
      password: this.password.value
    };
    this.registerService.register(registration).subscribe(res => {
      this.complete = true;
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Registration failed. Please verify your information, or try another username.'});
      window.scrollTo(0, 0);
      this.loading = false;
    });
  }

  createForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      emails: this.fb.group({
        email: ['', Validators.required],
        confirmEmail: ['', Validators.required]
      }, { validator: this.emailConfirming }),
      passwords: this.fb.group({
        password: ['', Validators.compose([Validators.required, control => this.checkPasswordStrength(control)]) ],
        confirmPassword: ['', Validators.required ]
      }, { validator: this.passwordConfirming })
    });
  }

  emailConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('email').value !== c.get('confirmEmail').value) {
      return { invalid: true };
    }
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    }
  }

  checkPasswordStrength(c: AbstractControl): ValidationErrors {
    let isValid = false;
    const error = {
      strength: {
        errors: []
      }
    };
    if (c.value) {
      const testRes = owasp.test(this.password.value);
      if (testRes.strong) {
        isValid = true;
      } else {
        isValid = false;
        error.strength.errors = testRes.errors;
      }
    }
    return isValid ? null : error;
  }

  ngOnInit() {
    this.titleService.setTitle('Register');
  }

  get username() { return this.registerForm.get('username'); }

  get name() { return this.registerForm.get('name'); }

  get emails() { return this.registerForm.get('emails'); }

  get email() { return this.registerForm.get('emails').get('email'); }

  get confirmEmail() { return this.registerForm.get('emails').get('confirmEmail'); }

  get passwords() { return this.registerForm.get('passwords'); }

  get password() { return this.registerForm.get('passwords').get('password'); }

  get confirmPassword() { return this.registerForm.get('passwords').get('confirmPassword'); }

}
