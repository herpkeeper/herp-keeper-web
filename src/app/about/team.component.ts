import { Component, OnInit } from '@angular/core';

import { TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  constructor(private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Our Team');
  }

}
