import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'herp-keeper-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  isCollapsed = true;

  constructor(private authService: AuthService) {
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  dropdownClick(event: any) {
    event.preventDefault();
  }

  ngOnInit() {
  }

}
