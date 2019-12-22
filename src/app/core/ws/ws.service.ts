import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, tap, retryWhen } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { environment } from '@env/environment';
import { Account } from '@app/shared';
import { ProfileService } from '../profile/profile.service';
import { ProfileStoreService } from '../profile/profile-store.service';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  private wsSubject: any;

  constructor(private profileService: ProfileService,
              private profileStoreService: ProfileStoreService) {

  }

  handleEvent(evt) {
    if (evt.type === 'error') {
      this.stop();
    } else if (evt.type === 'profile_updated') {
      const profileId = this.profileStoreService.profile._id;
      this.profileService.getById(profileId).subscribe(res => {
        this.profileStoreService.notifyUpdate(res);
      }, err => {
        console.log('Failed to get profile');
        console.log(err);
      });
    }
  }

  createWebSocket(): WebSocketSubject<any> {
    const url = environment.websocketUrl;
    const subject = webSocket({ url });
    return subject;
  }

  stop() {
    if (this.wsSubject) {
      this.wsSubject.unsubscribe();
      this.wsSubject = null;
    }
  }

  start(account: Account) {
    if (!this.wsSubject) {
      const createWebSocket = () => {
        return new Observable(observer => {
          try {
            this.wsSubject = this.createWebSocket();
            const sub = this.wsSubject.asObservable().subscribe(data => {
              observer.next(data);
            }, err => {
              observer.error(err);
            }, () => {
              observer.complete();
            });
            this.wsSubject.next({ type: 'authenticate', payload: account.accessToken });
            return () => {
              if (!sub.closed) {
                sub.unsubscribe();
              }
            };
          } catch (err) {
            console.log('Error caught creating web socket');
            observer.error(err);
          }
        });
      };

      createWebSocket().pipe(
        retryWhen(errors => errors.pipe(
          tap(err => {
            console.error('Got error creating web socket', err);
          }),
          delay(1000)
        ))
      ).subscribe(data => {
        this.handleEvent(data);
      });

    }
  }

}
