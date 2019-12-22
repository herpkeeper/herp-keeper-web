import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '@app/core';

describe('AuthInterceptor', () => {

  let authService: AuthService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }, AuthService]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem('account');
  });

  it('should not set auth headers if not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    httpClient.get('/api').subscribe(response => expect(response).toBeTruthy());
    const req = httpTestingController.expectOne('/api');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    req.flush({});
  });

  it('should add authorization headers if logged in and they are not already set', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'getAccount').and.returnValue({
      accessToken: 'access'
    } as any);
    httpClient.get('/api').subscribe(res => expect(res).toBeTruthy());
    const req = httpTestingController.expectOne('/api');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe('Bearer access');
    req.flush({});
  });

  it('should throw error', () => {
    const account = {
      username: 'user',
      accessToken: 'access',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    httpClient.get('/api').subscribe(res => {
    }, err => {
      expect(err).toBeTruthy();
      expect(err.status).toBe(403);
      expect(err.statusText).toBe('Error');
    });
    const req = httpTestingController.expectOne('/api');
    req.flush({}, { status: 403, statusText: 'Error' });
  });

  it('should fail due to refresh error', () => {
    const account = {
      username: 'user',
      accessToken: 'access',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    spyOn(authService, 'logout').and.returnValue(of(true));
    httpClient.get('/api').subscribe(res => {
    }, err => {
    }, () => {
    });
    const apiReq1 = httpTestingController.expectOne('/api');
    apiReq1.flush({}, { status: 401, statusText: 'Error' });
    const refreshReq = httpTestingController.expectOne('http://localhost:8080/api/token');
    refreshReq.flush({}, { status: 401, statusText: 'Error' });
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should fail due to subsequent error', () => {
    const account = {
      username: 'user',
      accessToken: 'access',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    spyOn(authService, 'logout').and.returnValue(of(true));
    httpClient.get('/api').subscribe(res => {
    }, err => {
    }, () => {
    });
    const apiReq1 = httpTestingController.expectOne('/api');
    apiReq1.flush({}, { status: 401, statusText: 'Error' });
    const refreshReq = httpTestingController.expectOne('http://localhost:8080/api/token');
    refreshReq.flush(account);
    const apiReq2 = httpTestingController.expectOne('/api');
    apiReq2.flush({}, { status: 401, statusText: 'Error' });
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should refresh and succeed', () => {
    const account = {
      username: 'user',
      accessToken: 'access',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newAccount = {
      username: 'user',
      accessToken: 'newaccess',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    httpClient.get('/api').subscribe(res => {
      expect(res).toBeTruthy();
    });
    const apiReq1 = httpTestingController.expectOne('/api');
    apiReq1.flush({}, { status: 401, statusText: 'Error' });
    expect(apiReq1.request.headers.has('Authorization')).toBeTruthy();
    expect(apiReq1.request.headers.get('Authorization')).toBe('Bearer access');
    const refreshReq = httpTestingController.expectOne('http://localhost:8080/api/token');
    refreshReq.flush(newAccount);
    const apiReq2 = httpTestingController.expectOne('/api');
    expect(apiReq2.request.headers.has('Authorization')).toBeTruthy();
    expect(apiReq2.request.headers.get('Authorization')).toBe('Bearer newaccess');
    apiReq2.flush({});
  });

  it('should refresh and succeed with a following error', () => {
    const account = {
      username: 'user',
      accessToken: 'access',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newAccount = {
      username: 'user',
      accessToken: 'newaccess',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    httpClient.get('/api').subscribe(res => {
      expect(res).toBeTruthy();
    }, err => {
      expect(err).toBeTruthy();
      expect(err.status).toBe(400);
      expect(err.statusText).toBe('Error');
    });
    const apiReq1 = httpTestingController.expectOne('/api');
    apiReq1.flush({}, { status: 401, statusText: 'Error' });
    expect(apiReq1.request.headers.has('Authorization')).toBeTruthy();
    expect(apiReq1.request.headers.get('Authorization')).toBe('Bearer access');
    const refreshReq = httpTestingController.expectOne('http://localhost:8080/api/token');
    refreshReq.flush(newAccount);
    const apiReq2 = httpTestingController.expectOne('/api');
    expect(apiReq2.request.headers.has('Authorization')).toBeTruthy();
    expect(apiReq2.request.headers.get('Authorization')).toBe('Bearer newaccess');
    apiReq2.flush({}, { status: 400, statusText: 'Error' });
  });

  it('should refresh and succeed with multiple requests', () => {
    const account = {
      username: 'user',
      accessToken: 'access',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const newAccount = {
      username: 'user',
      accessToken: 'newaccess',
      refreshToken: 'refresh',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem('account', JSON.stringify(account));
    httpClient.get('/api/1').subscribe(res => {
      expect(res).toBeTruthy();
    });
    httpClient.get('/api/2').subscribe(res => {
      expect(res).toBeTruthy();
    });
    const api1Req1 = httpTestingController.expectOne('/api/1');
    const api2Req1 = httpTestingController.expectOne('/api/2');
    api1Req1.flush({}, { status: 401, statusText: 'Error' });
    expect(api1Req1.request.headers.has('Authorization')).toBeTruthy();
    expect(api1Req1.request.headers.get('Authorization')).toBe('Bearer access');
    api2Req1.flush({}, { status: 401, statusText: 'Error' });
    expect(api2Req1.request.headers.has('Authorization')).toBeTruthy();
    expect(api2Req1.request.headers.get('Authorization')).toBe('Bearer access');
    const refreshReq = httpTestingController.expectOne('http://localhost:8080/api/token');
    refreshReq.flush(newAccount);
    const api1Req2 = httpTestingController.expectOne('/api/1');
    expect(api1Req2.request.headers.has('Authorization')).toBeTruthy();
    expect(api1Req2.request.headers.get('Authorization')).toBe('Bearer newaccess');
    api1Req2.flush({});
    const api2Req2 = httpTestingController.expectOne('/api/2');
    expect(api2Req2.request.headers.has('Authorization')).toBeTruthy();
    expect(api2Req2.request.headers.get('Authorization')).toBe('Bearer newaccess');
    api2Req2.flush({});
  });

});
