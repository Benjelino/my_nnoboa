import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionlistPageRoutingModule } from './questionlist-routing.module';

import { QuestionlistPage } from './questionlist.page';
import { ComponentsPageModule } from 'src/app/components/components.module';

import { QuillModule } from 'ngx-quill';
import { IonicSelectableModule } from 'ionic-selectable';
import { PipesModule } from 'src/app/base-services/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    QuestionlistPageRoutingModule,
    ComponentsPageModule,
   ReactiveFormsModule,PipesModule, IonicSelectableModule,
   QuillModule.forRoot()
  ],
  declarations: [QuestionlistPage]
})
export class QuestionlistPageModule {}
