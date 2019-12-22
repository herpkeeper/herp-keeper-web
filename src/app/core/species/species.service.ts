import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Class, Order, Species, SubOrder } from '@app/shared';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  allClasses: Array<Class> = [{
    name: 'Reptilia',
    displayName: 'Reptiles'
  }, {
    name: 'Amphibia',
    displayName: 'Amphibians'
  }];

  allOrders: Array<Order> = [{
    name: 'Crocodilia',
    class: 'Reptilia',
    displayName: 'Crocodilians'
  }, {
    name: 'Squamata',
    class: 'Reptilia',
    displayName: 'Snakes and Lizards'
  }, {
    name: 'Testudines',
    class: 'Reptilia',
    displayName: 'Turtles and Tortoises'
  }, {
    name: 'Anura',
    class: 'Amphibia',
    displayName: 'Frogs and Toads'
  }, {
    name: 'Caudata',
    class: 'Amphibia',
    displayName: 'Salamanders'
  }, {
    name: 'Gymnophiona',
    class: 'Amphibia',
    displayName: 'Caecilians'
  }];

  allSubOrders: Array<SubOrder> = [{
    name: 'Lacertilia',
    order: 'Squamata',
    displayName: 'Lizards'
  }, {
    name: 'Serpentes',
    order: 'Squamata',
    displayName: 'Snakes'
  }];

  constructor(private http: HttpClient) {
  }

  save(species: Species): Observable<Species> {
    const url = `${environment.apiUrl}/species`;

    return this.http.post<Species>(url, species);
  }

  delete(species: Species): Observable<Species> {
    const url = `${environment.apiUrl}/species/${species._id}`;

    return this.http.delete<Species>(url);
  }

  getOrdersByClass(className: string): Array<Order> {
    const res = this.allOrders.filter(order => order.class === className);
    return res;
  }

  getSubOrdersByOrder(orderName: string): Array<SubOrder> {
    const res = this.allSubOrders.filter(subOrder => subOrder.order === orderName);
    return res;
  }

  get classes() { return this.allClasses; }
}
