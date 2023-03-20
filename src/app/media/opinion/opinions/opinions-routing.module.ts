import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpinionsPage } from './opinions.page';

const routes: Routes = [
  {
    path: '',
    component: OpinionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpinionsPageRoutingModule {}
