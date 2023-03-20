import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TranslateModule } from "@ngx-translate/core";

import { IonicSelectableModule } from "ionic-selectable";

import {
  Appheader,
  ComponentsPageModule,
} from "../../components/components.module";
import { ToastComponent } from "src/app/components/toastComponent";

import { ToursearchComponent } from "./toursearch.component";

export { ToursearchComponent };

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ComponentsPageModule,
        IonicSelectableModule,
    ],
    exports: [ToursearchComponent],
    providers: [ToastComponent],
    declarations: [ToursearchComponent]
})
export class ToursearchModule {}
