import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberAuthGuard } from '../member-auth.guard';
import { AnimalsComponent } from './animals.component';

const routes: Routes = [
  { path: '',
    component: AnimalsComponent,
    canActivate: [MemberAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalsRoutingModule { }
