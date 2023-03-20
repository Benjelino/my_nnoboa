import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicSelectableModule } from 'ionic-selectable';

import { Appheader, ComponentsPageModule } from 'src/app/components/components.module';

import { GeoComponent } from './geo.component';
import { GeoService } from '../services/geo.service';

export { GeoComponent }


@NgModule({
    declarations: [
        GeoComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicSelectableModule,
        ComponentsPageModule,
    ],
    providers: [GeoService],
    exports: [GeoComponent]
})
export class GeoModule { }