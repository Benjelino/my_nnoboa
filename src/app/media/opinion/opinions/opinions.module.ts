import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OpinionsPageRoutingModule } from "./opinions-routing.module";

import { OpinionsPage } from "./opinions.page";

import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";
import { ComponentsPageModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    ReactiveFormsModule,
    PipesModule,
    OpinionsPageRoutingModule,
  ],
  declarations: [OpinionsPage],
})
export class OpinionsPageModule {}
