import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';
import { ImagesRoutingModule } from './images-routing.module';
import { ImagesComponent } from './images.component';
import { ImageEditModalComponent } from './image-edit-modal.component';

@NgModule({
  declarations: [ImagesComponent, ImageEditModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule,
    SharedModule,
    ImagesRoutingModule
  ],
  entryComponents: [
    ImageEditModalComponent
  ]
})
export class ImagesModule { }
