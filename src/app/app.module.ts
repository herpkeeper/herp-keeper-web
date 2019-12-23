import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBinoculars } from '@fortawesome/free-solid-svg-icons/faBinoculars';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faFrog } from '@fortawesome/free-solid-svg-icons/faFrog';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
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
    BrowserAnimationsModule,
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
    library.addIcons(faBinoculars);
    library.addIcons(faBook);
    library.addIcons(faCheck);
    library.addIcons(faCogs);
    library.addIcons(faEdit);
    library.addIcons(faFrog);
    library.addIcons(faGlobe);
    library.addIcons(faHome);
    library.addIcons(faImage);
    library.addIcons(faNewspaper);
    library.addIcons(faSave);
    library.addIcons(faSignInAlt);
    library.addIcons(faSignOutAlt);
    library.addIcons(faPlus);
    library.addIcons(faTimes);
    library.addIcons(faTrashAlt);
    library.addIcons(faUser);
    library.addIcons(faUserPlus);
  }

}
