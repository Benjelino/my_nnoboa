import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnlistPage } from './annlist.page';

const routes: Routes = [
  {
    path: '',
    component: AnnlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnlistPageRoutingModule {}
