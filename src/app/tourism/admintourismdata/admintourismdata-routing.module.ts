import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmintourismdataPage } from './admintourismdata.page';

const routes: Routes = [
  {
    path: '',
    component: AdmintourismdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmintourismdataPageRoutingModule {}
