import { Component, OnInit } from '@angular/core';

import { BaseComponent, TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(private titleService: TitleService) {
    super();
  }

  ngOnInit() {
    this.titleService.setTitle('Dashboard');
  }

}
