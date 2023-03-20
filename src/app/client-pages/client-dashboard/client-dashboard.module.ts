import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Appheader, ComponentsPageModule } from '../../components/components.module';

import { ClientDashboardPage } from './client-dashboard.page';
import { NgChatModule } from 'ng-chat';

const routes: Routes = [
  {
    path: '', component: ClientDashboardPage,
  }
];

@NgModule({
  entryComponents: [
      Appheader
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgChatModule,
    ComponentsPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClientDashboardPage]
})
export class ClientDashboardPageModule {}
