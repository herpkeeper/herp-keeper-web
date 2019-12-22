import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;
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
    service = TestBed.get(ImageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get', (done: DoneFn) => {
    service.get('id').subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/image/id');
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should delete', (done: DoneFn) => {
    service.delete({ _id: 'id' }).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/image/id');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should save', (done: DoneFn) => {
    service.save({} as any).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/image');
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should get data url', (done: DoneFn) => {
    service.getDataUrl('id').subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/image/id');
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

});
