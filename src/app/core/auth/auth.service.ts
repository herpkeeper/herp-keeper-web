import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Account } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private account: Account;

  constructor(private router: Router) {
  }

  isLoggedIn(): boolean {
    return this.getAccount() ? true : false;
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
