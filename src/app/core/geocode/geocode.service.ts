import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { MapsAPILoader } from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {

  constructor(private ngZone: NgZone,
              private mapsApiLoader: MapsAPILoader) {
  }

  geocodeAddress(address: string): Observable<any> {
    return this._geocode({ address });
  }

  reverseGeocode(lat: number, lng: number): Observable<any> {
    return this._geocode({ location: {
      lat,
      lng
    }});
  }

  private _geocode(request: any): Observable<any> {
    return new Observable(observer => {
      this.mapsApiLoader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(request, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            this.ngZone.run(() => {
              observer.next(results);
              observer.complete();
            });
          } else {
            this.ngZone.run(() => observer.error(status));
          }
        });
      });
    });
  }
}
