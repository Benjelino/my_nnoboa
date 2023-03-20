import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmingeodataPage } from './admingeodata.page';

const routes: Routes = [
  {
    path: '',
    component: AdmingeodataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmingeodataPageRoutingModule {}
