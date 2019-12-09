import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  template: ''
})
class DummyComponent {
}

describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
          { path: 'member/dashboard', component: DummyComponent },
          { path: 'admin/dashboard', component: DummyComponent }
        ])
      ],
      declarations: [
        DummyComponent
      ]
    });
    service = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    localStorage.removeItem('account');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in', () => {
    let res = service.isLoggedIn();
    expect(res).toBeFalsy();
  });

  it('should be logged in', () => {
    const account = {
      username: 'user'
    };
    localStorage.setItem('account', JSON.stringify(account));
    const res = service.isLoggedIn();
    expect(res).toBeTruthy();
  });

  it('should not have role, not logged in', () => {
    const res = service.hasRole('role');
    expect(res).toBeFalsy();
  });

  it('should not have role', () => {
    const account = {
      username: 'user',
      role: 'member'
    };
    localStorage.setItem('account', JSON.stringify(account));
    const res = service.hasRole('admin');
    expect(res).toBeFalsy();
  });

  it('should have role', () => {
    const account = {
      username: 'user',
      role: 'member'
    };
    localStorage.setItem('account', JSON.stringify(account));
    const res = service.hasRole('member');
    expect(res).toBeTruthy();
  });

  it('should not get account', () => {
    const res = service.getAccount();
    expect(res).toBeFalsy();
  });

  it('should get account', () => {
    const spy = spyOn(localStorage, 'getItem').and.callThrough();
    const account = {
      username: 'user',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    let res = service.getAccount();
    expect(res).toBeTruthy();
    expect(spy.calls.count()).toBe(1);
    // Should still have only been called once
    res = service.getAccount();
    expect(res).toBeTruthy();
    expect(spy.calls.count()).toBe(1);
  });

  it('should get public context', () => {
    expect(service.getContext()).toEqual('public');
  });

  it('should get member context', () => {
    const account = {
      username: 'user',
      role: 'member'
    };
    localStorage.setItem('account', JSON.stringify(account));
    expect(service.getContext()).toEqual('member');
  });

  it('should get admin context', () => {
    const account = {
      username: 'user',
      role: 'admin'
    };
    localStorage.setItem('account', JSON.stringify(account));
    expect(service.getContext()).toEqual('admin');
  });

  it('should navigate home public', () => {
    spyOn(router, 'navigate').and.callThrough();
    service.navigateHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate home member', () => {
    spyOn(router, 'navigate').and.callThrough();
    const account = {
      username: 'user',
      role: 'member'
    };
    localStorage.setItem('account', JSON.stringify(account));
    service.navigateHome();
    expect(router.navigate).toHaveBeenCalledWith(['/member/dashboard']);
  });

  it('should navigate home admin', () => {
    spyOn(router, 'navigate').and.callThrough();
    const account = {
      username: 'user',
      role: 'admin'
    };
    localStorage.setItem('account', JSON.stringify(account));
    service.navigateHome();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

});
