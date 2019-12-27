import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberAuthGuard } from '../member-auth.guard';
import { AnimalComponent } from './animal.component';

const routes: Routes = [
  { path: '',
    component: AnimalComponent,
    canActivate: [MemberAuthGuard]
  },
  { path: ':id',
    component: AnimalComponent,
    canActivate: [MemberAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalRoutingModule { }
