import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HousesearchPageRoutingModule } from "./housesearch-routing.module";

import { HousesearchPage } from "./housesearch.page";
import { IonicSelectableModule } from "ionic-selectable";
import { ComponentsPageModule } from "src/app/components/components.module";
import { GeoModule } from "src/app/geo/geo-component/geo.module";
import { HscComponentModule } from "../hsc/hsc.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HousesearchPageRoutingModule,
   
    ComponentsPageModule,
HscComponentModule
  ],
  declarations: [HousesearchPage],
})
export class HousesearchPageModule {}
