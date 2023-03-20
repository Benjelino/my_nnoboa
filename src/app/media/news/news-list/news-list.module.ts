import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { NewsListPageRoutingModule } from "./news-list-routing.module";

import { NewsListPage } from "./news-list.page";
import { Appheader, ComponentsPageModule } from "src/app/components/components.module";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        ReactiveFormsModule,
        PipesModule,
        NewsListPageRoutingModule,
    ],
    declarations: [NewsListPage]
})
export class NewsListPageModule {}
