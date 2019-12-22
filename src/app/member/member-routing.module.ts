import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileResolverService } from '@app/core';
import { MemberAuthGuard } from './member-auth.guard';

const routes: Routes = [
  { path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
