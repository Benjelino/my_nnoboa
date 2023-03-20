import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegconfirmPage } from './regconfirm.page';

const routes: Routes = [
  {
    path: '',
    component: RegconfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegconfirmPageRoutingModule {}
