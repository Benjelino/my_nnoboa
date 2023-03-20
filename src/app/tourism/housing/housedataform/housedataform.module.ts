import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HousedataformComponent } from "./housedataform.component";
import { IonicSelectableModule } from "ionic-selectable";
import { GeoModule } from "src/app/geo/geo-component/geo.module";

import { ComponentsPageModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    ComponentsPageModule,
    GeoModule,
  ],
  declarations: [HousedataformComponent],
  exports: [HousedataformComponent],
})
export class HousedataformComponentModule {}
