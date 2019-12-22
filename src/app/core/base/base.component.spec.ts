import { BaseComponent } from './base.component';

import { Alert } from '@app/shared';

describe('BaseComponent', () => {

  let component: BaseComponent;

  beforeEach(() => {
    component = new BaseComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });

  it('should close alert', () => {
    expect(component.alerts.length).toBe(0);
    const alert: Alert = { type: 'warning', message: 'message' };
    component.alerts.push(alert);
    expect(component.alerts.length).toBe(1);
    component.closeAlert(alert);
    expect(component.alerts.length).toBe(0);
  });

});
