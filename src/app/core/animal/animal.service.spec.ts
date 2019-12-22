import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AnimalService } from './animal.service';

describe('AnimalService', () => {
  let service: AnimalService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.get(AnimalService);
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
    service.save({} as any).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
      done();
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/animal');
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should save multi', (done: DoneFn) => {
    service.saveMulti([{}, {}] as any).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
      done();
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/animals');
    expect(req.request.method).toEqual('POST');
    req.flush([{}, {}]);
  });

  it('should delete', (done: DoneFn) => {
    service.delete({ _id: 'id' } as any).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
      done();
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/animal/id');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

});
