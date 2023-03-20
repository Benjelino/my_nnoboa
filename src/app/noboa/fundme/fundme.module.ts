import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsPageModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';
import { NoboaPageModule } from "../noboa.module";
import { FundmePageRoutingModule } from './fundme-routing.module';
import { FundmePage } from './fundme.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FundmePageRoutingModule,
    NoboaPageModule,
    ComponentsPageModule,
    ReactiveFormsModule,
    QuillModule
  ],
  declarations: [FundmePage]
})
export class FundmePageModule { }
