import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HousepreflistPageRoutingModule } from "./housepreflist-routing.module";

import { HousepreflistPage } from "./housepreflist.page";
import { ComponentsPageModule } from "src/app/components/components.module";
import { HouseprefformComponentModule } from "../houseprefform/houseprefform.module";
import { HscComponentModule } from "../hsc/hsc.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    HouseprefformComponentModule,
    HousepreflistPageRoutingModule,

HscComponentModule
  ],
  declarations: [HousepreflistPage],
})
export class HousepreflistPageModule {}
