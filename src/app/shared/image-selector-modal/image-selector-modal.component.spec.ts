import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ProfileStoreService } from '@app/core';
import { ImageSelectorModalComponent } from './image-selector-modal.component';

describe('ImageSelectorModalComponent', () => {
  let component: ImageSelectorModalComponent;
  let fixture: ComponentFixture<ImageSelectorModalComponent>;
  let profileStoreService: ProfileStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FontAwesomeModule,
        NgbModule
      ],
      providers: [ NgbActiveModal ],
      declarations: [ ImageSelectorModalComponent ]
    }).compileComponents();
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change page', () => {
    component.changePage(1);
    expect(component.page).toBe(1);
  });

  it('should select image and clear', () => {
    expect(component.selected.length).toBe(0);
    component.selectImage({ _id: '1' });
    expect(component.selected.length).toBe(1);
    expect(component.isSelected({ _id: '1' })).toBeTruthy();
    component.removeImage({ _id: '1' });
    expect(component.selected.length).toBe(0);
  });

  it('should clear selected', () => {
    component.selectImage({ _id: '1' });
    expect(component.selected.length).toBe(1);
    component.clearSelected();
    expect(component.selected.length).toBe(0);
  });

  it('should submit', () => {
    component.onSubmit();
  });

});
