import { TestBed, async, inject } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { MemberAuthGuard } from './member-auth.guard';
import { AuthService } from '@app/core';

describe('MemberAuthGuard', () => {

  @Component({
    template: ''
  })
  class DummyComponent {
  }

  let guard: MemberAuthGuard;
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
          { path: '403', component: DummyComponent }
        ])
      ],
      declarations: [ DummyComponent ],
      providers: [MemberAuthGuard]
    });
    guard = TestBed.get(MemberAuthGuard);
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not load if not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate').and.callThrough();
    const res = guard.canLoad({ path: 'path' }, null);
    expect(res).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not load if invalid role', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'hasRole').and.returnValue(false);
    spyOn(router, 'navigate').and.callThrough();
    const res = guard.canLoad({ path: 'dashboard' }, null);
    expect(res).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/403']);
  });

  it('should load', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'hasRole').and.returnValue(true);
    spyOn(router, 'navigate').and.callThrough();
    const res = guard.canLoad({ path: 'dashboard' }, null);
    expect(res).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not activate if not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate').and.callThrough();
    const res = guard.canActivate(null, { url: '/path' } as any);
    expect(res).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not activate if invalid role', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'hasRole').and.returnValue(false);
    spyOn(router, 'navigate').and.callThrough();
    const res = guard.canActivate(null, { url: '/dashboard' } as any);
    expect(res).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/403']);
  });

  it('should not activate child if not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate').and.callThrough();
    const res = guard.canActivateChild(null, { url: '/path' } as any);
    expect(res).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
