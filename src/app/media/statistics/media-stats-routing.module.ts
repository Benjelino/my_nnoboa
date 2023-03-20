import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaStatsPage } from './media-stats.page';

const routes: Routes = [
  {
    path: '',
    component: MediaStatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaStatsPageRoutingModule {}
