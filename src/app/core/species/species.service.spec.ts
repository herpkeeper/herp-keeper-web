import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { SpeciesService } from './species.service';

describe('SpeciesService', () => {
  let service: SpeciesService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.get(SpeciesService);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get classes', () => {
    expect(service.classes).toBeTruthy();
  });

  it('should save', (done: DoneFn) => {
    service.save({} as any).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/species');
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should delete', (done: DoneFn) => {
    service.delete({ _id: 'id' } as any).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have failed');
    });
    const req = httpTestingController.expectOne('http://localhost:8080/api/species/id');
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should get amphibian orders', () => {
    const orders = service.getOrdersByClass('Amphibia');
    expect(orders.length).toEqual(3);
  });

  it('should get squamata suborders', () => {
    const subOrders = service.getSubOrdersByOrder('Squamata');
    expect(subOrders.length).toEqual(2);
  });

});
