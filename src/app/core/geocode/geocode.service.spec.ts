import { TestBed } from '@angular/core/testing';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';

import { GeocodeService } from './geocode.service';

describe('GeocodeService', () => {
  let service: GeocodeService;
  let loader;

  beforeEach(() => {
    loader = {
      load: () => {
        return Promise.resolve();
      }
    };

    (window as any).google = {
      maps: {
        Geocoder: class Geocoder {
          geocode(request, cb) {
            if (request.address === 'bad') {
              cb(null, 'INVALID_REQUEST');
            } else {
              cb({}, 'OK');
            }
          }

          consructor() {
          }
        },
        GeocoderStatus: {
          OK: 'OK'
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [
        AgmCoreModule.forRoot({
        })
      ],
      providers: [
        { provide: MapsAPILoader, useValue: loader },
      ]
    });
    service = TestBed.get(GeocodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fail to geocode address', (done: DoneFn) => {
    service.geocodeAddress('bad').subscribe(res => {
      fail('It should not have succeeded');
      done();
    }, err => {
      expect(err).toBeTruthy();
      done();
    });
  });

  it('should geocode address', (done: DoneFn) => {
    service.geocodeAddress('test').subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('It should not have failed');
      done();
    });
  });

  it('should reverse geocode', (done: DoneFn) => {
    service.reverseGeocode(0, 1).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('It should not have failed');
      done();
    });
  });

});
