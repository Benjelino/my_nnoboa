import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UsergeodataPageRoutingModule } from "./usergeodata-routing.module";

import { UsergeodataPage } from "./usergeodata.page";
import { GeoDataPageModule } from "../geo-data/geo-data.module";
import { ComponentsPageModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsergeodataPageRoutingModule,
    GeoDataPageModule,
    ComponentsPageModule,
  ],
  declarations: [UsergeodataPage],
})
export class UsergeodataPageModule {}
