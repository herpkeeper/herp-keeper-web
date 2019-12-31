import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';

import { fader } from './animations';
import { AuthService, WsService } from '@app/core';

@Component({
  selector: 'herp-keeper-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fader
  ]
})
export class AppComponent implements OnDestroy, OnInit {

  constructor(private router: Router,
              private wsService: WsService,
              private authService: AuthService) {
  }

  ngOnDestroy() {
    this.wsService.stop();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if ((event.url === '/' || event.url === '/home') && this.authService.isLoggedIn()) {
          this.authService.navigateHome();
        }
      }
    });

    if (this.authService.isLoggedIn()) {
      this.wsService.start(this.authService.getAccount());
    }
  }

}
