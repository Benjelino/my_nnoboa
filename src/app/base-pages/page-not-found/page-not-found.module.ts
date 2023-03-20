import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PageNotFoundPage } from './page-not-found.page';
import { Appheader,ComponentsPageModule } from '../../components/components.module';


const routes: Routes = [
  {
    path: '',
    component: PageNotFoundPage
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
    declarations: [PageNotFoundPage]
})
export class PageNotFoundPageModule {}
