import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Image } from '@app/shared';
import { BaseComponent } from '@app/core';

@Component({
  selector: 'herp-keeper-image-edit-modal',
  templateUrl: './image-edit-modal.component.html',
  styleUrls: ['./image-edit-modal.component.scss']
})
export class ImageEditModalComponent extends BaseComponent implements OnInit {

  image: Image;
  imageForm: FormGroup;
  @ViewChild('imageInput', {static: false}) imageInput;

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
    super();
    this.createForm();
  }

  loadImage(image: Image) {
    this.image = image;
    this.id.setValue(image._id);
    this.title.setValue(image.title);
    this.caption.setValue(image.caption);
  }

  save() {
    this.image._id = this.id.value;
    this.image.title = this.title.value;
    this.image.caption = this.caption.value;
    if (!this.image._id) {
      this.image._id = undefined;
    }
    this.activeModal.close(this.image);
  }

  getImageUrl() {
    const url = `data:${this.image.contentType};base64,${this.image.data}`;
    return url;
  }

  selectImage() {
    this.imageInput.nativeElement.click();
  }

  clearImage() {
    this.image = null;
  }

  onImageSelected() {
    const files: { [key: string]: any } = this.imageInput.nativeElement.files;
    this.addImage(files[0]);
    this.imageInput.nativeElement.value = '';
  }

  addImage(file: File) {
    if (file) {
      this.loading = true;
      const o$ = new Observable<Image>(o => {
        const fr = new FileReader();
        fr.onloadend = () => {
          const image = {
            fileName: file.name,
            contentType: file.type,
            data: btoa(fr.result as string)
          };
          o.next(image);
          o.complete();
        };
        fr.onerror = (err) => {
          o.error(err);
        };
        fr.readAsBinaryString(file);
      });
      o$.subscribe(res => {
        this.image = res;
        this.loading = false;
      }, err => {
        console.log(err);
        this.alerts.push({type: 'danger', message: 'Failed to read image'});
        this.loading = false;
      });
    }
  }

  createForm() {
    this.imageForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      caption: ['']
    });
  }

  ngOnInit() {
  }

  get id() { return this.imageForm.get('id'); }

  get title() { return this.imageForm.get('title'); }

  get caption() { return this.imageForm.get('caption'); }

}
