import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ClientPage } from "./client.page";
import { GeoModule } from "src/app/geo/geo-component/geo.module";
import { ProviderRegistrationService } from "src/app/service-request/services/providerregistration-service";

const routes: Routes = [
  {
    path: "",
    component: ClientPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/client-pages/client-dashboard/client-dashboard.module"
              ).then((m) => m.ClientDashboardPageModule),
          },
        ],
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/service-request/client-request/service-request.module"
              ).then((m) => m.ServiceRequestPageModule),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../client-search/client-search.module").then(
                (m) => m.ClientSearchPageModule
              ),
          },
        ],
      },

      {
        path: "tab4",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/media/client-media-stats/media-stats.module"
              ).then((m) => m.MediaStatsPageModule),
          },
        ],
      },

      {
        path: "tab5",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/recommendation/rate-media/rate-media.module"
              ).then((m) => m.RateMediaPageModule),
          },
        ],
      },
      /*   {
        path: "tab6",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/recommendation/rate-provider/rate-provider.module"
              ).then((m) => m.RateProviderPageModule),
          },
        ],
      }, */

      {
        path: "tab7",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/service-request/client-request-fs/service-request-fs.module"
              ).then((m) => m.ServiceRequestFsPageModule),
          },
        ],
      },

      {
        path: "tab8",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "src/app/service-request/client-request-comm/service-request-comm.module"
              ).then((m) => m.ServiceRequestCommPageModule),
          },
        ],
      },

      {
        path: "",
        redirectTo: "/menu/client/tab1",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeoModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ClientPage],
  providers: [ProviderRegistrationService],
})
export class ClientPageModule {}
