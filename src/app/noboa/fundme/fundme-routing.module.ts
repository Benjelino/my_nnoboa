import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FundmePage } from './fundme.page';

const routes: Routes = [
  {
    path: '',
    component: FundmePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundmePageRoutingModule {}
