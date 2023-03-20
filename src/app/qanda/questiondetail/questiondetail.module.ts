import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestiondetailPageRoutingModule } from './questiondetail-routing.module';

import { QuestiondetailPage } from './questiondetail.page';

import { QuillModule } from 'ngx-quill';
import { ComponentsPageModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/base-services/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestiondetailPageRoutingModule,
    ComponentsPageModule,
   ReactiveFormsModule,PipesModule,   QuillModule.forRoot()
  ],
  declarations: [QuestiondetailPage]
})
export class QuestiondetailPageModule {}
