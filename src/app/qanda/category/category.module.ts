import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryPageRoutingModule } from './category-routing.module';

import { CategoryPage } from './category.page';

import { ToastComponent } from 'src/app/components/toastComponent';
import { ComponentsPageModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/base-services/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PipesModule,
    CategoryPageRoutingModule,
   ComponentsPageModule,
  ],providers: [
    ToastComponent
],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
