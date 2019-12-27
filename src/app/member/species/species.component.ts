import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Class, ImageSelectorModalComponent, Order, Profile, Species, SubOrder } from '@app/shared';
import { BaseComponent, ImageService, ProfileStoreService, SpeciesService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-species',
  templateUrl: './species.component.html',
  styleUrls: ['./species.component.scss']
})
export class SpeciesComponent extends BaseComponent implements OnInit {

  profile$: Observable<Profile>;
  speciesForm: FormGroup;
  imageUrl$: Observable<string>;
  advanced = false;
  classes: Array<Class> = [];
  orders: Array<Order> = [];
  subOrders: Array<SubOrder> = [];

  constructor(private fb: FormBuilder,
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private profileStoreService: ProfileStoreService,
              private speciesService: SpeciesService,
              private imageService: ImageService,
              private titleService: TitleService) {
    super();
    this.classes = this.speciesService.classes;
    this.createForm();
  }

  onSubmit() {
    this.alerts = [];

    const species: Species = {
      commonName: this.commonName.value,
      venomous: (this.venomous.value === 'true'),
      potentiallyHarmful: (this.potentiallyHarmful.value === 'true'),
      genus: this.genus.value,
      species: this.species.value,
      subSpecies: this.subSpecies.value,
      imageId: this.imageId.value,
      class: this.class.value,
      order: this.order.value,
      subOrder: this.subOrder.value
    };

    if (this.id.value) {
      this.loading = true;
      species._id = this.id.value;
      this.updateSpecies(species);
    } else {
      this.loading = true;
      this.addSpecies(species);
    }
  }

  removeImage() {
    this.imageId.setValue(null);
    this.imageUrl$ = null;
  }

  selectImage() {
    const modalRef = this.modalService.open(ImageSelectorModalComponent, { size: 'lg' });
    modalRef.componentInstance.maxSelected = 1;
    modalRef.result.then((res) => {
      this.imageId.setValue(res[0]);
      this.imageUrl$ = this.imageService.getDataUrl(this.imageId.value);
    }).catch((err) => {
    });
  }

  addSpecies(species: Species) {
    this.profileStoreService.addSpecies(species).subscribe(res => {
      this.loadForm(res);
      this.alerts.push({type: 'success', message: 'Species successfully added'});
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to save species'});
      this.loading = false;
    });
  }

  updateSpecies(species: Species) {
    this.profileStoreService.updateSpecies(species).subscribe(res => {
      this.loadForm(res);
      this.alerts.push({type: 'success', message: 'Species successfully updated'});
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to save species'});
      this.loading = false;
    });
  }

  createForm() {
    this.speciesForm = this.fb.group({
      id: [ null ],
      commonName: ['', Validators.required],
      venomous: ['false'],
      potentiallyHarmful: ['false'],
      genus: [''],
      species: [''],
      subSpecies: [''],
      imageId: [ null ],
      class: [''],
      order: [''],
      subOrder: ['']
    });
  }

  loadForm(species: Species) {
    this.id.setValue(species._id);
    this.venomous.setValue(species.venomous + '');
    this.potentiallyHarmful.setValue(species.potentiallyHarmful + '');
    this.commonName.setValue(species.commonName);
    this.genus.setValue(species.genus);
    this.species.setValue(species.species);
    this.subSpecies.setValue(species.subSpecies);
    this.imageId.setValue(species.imageId);
    this.imageUrl$ = this.imageService.getDataUrl(this.imageId.value);
    this.class.setValue(species.class);
    this.changeClass();
    this.order.setValue(species.order);
    this.changeOrder();
    this.subOrder.setValue(species.subOrder);
  }

  changeClass() {
    // Reset order value
    this.order.setValue('');
    // Set proper orders for class
    this.orders = this.speciesService.getOrdersByClass(this.class.value);
  }

  changeOrder() {
    // Reset sub-order value
    this.subOrder.setValue('');
    // Set proper sub-order for order
    this.subOrders = this.speciesService.getSubOrdersByOrder(this.order.value);
  }

  ngOnInit() {
    this.titleService.setTitle('New Species');
    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      if (this.activatedRoute.snapshot.params.id) {
        this.loadForm(this.profileStoreService.findSpecies(this.activatedRoute.snapshot.params.id));
        this.titleService.setTitle(this.commonName.value);
      }
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

  get id() { return this.speciesForm.get('id'); }

  get commonName() { return this.speciesForm.get('commonName'); }

  get venomous() { return this.speciesForm.get('venomous'); }

  get potentiallyHarmful() { return this.speciesForm.get('potentiallyHarmful'); }

  get imageId() { return this.speciesForm.get('imageId'); }

  get genus() { return this.speciesForm.get('genus'); }

  get species() { return this.speciesForm.get('species'); }

  get subSpecies() { return this.speciesForm.get('subSpecies'); }

  get class() { return this.speciesForm.get('class'); }

  get order() { return this.speciesForm.get('order'); }

  get subOrder() { return this.speciesForm.get('subOrder'); }

}
