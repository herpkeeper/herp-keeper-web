import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ProfileStoreService } from '@app/core';
import { Alert, Animal, ConfirmModalComponent, Feeding, Location, Species } from '@app/shared';

@Component({
  selector: 'herp-keeper-animal-detail',
  templateUrl: './animal-detail.component.html',
  styleUrls: ['./animal-detail.component.scss']
})
export class AnimalDetailComponent implements OnInit {

  @Input()
  animalId: string;

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  alerts: EventEmitter<Array<Alert>> = new EventEmitter<Array<Alert>>();

  @Output()
  edit: EventEmitter<boolean> = new EventEmitter<boolean>();

  animal: Animal;
  location: Location;
  species: Species;
  allFeedings: Array<Feeding> = [];
  feedings: Array<Feeding> = [];
  numFeedings = 0;
  feedingPage = 1;
  feedingPageSize = 5;

  constructor(private modalService: NgbModal,
              private profileStoreService: ProfileStoreService) {
  }

  editAnimal() {
    this.edit.emit(true);
  }

  deleteFeeding(feeding: Feeding) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = `Delete feeding?`;
    modalRef.componentInstance.body = 'Are you sure you want to delete this feeding?';

    modalRef.result.then((res) => {
      const newFeedings = this.animal.feedings.filter(f => f._id !== feeding._id);
      this.animal.feedings = newFeedings;
      this.alerts.emit([]);
      this.loading.emit(true);
      this.profileStoreService.updateAnimal(this.animal).subscribe(a => {
        this.animal = a;
        this.numFeedings = this.animal.feedings.length;
        this.allFeedings = this.animal.feedings.sort((f1, f2) => {
          return (new Date(f1.feedingDate) > new Date(f2.feedingDate)) ? 1 : -1;
        });
        this.feedingPage = 1;
        this.loadFeedings(0, this.feedingPageSize);
        this.alerts.emit([{ type: 'success', message: 'Feeding has been deleted' }]);
        this.loading.emit(false);
      }, err => {
        this.alerts.emit([{ type: 'danger', message: 'Failed to upate animal' }]);
        this.loading.emit(false);
      });
    }).catch((err) => {
    });
  }

  loadFeedings(start: number, end: number) {
    this.feedings = [...this.allFeedings].slice(start, end);
  }

  changeFeedingPage(newPage: number) {
    this.feedingPage = newPage;
    const start = (this.feedingPage - 1) * this.feedingPageSize;
    const end = start + this.feedingPageSize;
    this.loadFeedings(start, end);
  }

  ngOnInit() {
    this.animal = this.profileStoreService.findAnimal(this.animalId);
    this.location = this.profileStoreService.findLocation(this.animal.locationId);
    this.species = this.profileStoreService.findSpecies(this.animal.speciesId);
    this.numFeedings = this.animal.feedings.length;
    this.allFeedings = this.animal.feedings.sort((f1, f2) => {
      return (new Date(f1.feedingDate) > new Date(f2.feedingDate)) ? 1 : -1;
    });
    this.loadFeedings(0, this.feedingPageSize);
  }

}
