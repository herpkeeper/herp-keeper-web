import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ProfileService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save', (done: DoneFn) => {
    service.save({} as any).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/profile');
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should get count', (done: DoneFn) => {
    service.count().subscribe(res => {
      expect(res).toBe(2);
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/profile/count');
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should get count with query', (done: DoneFn) => {
    service.count({ email: 'email', username: 'username' }).subscribe(res => {
      expect(res).toBe(2);
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/profile/count?email=email&username=username');
    expect(req.request.method).toEqual('GET');
    req.flush({ count: 2 });
  });

  it('should find', (done: DoneFn) => {
    service.find().subscribe(res => {
      expect(res.length).toBe(3);
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/profile?limit=0&skip=0');
    expect(req.request.method).toEqual('GET');
    req.flush([{}, {}, {}]);
  });

  it('should find with limit, skip, and query', (done: DoneFn) => {
    service.find({ email: 'email', username: 'username' }, 2, 1).subscribe(res => {
      expect(res.length).toBe(2);
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/profile?limit=2&skip=1&email=email&username=username');
    expect(req.request.method).toEqual('GET');
    req.flush([{}, {}]);
  });

  it('should get by id', (done: DoneFn) => {
    service.getById('id').subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/profile/id');
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

});
