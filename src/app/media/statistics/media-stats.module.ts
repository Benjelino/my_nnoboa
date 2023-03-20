import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Appheader, ComponentsPageModule } from 'src/app/components/components.module';

import { MediaStatsPageRoutingModule } from './media-stats-routing.module';

import { MediaStatsPage } from './media-stats.page';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        MediaStatsPageRoutingModule
    ],
    declarations: [MediaStatsPage]
})
export class MediaStatsPageModule { }
