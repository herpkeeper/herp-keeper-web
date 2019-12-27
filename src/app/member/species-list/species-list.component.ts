import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmModalComponent, Profile, Species } from '@app/shared';
import { BaseComponent, ImageService, ProfileStoreService, SpeciesService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-species-list',
  templateUrl: './species-list.component.html',
  styleUrls: ['./species-list.component.scss']
})
export class SpeciesListComponent extends BaseComponent implements OnInit, OnDestroy {

  profile$: Observable<Profile>;
  profileSubscription: Subscription;
  imageUrls$: Map<string, Observable<string>> = new Map();
  allSpecies: Array<Species>;

  constructor(private activatedRoute: ActivatedRoute,
              private modalService: NgbModal,
              private profileStoreService: ProfileStoreService,
              private speciesService: SpeciesService,
              private imageService: ImageService,
              private titleService: TitleService) {
    super();
  }

  viewImage(url: string) {
    this.imageService.openImage(url);
  }

  isReferenced(species: Species) {
    return this.profileStoreService.isSpeciesReferenced(species._id);
  }

  deleteSpecies(species: Species) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = `Delete ${species.commonName}?`;
    modalRef.componentInstance.body = 'Are you sure you want to delete this species?';

    modalRef.result.then((res) => {
      this.alerts = [];
      this.loading = true;
      this.profileStoreService.removeSpecies(species).subscribe(s => {
        this.alerts.push({type: 'success', message: 'Species successfully deleted'});
        this.loading = false;
      }, err => {
        this.alerts.push({type: 'danger', message: 'Failed to delete species'});
        this.loading = false;
      });
    }).catch((err) => {
    });
  }

  subscribeToProfileChanges() {
    this.profileSubscription = this.profile$.subscribe(profile => {
      this.imageUrls$ = new Map();
      profile.species.forEach(sp => {
        if (sp.imageId) {
          this.imageUrls$.set(sp.imageId, this.imageService.getDataUrl(sp.imageId));
        }
      });
      this.allSpecies = [...profile.species].sort((s1, s2) => {
        return (s1.commonName > s2.commonName) ? 1 : -1;
      });
    });
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.titleService.setTitle('Species');
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

}
