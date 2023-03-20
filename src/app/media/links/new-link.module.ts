import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { NewLinkPageRoutingModule } from "./new-link-routing.module";

import { NewLinkPage } from "./new-link.page";
import { ToastComponent } from "../../components/toastComponent";
import { IonicSelectableModule } from "ionic-selectable";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PipesModule,
    IonicSelectableModule,
    NewLinkPageRoutingModule,
  ],
  providers: [ToastComponent],

  declarations: [NewLinkPage],
})
export class NewLinkPageModule {}
