
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsListUserPageRoutingModule } from './news-list-user-routing.module';

import { NewsListUserPage } from './news-list-user.page';
import { ComponentsPageModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/base-services/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    ReactiveFormsModule,
    PipesModule,
    NewsListUserPageRoutingModule
  ],
  declarations: [NewsListUserPage]
})
export class NewsListUserPageModule {}
