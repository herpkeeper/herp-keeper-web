import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';

import { createClient, ContentfulClientApi, EntryCollection } from 'contentful';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  client: ContentfulClientApi;

  constructor() {
    this.client = createClient(environment.cms);
  }

  getEntries(query: any): Observable<EntryCollection<any>> {
    return from(this.client.getEntries(query));
  }

}
