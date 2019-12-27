import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Profile } from '@app/shared';
import { BaseComponent, ProfileStoreService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.scss']
})
export class AnimalComponent extends BaseComponent implements OnInit {

  profile$: Observable<Profile>;
  animalId: string;
  edit = true;

  constructor(private activatedRoute: ActivatedRoute,
              private profileStoreService: ProfileStoreService,
              private titleService: TitleService) {
    super();
  }

  editChange(event) {
    this.edit = event;
  }

  loadingChange(event) {
    this.loading = event;
  }

  alertsChange(event) {
    this.alerts = event;
  }

  ngOnInit() {
    this.titleService.setTitle('New Animal');
    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      if (this.activatedRoute.snapshot.params.id) {
        this.animalId = this.activatedRoute.snapshot.params.id;
        this.edit = false;
      }
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

}
