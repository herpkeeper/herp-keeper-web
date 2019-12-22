import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
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
import { httpInterceptorProviders } from '@app/http-interceptors';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxLoadingModule.forRoot({
      fullScreenBackdrop: true,
      primaryColour: '#36942b',
      secondaryColour: '#36942b',
      tertiaryColour: '#36942b'
    }),
    AppRoutingModule,
    CoreModule,
    HomeModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(library: FaIconLibrary) {
    library.addIcons(faCheck);
    library.addIcons(faHome);
    library.addIcons(faNewspaper);
    library.addIcons(faSignInAlt);
    library.addIcons(faSignOutAlt);
    library.addIcons(faUser);
    library.addIcons(faUserPlus);
  }

}
