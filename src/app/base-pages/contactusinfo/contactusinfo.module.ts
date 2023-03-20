import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ContactusinfoPageRoutingModule } from "./contactusinfo-routing.module";

import { ContactusinfoPage } from "./contactusinfo.page";
import {
  Appheader,
  ComponentsPageModule,
} from "../../components/components.module";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        ComponentsPageModule,
        ContactusinfoPageRoutingModule,
    ],
    declarations: [ContactusinfoPage]
})
export class ContactusinfoPageModule {}
