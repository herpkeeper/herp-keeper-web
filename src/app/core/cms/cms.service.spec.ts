import { TestBed } from '@angular/core/testing';

import { CmsService } from './cms.service';

describe('CmsService', () => {
  let service: CmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(CmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get queries', (done: DoneFn) => {
    const query = {
      'content_type': 'post'
    };
    spyOn(service.client, 'getEntries').and.callFake(() => Promise.resolve({} as any));
    service.getEntries(query).subscribe(res => {
      expect(res).toBeTruthy();
      done();
    }, err => {
      fail('Should not have have failed');
      done();
    });
  });

});
