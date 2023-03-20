import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ComponentsPageModule } from "src/app/components/components.module";

import { MenuPage } from "./menu.page";


const routes: Routes = [
  { path: "", redirectTo: "/menu/home", pathMatch: "full" },

  {
    path: "",
    component: MenuPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("src/app/app-pages/home/home.module").then(
            (m) => m.HomePageModule
          ),
      },

      {
        path: "change-password",
        loadChildren: () =>
          import(
            "src/app/components-auth/change-password/change-password.module"
          ).then((m) => m.ChangePasswordPageModule),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("src/app/profile/profile/profile.module").then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: "profile-form",
        loadChildren: () =>
          import("src/app/profile/profile-form/profile-form.module").then(
            (m) => m.ProfileFormPageModule
          ),
      },
      {
        path: "client-dashboard",
        loadChildren: () =>
          import(
            "src/app/client-pages/client-dashboard/client-dashboard.module"
          ).then((m) => m.ClientDashboardPageModule),
      },

      {
        path: "contactus",
        loadChildren: () =>
          import("src/app/base-pages/contactus/contactus.module").then(
            (m) => m.ContactusPageModule
          ),
      },
      {
        path: "contactusinfo",
        loadChildren: () =>
          import("src/app/base-pages/contactusinfo/contactusinfo.module").then(
            (m) => m.ContactusinfoPageModule
          ),
      },
      {
        path: "fundme",
        loadChildren: () =>
          import("src/app/noboa/fundme/fundme.module").then(
            (m) => m.FundmePageModule
          ),
      }
    ],
  },
];

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    RouterModule.forChild(routes),
  ],
  declarations: [MenuPage],
})
export class MenuPageModule { }
