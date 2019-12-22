import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService, WsService } from '@app/core';

@Component({
  selector: 'herp-keeper-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  constructor(private wsService: WsService,
              private authService: AuthService) {
  }

  ngOnDestroy() {
    this.wsService.stop();
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.wsService.start(this.authService.getAccount());
      this.authService.navigateHome();
    }
  }

}
