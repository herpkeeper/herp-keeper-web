import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';
import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import { LocationLookupModalComponent } from './location-lookup-modal.component';

@NgModule({
  declarations: [LocationComponent, LocationLookupModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule,
    AgmCoreModule,
    SharedModule,
    LocationRoutingModule
  ],
  entryComponents: [
    LocationLookupModalComponent
  ]
})
export class LocationModule { }
