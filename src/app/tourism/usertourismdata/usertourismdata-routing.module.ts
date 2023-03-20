import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsertourismdataPage } from './usertourismdata.page';

const routes: Routes = [
  {
    path: '',
    component: UsertourismdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsertourismdataPageRoutingModule {}
