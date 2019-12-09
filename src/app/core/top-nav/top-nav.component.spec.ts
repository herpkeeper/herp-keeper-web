import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TopNavComponent } from './top-nav.component';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule
      ],
      declarations: [ TopNavComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
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

});
