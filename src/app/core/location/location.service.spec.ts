import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LocationService } from './location.service';

describe('LocationService', () => {

  let service: LocationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.get(LocationService);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save', (done: DoneFn) => {
    let location = {
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    };
    service.save(location).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/location');
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should delete', (done: DoneFn) => {
    let location = {
      _id: 'id',
      name: 'Name',
      geoLocation: {
        type: 'Point',
        coordinates: [0, 1]
      }
    };
    service.delete(location).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/location/id');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

});
