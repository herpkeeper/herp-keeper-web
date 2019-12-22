import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TopNavComponent } from './top-nav.component';
import { AuthService } from '@app/core';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule
      ],
      declarations: [ TopNavComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should prevent events when clicking on dropdown menu', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'dropdownClick').and.callThrough();
    const link = fixture.debugElement.nativeElement.querySelector('#accountMenu');
    expect(link).toBeTruthy();
    link.click();
    tick();
    fixture.detectChanges();
    expect(component.dropdownClick).toHaveBeenCalled();
  }));

  it('should logout', fakeAsync(() => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    spyOn(authService, 'hasRole').and.returnValue(true);
    spyOn(authService, 'logout').and.returnValue(of(true));
    spyOn(component, 'logout').and.callThrough();
    fixture.detectChanges();
    const link = fixture.debugElement.nativeElement.querySelector('#logoutMenu');
    expect(link).toBeTruthy();
    link.click();
    tick();
    fixture.detectChanges();
    expect(component.logout).toHaveBeenCalled();
  }));

  it('should have role', () => {
    spyOn(authService, 'hasRole').and.returnValue(true);
    fixture.detectChanges();
    expect(component.hasRole('member')).toBeTruthy();
  });

});
