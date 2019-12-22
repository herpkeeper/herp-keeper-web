import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { throwError, BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

import { Account } from '@app/shared';
import { AuthService } from '@app/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken = false;
  refreshSubject: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);

  constructor(private authService: AuthService) {
  }

  /**
   * Intercept requests and add auth headers. Refresh token if needed.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // First we add auth headers
    req = this.addAuthHeader(req);

    return next.handle(req).pipe(
      // Now catch any errors
      catchError(err => {
        // Any token error, logout
        if (req.url.endsWith('/token')) {
          this.authService.logout().subscribe();
          return EMPTY;
        } else {
          // Any 401 errors and we need to refresh token
          if (err.status === 401) {
            // Only refresh if we aren't already refreshing
            if (!this.isRefreshingToken) {
              this.isRefreshingToken = true;

              // Reset here so that the following requests will wait until
              // refresh is complete
              this.refreshSubject.next(null);

              // Refresh token
              return this.authService.refreshAccessToken().pipe(
                switchMap(account => {
                  this.refreshSubject.next(account);
                  req = this.addAuthHeader(req);
                  return next.handle(req);
                }),
                catchError(err2 => {
                  // Only logout if it's a 401, anything else is an acceptable error that
                  // needs to go back to client.
                  if (err2.status !== 401) {
                    return throwError(err2);
                  } else {
                    this.authService.logout().subscribe();
                    return EMPTY;
                  }
                }),
                finalize(() => {
                  this.isRefreshingToken = false;
                })
              );
            } else {
              // Wait until account is available then handle request
              return this.refreshSubject.pipe(
                filter(account => account != null),
                take(1),
                switchMap(token => {
                  req = this.addAuthHeader(req);
                  return next.handle(req);
                })
              );
            }
          }
        }
        return throwError(err);
      })
    );
  }

  /**
   * Add authorization header if not present.
   */
  addAuthHeader(req: HttpRequest<any>) {
    if (this.authService.isLoggedIn()) {
      const account: Account = this.authService.getAccount();
      return req.clone({setHeaders: {Authorization: `Bearer ${account.accessToken}`}});
    }
    return req;
  }

}
