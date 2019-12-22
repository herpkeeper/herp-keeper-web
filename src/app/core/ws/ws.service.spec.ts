import { TestBed } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProfileService } from '../profile/profile.service';
import { ProfileStoreService } from '../profile/profile-store.service';
import { WsService } from './ws.service';

describe('WsService', () => {
  let service: WsService;
  let profileService: ProfileService;
  let profileStoreService: ProfileStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.get(WsService);
    profileService = TestBed.get(ProfileService);
    profileStoreService = TestBed.get(ProfileStoreService);
    profileStoreService.profile = { _id: 'id' } as any;
  });

  afterEach(() => {
    service.stop();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create websocket', () => {
    const res = service.createWebSocket();
    expect(res).toBeTruthy();
  });

  it('fail to start due to exception', () => {
    let wsSubject = new Subject<any>();
    const spy = spyOn(service, 'createWebSocket').and.throwError('failed');
    service.start({ accessToken: 'token' } as any);
  });

  it('should fail to start due to error', () => {
    let wsSubject = new Subject<any>();
    const spy = spyOn(service, 'createWebSocket').and.returnValue(wsSubject as any);
    wsSubject.error('error');
    service.start({ accessToken: 'token' } as any);
  });

  it('should start', () => {
    let wsSubject = new Subject<any>();
    const spy = spyOn(service, 'createWebSocket').and.returnValue(wsSubject as any);
    service.start({ accessToken: 'token' } as any);
    service.start({ accessToken: 'token' } as any);
  });


  it('should handle error event', () => {
    let wsSubject = new Subject<any>();
    const spy = spyOn(service, 'createWebSocket').and.returnValue(wsSubject as any);
    spyOn(service, 'stop').and.callThrough();
    service.start({ accessToken: 'token' } as any);
    wsSubject.next({ type: 'error', payload: {}});
    expect(service.stop).toHaveBeenCalled();
  });

  it('should handle profile_updated event and fail', () => {
    spyOn(profileService, 'getById').and.returnValue(throwError(new Error('failed')));
    let wsSubject = new Subject<any>();
    const spy = spyOn(service, 'createWebSocket').and.returnValue(wsSubject as any);
    service.start({ accessToken: 'token' } as any);
    wsSubject.next({ type: 'profile_updated', payload: {}});
  });

  it('should handle profile_updated event', () => {
    spyOn(profileService, 'getById').and.returnValue(of({} as any ));
    let wsSubject = new Subject<any>();
    const spy = spyOn(service, 'createWebSocket').and.returnValue(wsSubject as any);
    service.start({ accessToken: 'token' } as any);
    wsSubject.next({ type: 'profile_updated', payload: {}});
    wsSubject.complete();
    expect(profileService.getById).toHaveBeenCalled();
  });

});
