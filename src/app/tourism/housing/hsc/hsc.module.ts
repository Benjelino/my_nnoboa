import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HscComponent } from "./hsc.component";
import { GeoModule } from "src/app/geo/geo-component/geo.module";
import { IonicSelectableModule } from "ionic-selectable";
import { ComponentsPageModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeoModule,
    ReactiveFormsModule,
    ComponentsPageModule,
    IonicSelectableModule,
  ],
  declarations: [HscComponent],
  exports: [HscComponent],
})
export class HscComponentModule {}
