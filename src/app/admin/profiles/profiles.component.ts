import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent, Profile } from '@app/shared';
import { AuthService, BaseComponent, ProfileService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent extends BaseComponent implements OnInit {

  myUsername: string;
  numResults = 0;
  page = 1;
  pageSize = 10;
  profiles: Array<Profile>;
  searchForm: FormGroup;

  constructor(private fb: FormBuilder,
              private modalService: NgbModal,
              private authService: AuthService,
              private profileService: ProfileService,
              private titleService: TitleService) {
    super();
    this.createForm();
    this.myUsername = this.authService.getAccount().username;
  }

  delete(profile: Profile) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = `Delete ${profile.username}?`;
    modalRef.componentInstance.body = 'Are you sure you want to delete this profile?';

    modalRef.result.then((res) => {
      this.alerts = [];
      this.loading = true;
      this.profileService.delete(profile).subscribe(r => {
        this.alerts.push({ type: 'success', message: `Profile ${profile.username} deleted` });
        this.loading = false;
        this.search();
      }, err => {
        this.alerts.push({ type: 'danger', message: 'Failed to delete profile' });
        this.loading = false;
      });
    }).catch((err) => {
    });
  }

  createForm() {
    this.searchForm = this.fb.group({
      username: [''],
      email: [''],
      role: ['']
    });
  }

  search() {
    // Build query
    const query = {
    } as any;

    if (this.username.value) {
      query.username = this.username.value;
    }

    if (this.email.value) {
      query.email = this.email.value;
    }

    if (this.role.value) {
      query.role = this.role.value;
    }

    this.load(query);
  }

  load(query: any) {
    this.loading = true;

    this.profileService.count().subscribe(count => {
      this.numResults = count;
      this.profileService.find(query, this.pageSize, (this.page - 1) * this.pageSize).subscribe(res => {
        this.profiles = res;
        this.loading = false;
      }, err => {
        this.alerts.push({ type: 'danger', message: 'Failed to find profiles' });
        this.loading = false;
      });
    }, err => {
      this.alerts.push({ type: 'danger', message: 'Failed to get profile count' });
      this.loading = false;
    });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.search();
  }

  ngOnInit() {
    this.titleService.setTitle('Profiles');
    this.search();
  }

  get username() { return this.searchForm.get('username'); }

  get email() { return this.searchForm.get('email'); }

  get role() { return this.searchForm.get('role'); }

}
