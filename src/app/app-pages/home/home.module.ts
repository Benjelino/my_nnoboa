import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import {
  Appheader,
  ComponentsPageModule,
} from "../../components/components.module";

import { NoboaPageModule } from "../../noboa/noboa.module";

import { HomePage } from "./home.page";

import { PipesModule } from "src/app/base-services/pipes/pipes.module";
import { GeoModule } from "src/app/geo/geo-component/geo.module";

@NgModule({
  entryComponents: [Appheader],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReactiveFormsModule,
    ComponentsPageModule,
    NoboaPageModule,
    GeoModule,
    RouterModule.forChild([
      {
        path: "",
        component: HomePage,
      },
    ]),
    TranslateModule.forChild(),
  ],
  providers: [],
  declarations: [HomePage],
})
export class HomePageModule {}
