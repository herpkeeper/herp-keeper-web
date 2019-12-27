import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError} from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxLoadingModule } from 'ngx-loading';

import { SharedModule } from '@app/shared';
import { ProfileStoreService } from '@app/core';
import { AnimalComponent } from './animal.component';
import { AnimalDetailComponent } from './animal-detail.component';
import { AnimalEditComponent } from './animal-edit.component';

describe('AnimalComponent', () => {
  let component: AnimalComponent;
  let fixture: ComponentFixture<AnimalComponent>;
  let activatedRoute;
  let profileStoreService: ProfileStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule.forRoot({}),
        SharedModule
      ],
      declarations: [ AnimalComponent, AnimalDetailComponent, AnimalEditComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    profileStoreService = TestBed.get(ProfileStoreService);
    activatedRoute = TestBed.get(ActivatedRoute);
    activatedRoute.snapshot = {
      params: {
      }
    };
    fixture = TestBed.createComponent(AnimalComponent);
    component = fixture.componentInstance;
  });

  it('should fail to load profile on init', () => {
    activatedRoute.data = of({ loading: throwError(new Error('Failed')) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(1);
  });

  it('should load profile on init', () => {
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
  });

  it('should load animal on init', () => {
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
    expect(component.animalId).toEqual('id');
  });

  it('should change loading', () => {
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.loadingChange(true);
    expect(component.loading).toBeTruthy();
  });

  it('should change edit', () => {
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.editChange(true);
    expect(component.edit).toBeTruthy();
  });

  it('should change alerts', () => {
    activatedRoute.snapshot.params.id = 'id';
    activatedRoute.data = of({ loading: of(true) });
    fixture.detectChanges();
    component.alertsChange([{ type: 'danger', message: 'test' }]);
    expect(component.alerts.length).toEqual(1);
  });

});
