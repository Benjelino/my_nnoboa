import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { GeoDataPageRoutingModule } from "./geo-data-routing.module";

import { GeoDataPage } from "./geo-data.page";
import { ComponentsPageModule } from "src/app/components/components.module";
import { GeoUpdateFormModule } from "../geoupdateform/geoupdateform.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GeoDataPageRoutingModule,
        ComponentsPageModule,
        ScrollingModule,
        ReactiveFormsModule,
        GeoUpdateFormModule,
    ],
    declarations: [GeoDataPage],
    exports: [GeoDataPage]
})
export class GeoDataPageModule {}
