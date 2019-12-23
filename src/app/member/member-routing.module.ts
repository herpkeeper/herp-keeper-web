import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileResolverService } from '@app/core';
import { MemberAuthGuard } from './member-auth.guard';

const routes: Routes = [
  { path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'location',
    loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'locations',
    loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
