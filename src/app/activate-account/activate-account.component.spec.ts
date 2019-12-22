import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { NgxLoadingModule } from 'ngx-loading';

import { AuthService } from '@app/core';

import { ActivateAccountComponent } from './activate-account.component';

describe('ActivateAccountComponent', () => {
  let component: ActivateAccountComponent;
  let fixture: ComponentFixture<ActivateAccountComponent>;
  let authService: AuthService;
  let activatedRoute;

  const mockActivatedRoute = {
    snapshot: {
      queryParams: {
        username: null,
        key: null
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLoadingModule
      ],
      declarations: [ ActivateAccountComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateAccountComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    activatedRoute.snapshot.queryParams.username = null;
    activatedRoute.snapshot.queryParams.key = null;
  });

  it('should fail without username and key', () => {
    fixture.detectChanges();
    expect(component.complete).toBeTruthy();
    expect(component.failed).toBeTruthy();
  });

  it('should fail due to service error', () => {
    activatedRoute.snapshot.queryParams.username = 'user';
    activatedRoute.snapshot.queryParams.key = 'key';
    spyOn(authService, 'activateAccount').and.returnValue(throwError('Failed'));
    fixture.detectChanges();
    expect(authService.activateAccount).toHaveBeenCalled();
    expect(component.complete).toBeTruthy();
    expect(component.failed).toBeTruthy();
  });

  it('should succeed', () => {
    activatedRoute.snapshot.queryParams.username = 'user';
    activatedRoute.snapshot.queryParams.key = 'key';
    spyOn(authService, 'activateAccount').and.returnValue(of(true));
    fixture.detectChanges();
    expect(authService.activateAccount).toHaveBeenCalled();
    expect(component.complete).toBeTruthy();
    expect(component.failed).toBeFalsy();
  });

});
