import { Component, OnInit } from '@angular/core';

import { TitleService } from '@app/core';

@Component({
  selector: 'herp-keeper-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Home');
  }

}
