import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Animal } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  constructor(private http: HttpClient) {
  }

  save(animal: Animal): Observable<Animal> {
    const url = `${environment.apiUrl}/animal`;

    return this.http.post<Animal>(url, animal);
  }

  saveMulti(animals: Array<Animal>): Observable<Array<Animal>> {
    const url = `${environment.apiUrl}/animals`;

    return this.http.post<Array<Animal>>(url, animals);
  }

  delete(animal: Animal): Observable<Animal> {
    const url = `${environment.apiUrl}/animal/${animal._id}`;

    return this.http.delete<Animal>(url);
  }

}
