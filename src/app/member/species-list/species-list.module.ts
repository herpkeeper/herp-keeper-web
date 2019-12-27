import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';
import { SpeciesListRoutingModule } from './species-list-routing.module';
import { SpeciesListComponent } from './species-list.component';

@NgModule({
  declarations: [SpeciesListComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule,
    SharedModule,
    SpeciesListRoutingModule
  ]
})
export class SpeciesListModule { }
