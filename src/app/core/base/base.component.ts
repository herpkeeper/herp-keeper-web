import { Input } from '@angular/core';

import { Alert } from '@app/shared';

export class BaseComponent {

  @Input()
  public alerts: Array<Alert> = [];

  @Input()
  public loading = false;

  public closeAlert(alert: Alert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

}
