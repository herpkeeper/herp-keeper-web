import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@app/core';
import { HomeModule } from '@app/home';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    NgbModule,
    AppRoutingModule,
    CoreModule,
    HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(library: FaIconLibrary) {
    library.addIcons(faHome);
    library.addIcons(faNewspaper);
    library.addIcons(faSignInAlt);
    library.addIcons(faSignOutAlt);
    library.addIcons(faUser);
    library.addIcons(faUserPlus);
  }

}
