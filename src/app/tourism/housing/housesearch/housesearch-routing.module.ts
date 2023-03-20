import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HousesearchPage } from './housesearch.page';

const routes: Routes = [
  {
    path: '',
    component: HousesearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HousesearchPageRoutingModule {}
