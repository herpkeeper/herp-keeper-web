import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Profile } from '@app/shared';
import { BaseComponent, ProfileService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {

  editForm: FormGroup;
  showPassword: boolean;

  constructor(private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private profileService: ProfileService,
              private titleService: TitleService) {
    super();
    this.showPassword = true;
    this.createForm();
  }

  onSubmit() {
    this.alerts = [];

    // Build profile
    const profile: Profile = {
      username: this.username.value,
      name: this.name.value,
      email: this.email.value,
      role: this.role.value,
      active: this.active.value
    };

    if (this.password.value) {
      profile.password = this.password.value;
    }

    if (this.id.value) {
      profile._id = this.id.value;
    }

    this.loading = true;
    this.profileService.save(profile).subscribe(res => {
      this.loading = false;
      this.router.navigate(['/admin/profiles']);
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to save profile'});
      this.loading = false;
    });
  }

  createForm() {
    this.editForm = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['member', Validators.required],
      active: [true]
    });
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getById(this.activatedRoute.snapshot.params.id).subscribe(res => {
      this.titleService.setTitle(`Edit Profile ${res.username}`);
      this.id.setValue(res._id);
      this.username.setValue(res.username);
      this.username.disable();
      this.name.setValue(res.name);
      this.email.setValue(res.email);
      this.role.setValue(res.role);
      this.active.setValue(res.active);
      this.loading = false;
      this.password.setValidators(null);
      this.password.updateValueAndValidity();
      this.showPassword = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params.id) {
      this.loadProfile();
    } else {
      this.titleService.setTitle('New Profile');
    }
  }

  get id() { return this.editForm.get('id'); }

  get username() { return this.editForm.get('username'); }

  get name() { return this.editForm.get('name'); }

  get email() { return this.editForm.get('email'); }

  get password() { return this.editForm.get('password'); }

  get role() { return this.editForm.get('role'); }

  get active() { return this.editForm.get('active'); }

}
