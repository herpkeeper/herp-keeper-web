import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { BaseComponent, ProfileStoreService, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  profile$: any;

  constructor(private activatedRoute: ActivatedRoute,
              private profileStoreService: ProfileStoreService,
              private titleService: TitleService) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle('Dashboard');

    this.loading = true;
    const loading$ = this.activatedRoute.data.pipe(switchMap((data) => data.loading));
    loading$.subscribe(res => {
      this.profile$ = this.profileStoreService.profile$;
      this.loading = false;
    }, err => {
      this.alerts.push({type: 'danger', message: 'Failed to load profile'});
      this.loading = false;
    });
  }

}
