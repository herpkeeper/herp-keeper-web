import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Credentials } from '@app/shared';
import { BaseComponent, AuthService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private titleService: TitleService) {
    super();
    this.createForm();
  }

  onSubmit() {
    this.alerts = [];
    this.loading = true;

    const credentials: Credentials = {
      username: this.username.value,
      password: this.password.value
    };

    this.authService.authenticate(credentials).subscribe(res => {
      this.loading = false;
      this.authService.navigateHome();
    }, err => {
      this.alerts.push({type: 'danger', message: 'Authentication failed!'});
      window.scrollTo(0, 0);
      this.loading = false;
    });
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Login');
  }

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }
}
