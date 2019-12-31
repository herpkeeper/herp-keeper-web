import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAuthGuard } from '../admin-auth.guard';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '',
    component: ProfileComponent,
    canActivate: [AdminAuthGuard]
  },
  { path: ':id',
    component: ProfileComponent,
    canActivate: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
