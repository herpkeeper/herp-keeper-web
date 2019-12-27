import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberAuthGuard } from '../member-auth.guard';
import { SpeciesListComponent } from './species-list.component';

const routes: Routes = [
  { path: '',
    component: SpeciesListComponent,
    canActivate: [MemberAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeciesListRoutingModule { }
