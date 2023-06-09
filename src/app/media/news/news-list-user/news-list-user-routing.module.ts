import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsListUserPage } from './news-list-user.page';

const routes: Routes = [
  {
    path: '',
    component: NewsListUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsListUserPageRoutingModule {}
