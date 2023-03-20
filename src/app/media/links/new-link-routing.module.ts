import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewLinkPage } from './new-link.page';

const routes: Routes = [
  {
    path: '',
    component: NewLinkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLinkPageRoutingModule {}
