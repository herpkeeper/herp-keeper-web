import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { throwIfAlreadyLoaded } from './module-import.guard';
import { TopNavComponent } from './top-nav/top-nav.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  declarations: [TopNavComponent, NotFoundComponent, ForbiddenComponent],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    NgbModule
  ],
  exports: [TopNavComponent, NotFoundComponent, ForbiddenComponent]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}
