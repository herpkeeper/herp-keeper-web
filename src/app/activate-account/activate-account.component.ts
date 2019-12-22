import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService, BaseComponent, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent extends BaseComponent implements OnInit {

  complete = false;
  failed = false;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private titleService: TitleService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.titleService.setTitle('Activate Account');

    if (this.route.snapshot.queryParams.key
        && this.route.snapshot.queryParams.username) {
      const username = this.route.snapshot.queryParams.username;
      const key = this.route.snapshot.queryParams.key;
      this.authService.activateAccount(username, key).subscribe(res => {
        this.loading = false;
        this.complete = true;
        this.failed = false;
      }, err => {
        this.loading = false;
        this.complete = true;
        this.failed = true;
      });
    } else {
      this.loading = false;
      this.complete = true;
      this.failed = true;
    }
  }

}
