import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import * as owasp from 'owasp-password-strength-test';

import * as cloneDeep from 'lodash/cloneDeep';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { BaseComponent, ProfileStoreService, TitleService } from '@app/core';
import { Profile } from '@app/shared';

@Component({
  selector: 'herp-keeper-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseComponent implements OnInit {

  profile$: Observable<Profile>;
  settingsForm: FormGroup;
  foodTypesArray: FormArray;
  addFoodTypeForm: FormGroup;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private profileStoreService: ProfileStoreService,
              private titleService: TitleService) {
    super();
    owasp.config({
      allowPassphrases       : true,
      maxLength              : 128,
      minLength              : 8,
      minPhraseLength        : 20,
      minOptionalTestsToPass : 4,
    });
    this.createForms();
  }

  onSubmit() {
    const profile = cloneDeep(this.profileStoreService.profile);

    profile.name = this.name.value;
    profile.email = this.email.value;

    // Set food types
    profile.foodTypes = [];
    for (let i = 0; i < this.foodTypesArray.length; i++) {
      profile.foodTypes.push(this.foodTypesArray.at(i).value);
    }

    // Set password if we want to change it
    if (this.password.value) {
      profile.password = this.password.value;
    }

    this.alerts = [];
    this.loading = true;
    this.profileStoreService.updateProfile(profile).subscribe(res => {
      this.loadForm();
      this.alerts.push({type: 'success', message: 'Settings saved'});
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to update profile'});
      this.loading = false;
    });
  }

  addFoodType(modal) {
    this.addFoodTypeForm.get('type').setValue('');
    this.modalService.open(modal).result.then((res) => {
      this.foodTypesArray.push(new FormControl(res));
    }).catch((err) => {
    });
  }

  addFoodTypeModalSubmit(modal) {
    modal.close(this.addFoodTypeForm.get('type').value);
  }

  removeFoodType(index) {
    this.foodTypesArray.removeAt(index);
  }

  createForms() {
    this.foodTypesArray = new FormArray([]);

    this.settingsForm = this.fb.group({
      name: ['', Validators.required ],
      email: ['', Validators.required ],
      passwords: this.fb.group({
        password: ['', control => this.checkPasswordStrength(control)],
        confirmPassword: ['']
      }, { validator: this.passwordConfirming }),
      foodTypes: this.foodTypesArray
    });

    this.addFoodTypeForm = this.fb.group({
      type: ['', Validators.required]
    });
  }

  loadForm() {
    const profile = this.profileStoreService.profile;

    this.name.setValue(profile.name);
    this.email.setValue(profile.email);
    this.password.setValue('');
    this.confirmPassword.setValue('');

    this.foodTypesArray.clear();
    if (profile.foodTypes) {
      profile.foodTypes.forEach(t => this.foodTypesArray.push(new FormControl(t)));
    }
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value) {
      if (c.get('password').value !== c.get('confirmPassword').value) {
        return { invalid: true };
      }
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
    } else {
      isValid = true;
    }
    return isValid ? null : error;
  }

  ngOnInit() {
    this.titleService.setTitle('Settings');
    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      this.loadForm();
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

  get name() { return this.settingsForm.get('name'); }

  get email() { return this.settingsForm.get('email'); }

  get passwords() { return this.settingsForm.get('passwords'); }

  get password() { return this.settingsForm.get('passwords').get('password'); }

  get confirmPassword() { return this.settingsForm.get('passwords').get('confirmPassword'); }

}
