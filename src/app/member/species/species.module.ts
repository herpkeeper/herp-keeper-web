import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';
import { SpeciesRoutingModule } from './species-routing.module';
import { SpeciesComponent } from './species.component';

@NgModule({
  declarations: [SpeciesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule,
    SharedModule,
    SpeciesRoutingModule
  ]
})
export class SpeciesModule { }
