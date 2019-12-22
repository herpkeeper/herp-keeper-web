import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: DummyComponent },
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
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    httpTestingController.verify();
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

  it('should authenticate', (done: DoneFn) => {
    const credentials = {
      username: 'user',
      password: 'pass'
    };
    service.authenticate(credentials).subscribe(
      res => {
        expect(res).toBeTruthy();
        expect(res.username).toBe('user');
        expect(res.name).toBe('Name');
        expect(res.email).toBe('test@test.com');
        expect(res.timestamp).toBeTruthy();
        expect(res.role).toBe('member');
        expect(res.accessToken).toBe('access');
        expect(res.refreshToken).toBe('refresh');
        expect(res.createdAt).toBeTruthy();
        expect(res.accessExpires).toBe(300);
        // Should now also be logged in
        done();
      }, (error: HttpErrorResponse) => {
        fail('Should not have failed');
      }
    );
    const req = httpTestingController.expectOne('http://localhost:8080/api/authenticate');
    expect(req.request.method).toEqual('POST');
    const account = {
      username: 'user',
      email: 'test@test.com',
      name: 'Name',
      role: 'member',
      accessToken: 'access',
      refreshToken: 'refresh',
      createdAt: new Date(),
      accessExpires: 300
    };
    req.flush(account);
  });

  it('should not attempt to logout if not logged in', () => {
    spyOn(router, 'navigate').and.callThrough();
    service.logout().subscribe(res => {
      expect(res).toBeFalsy();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  it('should logout without error', () => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
    const account = {
      username: 'user',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    service.logout().subscribe(res => {
      expect(res).toBeTruthy();
      expect(localStorage.removeItem).toHaveBeenCalled();
    }, err => {
    }).add(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/logout');
    expect(req.request.method).toEqual('POST');
    req.flush({ result: true });
  });

  it('should logout with error', () => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
    const account = {
      username: 'user',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    service.logout().subscribe(res => {
      expect(res).toBeFalsy();
      expect(localStorage.removeItem).toHaveBeenCalled();
    }, err => {
    }).add(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/logout');
    expect(req.request.method).toEqual('POST');
    req.flush(new Error('Failed'), { status: 403, statusText: 'Forbidden' });
  });

  it('should fail to refresh token if not logged in', () => {
    service.refreshAccessToken().subscribe(res => {
      fail('Should not have succeeded');
    }, err => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('Not logged in');
    });
  });

  it('should refresh access token', (done: DoneFn) => {
    const account = {
      username: 'user',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    service.refreshAccessToken().subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/token');
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should activate account', (done: DoneFn) => {
    service.activateAccount('user', 'key').subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/activate-account?username=user&key=key');
    expect(req.request.method).toEqual('GET');
    req.flush({ result: true });
  });

});
