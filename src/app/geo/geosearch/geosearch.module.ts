import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicSelectableModule } from 'ionic-selectable';

import {  ComponentsPageModule } from 'src/app/components/components.module';

import { GeoService } from '../services/geo.service';
import { GeosearchComponent } from './geosearch.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GeoUpdateFormModule } from '../geoupdateform/geoupdateform.module';

export { GeosearchComponent }


@NgModule({
    declarations: [
        GeosearchComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicSelectableModule,
        ComponentsPageModule,
        ScrollingModule, GeoUpdateFormModule
    ],
    providers: [GeoService],
    exports: [GeosearchComponent]
})
export class GeoSearchModule { }