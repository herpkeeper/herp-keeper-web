import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAuthGuard } from './admin-auth.guard';

const routes: Routes = [
  { path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canLoad: [AdminAuthGuard]
  },
  { path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canLoad: [AdminAuthGuard]
  },
  { path: 'profiles',
    loadChildren: () => import('./profiles/profiles.module').then(m => m.ProfilesModule),
    canLoad: [AdminAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
