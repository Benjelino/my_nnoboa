import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactusinfoPage } from './contactusinfo.page';

const routes: Routes = [
  {
    path: '',
    component: ContactusinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactusinfoPageRoutingModule {}
