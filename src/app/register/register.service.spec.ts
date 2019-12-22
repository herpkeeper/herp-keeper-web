import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { RegisterService } from './register.service';
import { Registration } from './registration';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.get(RegisterService);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register', () => {
    const registration: Registration = {
      username: 'username',
      name: 'name',
      password: 'testpassword',
      email: 'test@test.com'
    };
    const result = {
      _id: 'id',
      username: 'username',
      name: 'name',
      email: 'test@test.com',
      role: 'member'
    };
    service.register(registration).subscribe(
      res => {
        expect(res).toBeTruthy();
      }, (error: HttpErrorResponse) => {
        fail('Should not have failed');
      }
    );
    const req = httpTestingController.expectOne('http://localhost:8080/api/register');
    expect(req.request.method).toEqual('POST');
    req.flush(result);
  });

});
