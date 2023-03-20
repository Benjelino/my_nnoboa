import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ChatPrefPageRoutingModule } from "./chat-pref-routing.module";

import { ChatPrefPage } from "./chat-pref.page";
import { Appheader, ComponentsPageModule } from "src/app/components/components.module";
import { ToastComponent } from "src/app/components/toastComponent";

/* import {
  Appheader,
  ComponentsPageModule,
} from "../../../components/components.module"; */
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        ChatPrefPageRoutingModule,
    ],
    providers: [ToastComponent],
    declarations: [ChatPrefPage]
})
export class ChatPrefPageModule {}
