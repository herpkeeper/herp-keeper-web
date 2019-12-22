import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ForbiddenComponent } from './forbidden.component';

@Component({
  template: ''
})
class DummyComponent {
}

describe('ForbiddenComponent', () => {
  let component: ForbiddenComponent;
  let fixture: ComponentFixture<ForbiddenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent }
        ]),
        FontAwesomeModule
      ],
      declarations: [ DummyComponent, ForbiddenComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate home', () => {
    fixture.detectChanges();
    component.navigateHome();
  });

});
