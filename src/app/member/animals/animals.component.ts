import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Animal, ConfirmModalComponent, Profile, Species } from '@app/shared';
import { BaseComponent, ImageService, ProfileStoreService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.scss']
})
export class AnimalsComponent extends BaseComponent implements OnInit, OnDestroy {

  profile$: Observable<Profile>;
  profileSubscription: Subscription;
  filterForm: FormGroup;
  allAnimals: Array<Animal>;
  allSpecies: Array<Species>;
  filteredAnimals: Array<Animal>;
  imageUrls$: Map<string, Observable<string>> = new Map();

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private profileStoreService: ProfileStoreService,
              private imageService: ImageService,
              private titleService: TitleService) {
    super();
    this.createForm();
  }

  filter() {
    this.filteredAnimals = [...this.allAnimals];
    // Filter species first
    if (this.speciesFilter.value) {
      this.filteredAnimals = this.filteredAnimals.filter(animal => animal.speciesId === this.speciesFilter.value);
    }
    // Filter sex
    if (this.sexFilter.value) {
      this.filteredAnimals = this.filteredAnimals.filter(animal => animal.sex === this.sexFilter.value);
    }
    // Now sort
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
  }

  deleteAnimal(animal: Animal) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = `Delete ${animal.name}?`;
    modalRef.componentInstance.body = 'Are you sure you want to delete this animal?';

    modalRef.result.then((res) => {
      this.alerts = [];
      this.loading = true;
      this.profileStoreService.removeAnimal(animal).subscribe(a => {
        this.alerts.push({type: 'success', message: 'Animal successfully deleted'});
        this.loading = false;
      }, err => {
        this.alerts.push({type: 'danger', message: 'Failed to delete animal'});
        this.loading = false;
      });
    }).catch((err) => {
    });
  }

  findSpecies(id: string) {
    return this.profileStoreService.findSpecies(id);
  }

  findLocation(id: string) {
    return this.profileStoreService.findLocation(id);
  }

  getLastFeeding(animal: Animal) {
    if (animal.feedings && animal.feedings.length > 0) {
      const res = animal.feedings.reduce((f1, f2) => {
        return new Date(f1.feedingDate) > new Date(f2.feedingDate) ? f1 : f2;
      });
      return res;
    }
    return null;
  }

  createForm() {
    this.filterForm = this.fb.group({
      speciesFilter: [''],
      sexFilter: ['']
    });
  }

  subscribeToProfileChanges() {
    this.profileSubscription = this.profile$.subscribe(profile => {
      this.imageUrls$ = new Map();
      profile.animals.forEach(a => {
        if (a.images.length > 0) {
          let defaultImage = a.images[0];
          a.images.forEach(i => {
            if (i.default) {
              defaultImage = i;
            }
          });
          this.imageUrls$.set(a._id, this.imageService.getDataUrl(defaultImage.imageId));
        }
      });
      this.allSpecies = [...profile.species].sort((s1, s2) => {
        return (s1.commonName > s2.commonName) ? 1 : -1;
      });
      this.allAnimals = profile.animals;
      this.filter();
    });
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Animals');
    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      this.subscribeToProfileChanges();
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

  get speciesFilter() { return this.filterForm.get('speciesFilter'); }

  get sexFilter() { return this.filterForm.get('sexFilter'); }

}
