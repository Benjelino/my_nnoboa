import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HousepreflistPage } from './housepreflist.page';

const routes: Routes = [
  {
    path: '',
    component: HousepreflistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HousepreflistPageRoutingModule {}
