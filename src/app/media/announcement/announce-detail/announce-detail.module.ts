import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnounceDetailPageRoutingModule } from './announce-detail-routing.module';

import { AnnounceDetailPage } from './announce-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnounceDetailPageRoutingModule
  ],
  declarations: [AnnounceDetailPage]
})
export class AnnounceDetailPageModule {}
