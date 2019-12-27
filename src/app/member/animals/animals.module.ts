import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';
import { AnimalsRoutingModule } from './animals-routing.module';
import { AnimalsComponent } from './animals.component';

@NgModule({
  declarations: [AnimalsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule,
    SharedModule,
    AnimalsRoutingModule
  ]
})
export class AnimalsModule { }
