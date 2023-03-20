import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";


import { NewsDetailPageRoutingModule } from "./news-detail-routing.module";

import { NewsDetailPage } from "./news-detail.page";
import { ComponentsPageModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";
import { TributeComponentModule } from "../../tributes/tribute/tribute.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NewsDetailPageRoutingModule,
    ComponentsPageModule,TributeComponentModule
  ],
  declarations: [NewsDetailPage],
})
export class NewsDetailPageModule {}
