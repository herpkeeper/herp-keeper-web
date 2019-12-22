import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';

import { Registration } from './registration';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) {
  }

  register(registration: Registration): Observable<boolean> {
    const url = `${environment.apiUrl}/register`;
    return this.http.post<Registration>(url, registration).pipe(
      map(v => true)
    );
  }

}
