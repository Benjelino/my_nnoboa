import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsertourismdataPageRoutingModule } from './usertourismdata-routing.module';

import { UsertourismdataPage } from './usertourismdata.page';
import { TourismDataPageModule } from '../tourism-data/tourism-data.module';
import { ComponentsPageModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TourismDataPageModule,
    UsertourismdataPageRoutingModule,ComponentsPageModule
  ],
  declarations: [UsertourismdataPage]
})
export class UsertourismdataPageModule {}
