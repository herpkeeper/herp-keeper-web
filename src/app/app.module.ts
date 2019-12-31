import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AgmCoreModule } from '@agm/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faBinoculars } from '@fortawesome/free-solid-svg-icons/faBinoculars';
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faFrog } from '@fortawesome/free-solid-svg-icons/faFrog';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faMars } from '@fortawesome/free-solid-svg-icons/faMars';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons/faSearchLocation';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons/faSkullCrossbones';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTools } from '@fortawesome/free-solid-svg-icons/faTools';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faUtensils } from '@fortawesome/free-solid-svg-icons/faUtensils';
import { faVenus } from '@fortawesome/free-solid-svg-icons/faVenus';

import { environment } from '@env/environment';
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
    AgmCoreModule.forRoot({
      apiKey: environment.googleCloud.apiKey
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
    library.addIcons(faArrowLeft);
    library.addIcons(faArrowRight);
    library.addIcons(faBinoculars);
    library.addIcons(faBook);
    library.addIcons(faCalendarAlt);
    library.addIcons(faCheck);
    library.addIcons(faCogs);
    library.addIcons(faDatabase);
    library.addIcons(faGlobe);
    library.addIcons(faEdit);
    library.addIcons(faExclamationTriangle);
    library.addIcons(faEye);
    library.addIcons(faEyeSlash);
    library.addIcons(faFrog);
    library.addIcons(faHome);
    library.addIcons(faImage);
    library.addIcons(faKey);
    library.addIcons(faMars);
    library.addIcons(faNewspaper);
    library.addIcons(faPlus);
    library.addIcons(faQuestion);
    library.addIcons(faSave);
    library.addIcons(faSearch);
    library.addIcons(faSearchLocation);
    library.addIcons(faSignInAlt);
    library.addIcons(faSignOutAlt);
    library.addIcons(faSkullCrossbones);
    library.addIcons(faStar);
    library.addIcons(faTimes);
    library.addIcons(faTools);
    library.addIcons(faTrashAlt);
    library.addIcons(faUser);
    library.addIcons(faUsers);
    library.addIcons(faUserPlus);
    library.addIcons(faUtensils);
    library.addIcons(faVenus);
  }

}
