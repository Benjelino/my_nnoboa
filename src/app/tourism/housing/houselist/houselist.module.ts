import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HouselistPageRoutingModule } from "./houselist-routing.module";

import { HouselistPage } from "./houselist.page";
import { ComponentsPageModule } from "src/app/components/components.module";
import { HousedataformComponentModule } from "../housedataform/housedataform.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    HousedataformComponentModule,
    HouselistPageRoutingModule,
  ],
  declarations: [HouselistPage],
})
export class HouselistPageModule {}
