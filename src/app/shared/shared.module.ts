import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ImageSelectorModalComponent } from './image-selector-modal/image-selector-modal.component';
import { SexPipe } from './sex/sex.pipe';

@NgModule({
  declarations: [ConfirmModalComponent, ImageSelectorModalComponent, SexPipe],
  imports: [
    NgbModule,
    FontAwesomeModule,
    CommonModule
  ],
  exports: [
    ConfirmModalComponent,
    ImageSelectorModalComponent,
    SexPipe
  ],
  entryComponents: [
    ConfirmModalComponent,
    ImageSelectorModalComponent
  ]
})
export class SharedModule { }
