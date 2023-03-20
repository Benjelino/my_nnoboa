import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPrefPage } from './chat-pref.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPrefPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPrefPageRoutingModule {}
