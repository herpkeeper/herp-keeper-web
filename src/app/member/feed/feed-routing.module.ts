import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberAuthGuard } from '../member-auth.guard';
import { FeedComponent } from './feed.component';

const routes: Routes = [
  { path: '',
    component: FeedComponent,
    canActivate: [MemberAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedRoutingModule { }
