import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CommentsPageRoutingModule } from "./comments-routing.module";

import { CommentsPage } from "./comments.page";
import { ToastComponent } from "../../components/toastComponent";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PipesModule,
    CommentsPageRoutingModule,
  ],
  providers: [ToastComponent],

  declarations: [CommentsPage],
})
export class CommentsPageModule {}
