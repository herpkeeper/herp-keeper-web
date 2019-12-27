import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { NewsRoutingModule } from './news-routing.module';
import { NewsListComponent } from './news-list.component';

@NgModule({
  declarations: [NewsListComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule,
    NewsRoutingModule
  ]
})
export class NewsModule { }
