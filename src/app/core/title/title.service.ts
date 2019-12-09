import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private prefix: string;

  constructor(private title: Title) {
    this.prefix = environment.titlePrefix;
  }

  setTitle(newTitle: string) {
    this.title.setTitle(`${this.prefix} - ${newTitle}`);
  }

  getTitle(): string {
    return this.title.getTitle();
  }

}
