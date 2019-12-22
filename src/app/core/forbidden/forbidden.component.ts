import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { TitleService } from '../title/title.service';

@Component({
  selector: 'herp-keeper-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {

  constructor(private authService: AuthService,
              private titleService: TitleService) {
  }

  navigateHome() {
    this.authService.navigateHome();
  }

  ngOnInit() {
    this.titleService.setTitle('Forbidden');
  }

}
