import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError, Subscription } from 'rxjs';

import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgxLoadingModule } from 'ngx-loading';

import { ImageService, ProfileStoreService } from '@app/core';
import { ImagesComponent } from './images.component';

describe('ImagesComponent', () => {
  let component: ImagesComponent;
  let fixture: ComponentFixture<ImagesComponent>;
  let imageService: ImageService;
  let profileStoreService: ProfileStoreService;
  let activatedRoute;
  let modalResolve;
  let modalReject;

  beforeEach(async(() => {
    const modalServiceStub = {
      open(modal: any) {
        return {
          componentInstance: {
            loadImage: () => {
            }
          },
          result: new Promise((resolve, reject) => {
            modalResolve = resolve;
            modalReject = reject;
          })
        };
      }
    };
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub }
      ],
      declarations: [ ImagesComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    activatedRoute = TestBed.get(ActivatedRoute);
    imageService = TestBed.get(ImageService);
    profileStoreService = TestBed.get(ProfileStoreService);
    const d1 = new Date('01-01-2000');
    const d2 = new Date();
    profileStoreService.profile = {
      _id: 'id',
      images: [{
        _id: '1',
        updatedAt: d2
      }, {
        _id: '2',
        updatedAt: d1
      }, {
        _id: '3',
        updatedAt: d2
      }]
    } as any;
    fixture = TestBed.createComponent(ImagesComponent);
    component = fixture.componentInstance;
  });

  it('should fail to load profile on init', () => {
    activatedRoute.data = of({ loading: throwError(new Error('Failed')) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(1);
  });

  it('should load profile on init', () => {
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.alerts.length).toBe(0);
  });

  it('should change page', () => {
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.changePage(1);
    expect(component.page).toBe(1);
  });

  it('should cancel add', fakeAsync(() => {
    spyOn(profileStoreService, 'addImage').and.callThrough();
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.addImage();
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileStoreService.addImage).not.toHaveBeenCalled();
  }));

  it('should fail to add', fakeAsync(() => {
    spyOn(profileStoreService, 'addImage').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.addImage();
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Failed to save image');
  }));

  it('should add', fakeAsync(() => {
    spyOn(profileStoreService, 'addImage').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.addImage();
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Image successfully added');
  }));

  it('should cancel delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeImage').and.callThrough();
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.deleteImage({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileStoreService.removeImage).not.toHaveBeenCalled();
  }));

  it('should fail to delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeImage').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.deleteImage({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Failed to delete image');
  }));

  it('should delete', fakeAsync(() => {
    spyOn(profileStoreService, 'removeImage').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.deleteImage({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Image successfully deleted');
  }));

  it('should cancel edit', fakeAsync(() => {
    spyOn(profileStoreService, 'updateImage').and.callThrough();
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.editImage({} as any);
    modalReject('Cancelled');
    fixture.detectChanges();
    tick();
    expect(profileStoreService.updateImage).not.toHaveBeenCalled();
  }));

  it('should fail to edit', fakeAsync(() => {
    spyOn(profileStoreService, 'updateImage').and.returnValue(throwError(new Error('Failed')));
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.editImage({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Failed to save image');
  }));

  it('should edit', fakeAsync(() => {
    spyOn(profileStoreService, 'updateImage').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.editImage({} as any);
    modalResolve('Closed');
    fixture.detectChanges();
    tick();
    expect(component.alerts.length).toEqual(1);
    expect(component.alerts[0].message).toEqual('Image successfully updated');
  }));

  it('should view image', () => {
    spyOn(imageService, 'openImage').and.callFake(() => {});
    spyOn(profileStoreService, 'updateImage').and.returnValue(of({} as any));
    activatedRoute.data = of({ loading: of({}) });
    fixture.detectChanges();
    component.viewImage('url');
  });

});
