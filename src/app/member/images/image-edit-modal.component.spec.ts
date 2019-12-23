import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgxLoadingModule } from 'ngx-loading';

import { ImageEditModalComponent } from './image-edit-modal.component';

describe('ImageEditModalComponent', () => {
  let component: ImageEditModalComponent;
  let fixture: ComponentFixture<ImageEditModalComponent>;
  let mockFileReader;

  beforeEach(async(() => {
    mockFileReader = {
      result: '',
      readAsBinaryString: (file) => {
        console.log('Read as binary string');
      },
      onloadend: () => {
        console.log('On load end');
      },
      onerror: () => {
        console.log('On error');
      }
    };
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FontAwesomeModule,
        NgbModule,
        NgxLoadingModule
      ],
      providers: [ NgbActiveModal ],
      declarations: [ ImageEditModalComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageEditModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should click select image', () => {
    fixture.detectChanges();
    component.selectImage();
  });

  it('should not add image', () => {
    fixture.detectChanges();
    component.addImage(null);
  });

  it('should add image', () => {
    fixture.detectChanges();
    component.onImageSelected();
  });

  it('should fail to add image', () => {
    const file = new File(['b'], 'image.jpg');
    fixture.detectChanges();
    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsBinaryString').and.callFake((file)=> {
      mockFileReader.onerror(new Error('Failed!'));
    });
    component.addImage(file);
    expect(component.image).toBeFalsy();
    expect(component.alerts.length).toBe(1);
  });

  it('should add new image', () => {
    const file = new File(['b'], 'image.jpg');
    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsBinaryString').and.callFake((file)=> {
      mockFileReader.result = 'b';
      mockFileReader.onloadend();
    });
    fixture.detectChanges();
    component.addImage(file);
    expect(component.image).toBeTruthy();
  });

  it('should load image', () => {
    fixture.detectChanges();
    component.loadImage({
      _id: 'id',
      title: 'title',
      caption: 'caption'
    } as any);
    expect(component.image).toBeTruthy();
    expect(component.id.value).toBe('id');
    expect(component.title.value).toBe('title');
    expect(component.caption.value).toBe('caption');
  });

  it('should clear image', () => {
    fixture.detectChanges();
    component.loadImage({
      _id: 'id',
      title: 'title',
      caption: 'caption'
    } as any);
    component.clearImage();
    expect(component.image).toBeFalsy();
  });

  it('should get image url', () => {
    fixture.detectChanges();
    component.loadImage({
      _id: 'id',
      title: 'title',
      caption: 'caption'
    } as any);
    const url = component.getImageUrl();
    expect(url).toBeTruthy();
  });

  it('should save image', () => {
    fixture.detectChanges();
    component.image = {
    } as any;
    component.save();
  });

  it('should save existing image', () => {
    fixture.detectChanges();
    component.loadImage({
      _id: 'id',
      title: 'title',
      caption: 'caption'
    } as any);
    component.save();
  });

});
