import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class MemberAuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  private checkRole(): boolean {
    if (this.authService.hasRole('member')) {
      return true;
    }

    this.router.navigate(['/403']);

    return false;
  }

  private checkLoggedIn(): boolean {
    if (this.authService.isLoggedIn()) {
      return this.checkRole();
    }

    this.router.navigate(['/login']);

    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLoggedIn();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLoggedIn();
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.checkLoggedIn();
  }

}
