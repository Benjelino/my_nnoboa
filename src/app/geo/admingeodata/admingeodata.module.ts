import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AdmingeodataPageRoutingModule } from "./admingeodata-routing.module";

import { AdmingeodataPage } from "./admingeodata.page";
import { GeoDataPageModule } from "../geo-data/geo-data.module";
import { ComponentsPageModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmingeodataPageRoutingModule,
    GeoDataPageModule,
    ComponentsPageModule,
  ],
  declarations: [AdmingeodataPage],
})
export class AdmingeodataPageModule {}
