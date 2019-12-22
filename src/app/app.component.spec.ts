import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppComponent } from './app.component';

import { AuthService, CoreModule, WsService } from '@app/core';

@Component({
  template: ''
})
class DummyComponent {
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let authService: AuthService;
  let wsService: WsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'member/dashboard', component: DummyComponent }
        ]),
        CoreModule
      ],
      declarations: [
        DummyComponent,
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    wsService = TestBed.get(WsService);
    router = TestBed.get(Router);
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should do nothing on init if not logged in', () => {
    component.ngOnInit();
  });

  it('should start websocket and navigate if logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'hasRole').and.returnValue(true);
    spyOn(wsService, 'start').and.callFake(() => {
    });
    component.ngOnInit();
    expect(wsService.start).toHaveBeenCalled();
  });

});
