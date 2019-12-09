import { TestBed } from '@angular/core/testing';

import { TitleService } from './title.service';

describe('TitleService', () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set new title', () => {
    service.setTitle('Test');
    expect(service.getTitle()).toBe('Herp Keeper - Test');
  });

});
