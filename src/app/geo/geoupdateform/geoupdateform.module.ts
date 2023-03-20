import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ComponentsPageModule } from "src/app/components/components.module";
import { GeoupdateformComponent } from "./geoupdateform.component";
import { GeoModule } from "../geo-component/geo.module";
import { GeoService } from "../services/geo.service";
import { IonicSelectableModule } from "ionic-selectable";
export { GeoupdateformComponent };
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        ReactiveFormsModule,
        IonicSelectableModule,
        GeoModule,
    ],
    declarations: [GeoupdateformComponent],
    exports: [GeoupdateformComponent],
    providers: [GeoService]
})
export class GeoUpdateFormModule {}
