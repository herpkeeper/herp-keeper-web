import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProfileResolverService } from './profile-resolver.service';
import { ProfileService } from './profile.service';
import { ProfileStoreService } from './profile-store.service';
import { AuthService } from '@app/core';

describe('ProfileResolverService', () => {
  let service: ProfileResolverService;
  let profileService: ProfileService;
  let profileStoreService: ProfileStoreService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
    service = TestBed.get(ProfileResolverService);
    profileService = TestBed.get(ProfileService);
    authService = TestBed.get(AuthService);
    profileStoreService = TestBed.get(ProfileStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve', (done: DoneFn) => {
    spyOn(authService, 'getAccount').and.returnValue({ _id: 'id' } as any);
    spyOn(profileService, 'getById').and.returnValue(of({} as any));
    service.resolve(null, null).subscribe(val => {
      expect(val).toBeTruthy();
      val.subscribe(v => {
        expect(v).toBeTruthy();
        done();
      });
    }, err => {
      fail('It should not fail');
    });
  });

  it('should resolve if profile already set', (done: DoneFn) => {
    spyOn(authService, 'getAccount').and.returnValue({ _id: 'id' } as any);
    profileStoreService.profile = {} as any;
    spyOn(profileService, 'getById').and.callThrough();
    service.resolve(null, null).subscribe(val => {
      expect(profileService.getById).not.toHaveBeenCalled();
      expect(val).toBeTruthy();
      val.subscribe(v => {
        expect(v).toBeTruthy();
        done();
      });
    }, err => {
      fail('It should not fail');
    });
  });

});
