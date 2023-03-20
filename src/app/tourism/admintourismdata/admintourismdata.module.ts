import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AdmintourismdataPageRoutingModule } from "./admintourismdata-routing.module";

import { AdmintourismdataPage } from "./admintourismdata.page";
import { ComponentsPageModule } from "src/app/components/components.module";
import { TourismDataPageModule } from "../tourism-data/tourism-data.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmintourismdataPageRoutingModule,
    ComponentsPageModule,
    TourismDataPageModule,
  ],
  declarations: [AdmintourismdataPage],
})
export class AdmintourismdataPageModule {}
