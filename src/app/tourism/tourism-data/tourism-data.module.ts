import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TourismDataPageRoutingModule } from "./tourism-data-routing.module";

import { TourismDataPage } from "./tourism-data.page";
import { IonicSelectableModule } from "ionic-selectable";
import { ComponentsPageModule } from "src/app/components/components.module";
import { GeoModule } from "src/app/geo/geo-component/geo.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { TourdataupdateformComponent } from "../tourdataupdateform/tourdataupdateform.component";
import { TourUpdateFormModule } from "../tourdataupdateform/tourdataupdateform.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        IonicSelectableModule,
        GeoModule,
        TourUpdateFormModule,
        ComponentsPageModule,
        ScrollingModule,
    ],
    declarations: [TourismDataPage],
    exports: [TourismDataPage]
})
export class TourismDataPageModule {}
