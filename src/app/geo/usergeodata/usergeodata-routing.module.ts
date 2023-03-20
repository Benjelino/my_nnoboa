import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsergeodataPage } from './usergeodata.page';

const routes: Routes = [
  {
    path: '',
    component: UsergeodataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsergeodataPageRoutingModule {}
