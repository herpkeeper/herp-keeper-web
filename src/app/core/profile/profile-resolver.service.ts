import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Profile } from '@app/shared';
import { ProfileService } from './profile.service';
import { ProfileStoreService } from './profile-store.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService implements Resolve<Observable<Observable<boolean>>> {

  constructor(private profileService: ProfileService,
              private profileStoreService: ProfileStoreService,
              private authService: AuthService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Observable<boolean>> {
    const id = this.authService.getAccount()._id;
    if (this.profileStoreService.profile) {
      return of(of(true));
    } else {
      return of(this.profileService.getById(id).pipe(
        map(v => {
          this.profileStoreService.profile = v;
          return true;
        })
      ));
    }
  }

}
