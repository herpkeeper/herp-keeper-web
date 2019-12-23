import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationsComponent } from './locations.component';

@NgModule({
  declarations: [LocationsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule,
    SharedModule,
    LocationsRoutingModule
  ]
})
export class LocationsModule { }
