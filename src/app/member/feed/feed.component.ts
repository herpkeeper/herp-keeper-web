import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as cloneDeep from 'lodash/cloneDeep';

import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

import { Animal, Profile, Species } from '@app/shared';
import { BaseComponent, ProfileStoreService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class FeedComponent extends BaseComponent implements OnInit {

  profile$: Observable<Profile>;
  locationDateForm: FormGroup;
  selectAnimalForm: FormGroup;
  feedAnimalForm: FormGroup;
  selectedLocation: string;
  allSpecies: Array<Species>;
  allAnimals: Array<Animal> = [];
  filteredAnimals: Array<Animal> = [];
  animalsFormArray: FormArray;
  selectedAnimalsFormArray: FormArray;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private profileStoreService: ProfileStoreService,
              private titleService: TitleService) {
    super();
    this.createForms();
  }

  feedAnimals() {
    // Copy animal to new animals array and set feedings
    const animals: Array<Animal> = [];
    this.selectedAnimalsFormArray.value.forEach((v) => {
      const animal: Animal = cloneDeep(this.profileStoreService.findAnimal(v.id));
      animal.feedings.unshift({
        feedingDate: v.feedingDate,
        quantity: v.quantity,
        type: v.foodType
      });
      animals.push(animal);
    });
    // Now update these animals
    this.alerts = [];
    this.loading = true;
    this.profileStoreService.updateAnimals(animals).subscribe(res => {
      this.back();
      this.selectNone();
      this.location.setValue('');
      this.feedingDate.setValue(new Date());
      this.changeLocation();
      this.alerts.push({ type: 'success', message: 'Animals have been successfully fed' });
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alerts.push({ type: 'danger', message: 'Failed to update animals' });
    });
  }

  next() {
    this.animalsFormArray.value.forEach(v => {
      if (v.selected) {
        const group = this.fb.group({
          id: [v.id],
          name: [v.name],
          species: [v.species],
          feedingDate: [this.locationDateForm.get('feedingDate').value],
          foodType: [v.foodType, Validators.required],
          quantity: [1, Validators.required]
        });
        this.selectedAnimalsFormArray.push(group);
      }
    });
  }

  back() {
    this.selectedAnimalsFormArray.clear();
    this.speciesFilter.setValue('');
    this.filterAnimals();
  }

  createForms() {
    this.locationDateForm = this.fb.group({
      feedingDate: [new Date(), Validators.required],
      location: ['']
    });

    this.animalsFormArray = new FormArray([]);
    this.selectAnimalForm = this.fb.group({
      speciesFilter: [''],
      animals: this.animalsFormArray
    });

    this.selectedAnimalsFormArray = new FormArray([]);
    this.feedAnimalForm = this.fb.group({
      animals: this.selectedAnimalsFormArray
    });
  }

  filterAnimals() {
    this.animalsFormArray.clear();

    this.filteredAnimals = [...this.allAnimals];

    if (this.speciesFilter.value) {
      this.filteredAnimals = this.filteredAnimals.filter(animal => animal.speciesId === this.speciesFilter.value);
    }

    this.filteredAnimals.sort((a1, a2) => {
      // First do species
      const species1 = this.profileStoreService.findSpecies(a1.speciesId);
      const species2 = this.profileStoreService.findSpecies(a2.speciesId);

      if (species1.commonName > species2.commonName) {
        return 1;
      }
      if (species1.commonName < species2.commonName) {
        return -1;
      }

      if (a1.name > a2.name) {
        return 1;
      }
      if (a1.name < a2.name) {
        return -1;
      }
    });

    this.filteredAnimals.forEach(animal => {
      const species = this.profileStoreService.findSpecies(animal.speciesId);
      const group = this.fb.group({
        id: [animal._id],
        selected: [false],
        name: [animal.name],
        species: [species.commonName],
        foodType: [animal.preferredFood]
      });
      this.animalsFormArray.push(group);
    });
  }

  changeLocation() {
    this.selectedLocation = this.location.value;
    if (this.selectedLocation) {
      this.allAnimals = [...this.profileStoreService.profile.animals];
      this.allAnimals = this.allAnimals.filter(animal => animal.locationId === this.selectedLocation);
      this.filterAnimals();
    } else {
      this.filteredAnimals = [];
      this.animalsFormArray.clear();
    }
  }

  selectAll() {
    for (let i = 0; i < this.animalsFormArray.length; i++) {
      this.animalsFormArray.at(i).get('selected').setValue(true);
    }
  }

  selectNone() {
    for (let i = 0; i < this.animalsFormArray.length; i++) {
      this.animalsFormArray.at(i).get('selected').setValue(false);
    }
  }

  hasSelectedAnimals(): boolean {
    for (let i = 0; i < this.animalsFormArray.length; i++) {
      if (this.animalsFormArray.at(i).get('selected').value) {
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
    this.titleService.setTitle('Feed Animals');
    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      this.allSpecies = [...this.profileStoreService.profile.species].sort((s1, s2) => {
        return (s1.commonName > s2.commonName) ? 1 : -1;
      });
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

  get location() { return this.locationDateForm.get('location'); }

  get feedingDate() { return this.locationDateForm.get('feedingDate'); }

  get speciesFilter() { return this.selectAnimalForm.get('speciesFilter'); }

}
