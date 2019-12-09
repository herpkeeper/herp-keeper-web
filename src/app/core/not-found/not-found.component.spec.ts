import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NotFoundComponent } from './not-found.component';

@Component({
  template: ''
})
class DummyComponent {
}

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent }
        ]),
        FontAwesomeModule
      ],
      declarations: [ DummyComponent, NotFoundComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
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
