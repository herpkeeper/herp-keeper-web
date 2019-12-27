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
  },
  { path: 'species',
    loadChildren: () => import('./species/species.module').then(m => m.SpeciesModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'spp',
    loadChildren: () => import('./species-list/species-list.module').then(m => m.SpeciesListModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'animal',
    loadChildren: () => import('./animal/animal.module').then(m => m.AnimalModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'animals',
    loadChildren: () => import('./animals/animals.module').then(m => m.AnimalsModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'images',
    loadChildren: () => import('./images/images.module').then(m => m.ImagesModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  },
  { path: 'feed',
    loadChildren: () => import('./feed/feed.module').then(m => m.FeedModule),
    canLoad: [MemberAuthGuard],
    resolve: { loading: ProfileResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
