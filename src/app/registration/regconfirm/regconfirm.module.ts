import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Appheader, ComponentsPageModule } from 'src/app/components/components.module';

import { RegconfirmPageRoutingModule } from './regconfirm-routing.module';

import { RegconfirmPage } from './regconfirm.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        RegconfirmPageRoutingModule
    ],
    declarations: [RegconfirmPage]
})
export class RegconfirmPageModule {}
