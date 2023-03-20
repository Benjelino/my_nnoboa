import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestiondetailPage } from './questiondetail.page';

const routes: Routes = [
  {
    path: '',
    component: QuestiondetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestiondetailPageRoutingModule {}
