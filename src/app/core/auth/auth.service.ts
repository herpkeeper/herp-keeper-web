import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { of, throwError, Observable } from 'rxjs';
import { tap, map, finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Account, BooleanResult, Credentials } from '@app/shared';
import { LogoutRequest } from './logout-request';
import { TokenRequest } from './token-request';
import { WsService } from '../ws/ws.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private account: Account;

  constructor(private http: HttpClient,
              private router: Router,
              private wsService: WsService) {
  }

  isLoggedIn(): boolean {
    return this.getAccount() ? true : false;
  }

  authenticate(credentials: Credentials): Observable<Account> {
    const url = `${environment.apiUrl}/authenticate`;

    return this.http.post<Account>(url, credentials).pipe(
      map(v => {
        this.account = v;
        this.account.timestamp = new Date();
        localStorage.setItem('account', JSON.stringify(this.account));
        this.wsService.start(this.account);
        return this.account;
      })
    );
  }

  logout(): Observable<boolean> {
    const url = `${environment.apiUrl}/logout`;

    if (this.isLoggedIn()) {
      this.wsService.stop();
      const logoutRequest: LogoutRequest = {
        username: this.account.username,
        refreshToken: this.account.refreshToken
      };
      this.account = null;
      localStorage.removeItem('account');
      return this.http.post<BooleanResult>(url, logoutRequest).pipe(
        map(v => v.result),
        finalize(() => {
          this.router.navigate(['/home']);
        })
      );
    } else {
      return of(false);
    }
  }

  activateAccount(username: string, key: string): Observable<boolean> {
    const url = `${environment.apiUrl}/activate-account`;

    const options = {
      params: new HttpParams()
        .append('username', username)
        .append('key', key)
    };

    return this.http.get<BooleanResult>(url, options).pipe(
      map(v => v.result)
    );
  }

  refreshAccessToken(): Observable<Account> {
    const url = `${environment.apiUrl}/token`;

    if (this.isLoggedIn()) {
      const tokenRequest: TokenRequest = {
        username: this.account.username,
        refreshToken: this.account.refreshToken
      };
      return this.http.post<Account>(url, tokenRequest).pipe(
        map(v => {
          this.account = v;
          this.account.timestamp = new Date();
          localStorage.setItem('account', JSON.stringify(this.account));
          return this.account;
        })
      );
    } else {
      return throwError(new Error('Not logged in'));
    }
  }

  navigateHome() {
    if (this.getContext() === this.MEMBER) {
      this.router.navigate(['/member/dashboard']);
    } else if (this.getContext() === this.ADMIN) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  getContext(): string {
    if (this.hasRole('member')) {
      return this.MEMBER;
    } else if (this.hasRole('admin')) {
      return this.ADMIN;
    } else {
      return this.PUBLIC;
    }
  }

  hasRole(role: string): boolean {
    if (this.isLoggedIn()) {
      return this.account.role === role;
    }
    return false;
  }

  getAccount(): Account {
    if (!this.account) {
      this.account = JSON.parse(localStorage.getItem('account'), (key, value) => {
        if (key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
    }
    return this.account;
  }

  get PUBLIC() { return 'public'; }

  get MEMBER() { return 'member'; }

  get ADMIN() { return 'admin'; }

}
