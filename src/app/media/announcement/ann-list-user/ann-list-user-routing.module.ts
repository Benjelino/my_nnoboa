import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnListUserPage } from './ann-list-user.page';

const routes: Routes = [
  {
    path: '',
    component: AnnListUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnListUserPageRoutingModule {}
