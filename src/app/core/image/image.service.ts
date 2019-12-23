import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Image } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  }

  get(id: string): Observable<Image> {
    const url = `${environment.apiUrl}/image/${id}`;

    return this.http.get<Image>(url);
  }

  delete(image: Image): Observable<Image> {
    const url = `${environment.apiUrl}/image/${image._id}`;

    return this.http.delete<Image>(url);
  }

  save(image: Image): Observable<Image> {
    const url = `${environment.apiUrl}/image`;

    return this.http.post<Image>(url, image);
  }

  openImage(url: string) {
    const image = new Image();
    image.src = url;
    const w = window.open(url);
    w.document.write(image.outerHTML);
  }

  getDataUrl(id: string): Observable<string> {
    return this.get(id).pipe(
      map(val => {
        const url = `data:${val.contentType};base64,${val.data}`;
        return url;
      })
    );
  }

}
