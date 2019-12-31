import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { CountResult, Profile } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {
  }

  save(profile: Profile): Observable<Profile> {
    const url = `${environment.apiUrl}/profile`;

    return this.http.post<Profile>(url, profile);
  }

  delete(profile: Profile): Observable<Profile> {
    const url = `${environment.apiUrl}/profile/${profile._id}`;

    return this.http.delete<Profile>(url);
  }

  getById(id: string): Observable<Profile> {
    const url = `${environment.apiUrl}/profile/${id}`;

    return this.http.get<Profile>(url);
  }

  count(query: any = {}): Observable<number> {
    const url = `${environment.apiUrl}/profile/count`;
    const options = {
      params: new HttpParams()
    };
    for (const key of Object.keys(query)) {
      options.params = options.params.set(key, query[key]);
    }
    return this.http.get<CountResult>(url, options).pipe(
      map(v => v.count)
    );
  }

  find(query: any = {}, limit = 0, skip = 0): Observable<Array<Profile>> {
    const url = `${environment.apiUrl}/profile`;

    const options = {
      params: new HttpParams()
        .append('limit', limit.toString())
        .append('skip', skip.toString())
    };

    for (const key of Object.keys(query)) {
      options.params = options.params.set(key, query[key]);
    }

    return this.http.get<Array<Profile>>(url, options);
  }

}
