import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ClientBidUpdateComponent } from "./client-bid-update.component";
import {
  Appheader,
  ComponentsPageModule,
} from "src/app/components/components.module";
import { StarRatingModule } from "src/app/recommendation/star-rating/star-rating.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ComponentsPageModule,
        StarRatingModule,
    ],
    declarations: [ClientBidUpdateComponent],
    exports: [ClientBidUpdateComponent]
})
export class ClientBidUpdateComponentModule {}
