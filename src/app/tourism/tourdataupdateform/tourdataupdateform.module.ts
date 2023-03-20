import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ComponentsPageModule } from "src/app/components/components.module";

import { TourdataupdateformComponent } from "./tourdataupdateform.component";
import { GeoModel } from "src/app/base-services/common-service/models/common-model.service";
import { GeoModule } from "src/app/geo/geo-component/geo.module";
import { IonicSelectableModule } from "ionic-selectable";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
export { TourdataupdateformComponent };
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        ReactiveFormsModule,
        IonicSelectableModule,
        GeoModule
    ],
    declarations: [TourdataupdateformComponent],
    exports: [TourdataupdateformComponent],
    providers: [RemoteService]
})
export class TourUpdateFormModule {}
