import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'herp-keeper-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  title = 'Confirm';
  body = 'Are you sure?';

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
