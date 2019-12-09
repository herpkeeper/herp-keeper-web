import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { TitleService } from '../title/title.service';

@Component({
  selector: 'herp-keeper-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private authService: AuthService,
              private titleService: TitleService) {
  }

  navigateHome() {
    this.authService.navigateHome();
  }

  ngOnInit() {
    this.titleService.setTitle('Not Found');
  }

}
