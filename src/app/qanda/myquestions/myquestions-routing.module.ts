import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyquestionsPage } from './myquestions.page';

const routes: Routes = [
  {
    path: '',
    component: MyquestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyquestionsPageRoutingModule {}
