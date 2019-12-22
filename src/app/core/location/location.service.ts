import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';

import { environment } from '@env/environment';
import { Location } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {
  }

  save(location: Location): Observable<Location> {
    const url = `${environment.apiUrl}/location`;

    return this.http.post<Location>(url, location);
  }

  delete(location: Location): Observable<Location> {
    const url = `${environment.apiUrl}/location/${location._id}`;

    return this.http.delete<Location>(url);
  }

}
