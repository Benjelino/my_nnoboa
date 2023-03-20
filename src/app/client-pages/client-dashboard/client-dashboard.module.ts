import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { StarRatingModule } from "src/app/recommendation/star-rating/star-rating.module";
import {
  Appheader,
  ComponentsPageModule,
} from "src/app/components/components.module";

import { ClientRequestsService } from "src/app/service-request/services/clientrequests-service";

import { ClientDashboardPage } from "./client-dashboard.page";
import { NgChatModule } from "ng-chat";
import { RateClientPageModule } from "src/app/recommendation/rate-client/rate-client.module";
import { RateProviderPageModule } from "src/app/recommendation/rate-provider/rate-provider.module";
import { ReplyRatingModule } from "src/app/recommendation/reply-rating/reply-rating.module";
import { ProviderRequestsService } from "src/app/service-request/services/providerrequests-service";
import { ClientBidUpdateComponent } from "../client-bid-update/client-bid-update.component";
import { ClientBidUpdateComponentModule } from "../client-bid-update/client-bid-update.module";
import { ContractActionComponentModule } from "src/app/service-request/contract-action/contract-action.module";

const routes: Routes = [
  {
    path: "",
    component: ClientDashboardPage,
  },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NgChatModule,
        ComponentsPageModule,
        StarRatingModule,
        RateProviderPageModule,
        ClientBidUpdateComponentModule,
        ContractActionComponentModule,
        ReplyRatingModule,
        RouterModule.forChild(routes),
    ],
    providers: [ClientRequestsService, ProviderRequestsService],
    declarations: [ClientDashboardPage]
})
export class ClientDashboardPageModule {}
