import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

import { ImageService, ProfileStoreService } from '@app/core';
import { Alert, Animal, AnimalImage, ImageSelectorModalComponent, Profile } from '@app/shared';

@Component({
  selector: 'herp-keeper-animal-edit',
  templateUrl: './animal-edit.component.html',
  styleUrls: ['./animal-edit.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AnimalEditComponent implements OnInit {

  @Input()
  animalId: string;

  @Input()
  profile: Profile;

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  alerts: EventEmitter<Array<Alert>> = new EventEmitter<Array<Alert>>();

  @Output()
  edit: EventEmitter<boolean> = new EventEmitter<boolean>();

  editForm: FormGroup;
  images: Array<AnimalImage> = [];
  imageUrls$: Map<string, Observable<string>> = new Map();

  constructor(private fb: FormBuilder,
              private router: Router,
              private modalService: NgbModal,
              private imageService: ImageService,
              private profileStoreService: ProfileStoreService) {
    this.createForm();
  }

  cancel() {
    if (this.animalId) {
      this.edit.emit(false);
    } else {
      this.router.navigate(['/member/animals']);
    }
  }

  addImages() {
    const modalRef = this.modalService.open(ImageSelectorModalComponent, { size: 'lg' });
    modalRef.result.then((res) => {
      res.forEach(imageId => {
        const existing = this.images.find(img => img.imageId === imageId);
        if (!existing) {
          this.images.push({
            imageId
          });
          this.imageUrls$.set(imageId, this.imageService.getDataUrl(imageId));
        }
      });
    }).catch((err) => {
    });
  }

  removeImage(image: AnimalImage) {
    this.images = this.images.filter(img => img.imageId !== image.imageId);
  }

  setDefaultImage(image: AnimalImage) {
    this.images.forEach(img => {
      if (img.imageId === image.imageId) {
        img.default = true;
      } else {
        img.default = false;
      }
    });
  }

  createForm() {
    this.editForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      location: ['', Validators.required],
      species: ['', Validators.required],
      sex: ['U'],
      birthDate: [null],
      acquisitionDate: [null],
      preferredFood: [null]
    });
  }

  onSubmit() {
    this.alerts.emit([]);

    const animal: Animal = {
      name: this.name.value,
      locationId: this.location.value,
      speciesId: this.species.value,
      sex: this.sex.value,
      birthDate: this.birthDate.value,
      acquisitionDate: this.acquisitionDate.value,
      images: this.images
    };

    if (this.preferredFood.value) {
      animal.preferredFood = this.preferredFood.value;
    }

    if (this.id.value) {
      animal._id = this.id.value;
      this.loading.emit(true);
      this.updateAnimal(animal);
    } else {
      this.loading.emit(true);
      this.addAnimal(animal);
    }
  }

  addAnimal(animal: Animal) {
    this.profileStoreService.addAnimal(animal).subscribe(res => {
      this.loading.emit(false);
      this.router.navigate([`/member/animal/${res._id}`]);
    }, err => {
      this.alerts.emit([{type: 'danger', message: 'Failed to save animal'}]);
      this.loading.emit(false);
    });
  }

  updateAnimal(animal: Animal) {
    this.profileStoreService.updateAnimal(animal).subscribe(res => {
      this.loading.emit(false);
      this.edit.emit(false);
    }, err => {
      this.alerts.emit([{type: 'danger', message: 'Failed to save animal'}]);
      this.loading.emit(false);
    });
  }

  loadForm() {
    const animal = this.profileStoreService.findAnimal(this.animalId);
    this.id.setValue(animal._id);
    this.name.setValue(animal.name);
    this.location.setValue(animal.locationId);
    this.species.setValue(animal.speciesId);
    this.sex.setValue(animal.sex);
    if (animal.birthDate) {
      this.birthDate.setValue(new Date(animal.birthDate));
    }
    if (animal.acquisitionDate) {
      this.acquisitionDate.setValue(new Date(animal.acquisitionDate));
    }
    this.preferredFood.setValue(animal.preferredFood);
    this.images = animal.images;
    this.images.forEach(img => {
      this.imageUrls$.set(img.imageId, this.imageService.getDataUrl(img.imageId));
    });
  }

  ngOnInit() {
    if (this.animalId) {
      this.loadForm();
    }
  }

  get id() { return this.editForm.get('id'); }

  get name() { return this.editForm.get('name'); }

  get location() { return this.editForm.get('location'); }

  get species() { return this.editForm.get('species'); }

  get sex() { return this.editForm.get('sex'); }

  get birthDate() { return this.editForm.get('birthDate'); }

  get acquisitionDate() { return this.editForm.get('acquisitionDate'); }

  get preferredFood() { return this.editForm.get('preferredFood'); }

}
