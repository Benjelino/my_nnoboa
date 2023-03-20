import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HouselistPage } from './houselist.page';

const routes: Routes = [
  {
    path: '',
    component: HouselistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HouselistPageRoutingModule {}
