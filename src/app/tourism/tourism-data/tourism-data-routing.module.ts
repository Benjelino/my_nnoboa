import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TourismDataPage } from './tourism-data.page';

const routes: Routes = [
  {
    path: '',
    component: TourismDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TourismDataPageRoutingModule {}
