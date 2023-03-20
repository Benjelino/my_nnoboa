import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ContactusPageRoutingModule } from "./contactus-routing.module";

import { ContactusPage } from "./contactus.page";
import { RecaptchaModule } from "ng-recaptcha";
import {
  Appheader,
  ComponentsPageModule,
} from "../../components/components.module";
import { ToastComponent } from "../../components/toastComponent";
import { IonicSelectableModule } from "ionic-selectable";
import { NoboaPageModule } from "src/app/noboa/noboa.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        ComponentsPageModule,
        NoboaPageModule,
        ContactusPageRoutingModule,
        RecaptchaModule, IonicSelectableModule
    ],
    providers: [ToastComponent],
    declarations: [ContactusPage]
})
export class ContactusPageModule {}
