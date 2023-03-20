import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ComponentsPageModule, Appheader } from '../../components/components.module';

import { ForgotPage } from './forgot.page';
import { ToastComponent } from 'src/app/components/toastComponent';

const routes: Routes = [
  {
    path: '',
    component: ForgotPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ComponentsPageModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes)
    ],
    providers: [ToastComponent],
    declarations: [ForgotPage]
})
export class ForgotPageModule {}
