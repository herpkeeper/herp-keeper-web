import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberAuthGuard } from '../member-auth.guard';
import { SpeciesComponent } from './species.component';

const routes: Routes = [
  { path: '',
    component: SpeciesComponent,
    canActivate: [MemberAuthGuard]
  },
  { path: ':id',
    component: SpeciesComponent,
    canActivate: [MemberAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeciesRoutingModule { }
