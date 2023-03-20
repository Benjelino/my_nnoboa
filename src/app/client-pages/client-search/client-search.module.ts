import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Appheader, ComponentsPageModule } from 'src/app/components/components.module';
import { ClientSearchPage } from './client-search.page';

const routes: Routes = [
  {
    path: '',
    component: ClientSearchPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ClientSearchPage]
})
export class ClientSearchPageModule {}
