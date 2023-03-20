import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EventPageRoutingModule } from "./event-routing.module";

import { EventPage } from "./event.page";
import { ToastComponent } from "src/app/components/toastComponent";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    PipesModule,
    EventPageRoutingModule,
  ],
  providers: [ToastComponent],
  declarations: [EventPage],
})
export class EventPageModule {}
