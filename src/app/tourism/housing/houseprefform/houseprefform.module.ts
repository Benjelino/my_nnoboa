import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HouseprefformComponent } from "./houseprefform.component";
import { IonicSelectableModule } from "ionic-selectable";
import { ComponentsPageModule } from "src/app/components/components.module";
import { GeoModule } from "src/app/geo/geo-component/geo.module";

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
  declarations: [HouseprefformComponent],
  exports: [HouseprefformComponent],
})
export class HouseprefformComponentModule {}
