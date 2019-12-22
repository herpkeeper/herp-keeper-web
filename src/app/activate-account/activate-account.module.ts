import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxLoadingModule } from 'ngx-loading';

import { ActivateAccountRoutingModule } from './activate-account-routing.module';
import { ActivateAccountComponent } from './activate-account.component';

@NgModule({
  declarations: [ActivateAccountComponent],
  imports: [
    CommonModule,
    NgxLoadingModule,
    ActivateAccountRoutingModule
  ]
})
export class ActivateAccountModule { }
