import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatContactsPage } from './chat-contacts.page';

const routes: Routes = [
  {
    path: '',
    component: ChatContactsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatContactsPageRoutingModule {}
