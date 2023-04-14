import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsPageModule } from 'src/app/components/components.module';
import { CompaniesPageRoutingModule } from './companies-routing.module';
import { CompaniesPage } from './companies.page';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    CompaniesPageRoutingModule
  ],
  declarations: [CompaniesPage]
})
export class CompaniesPageModule {}
