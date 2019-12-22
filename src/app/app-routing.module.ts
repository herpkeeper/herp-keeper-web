import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '@app/home';
import { ForbiddenComponent } from '@app/core';
import { NotFoundComponent } from '@app/core';

const routes: Routes = [
  { path: 'home',
    component: HomeComponent
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  { path: 'activate-account',
    loadChildren: () => import('./activate-account/activate-account.module').then(m => m.ActivateAccountModule)
  },
  { path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'member',
    loadChildren: () => import('./member/member.module').then(m => m.MemberModule)
  },
  { path: '403', component: ForbiddenComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
