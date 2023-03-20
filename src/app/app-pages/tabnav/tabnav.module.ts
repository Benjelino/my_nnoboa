import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { Routes, RouterModule } from "@angular/router";

import { TabnavPage } from "./tabnav.page";

const routes: Routes = [
  { path: "", redirectTo: "/tabnav/home", pathMatch: "full" },

  {
    path: "",
    component: TabnavPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("src/app/app-pages/home/home.module").then(
            (m) => m.HomePageModule
          ),
      },

      {
        path: "register",
        loadChildren: () =>
          import("src/app/registration/register/register.module").then(
            (m) => m.RegisterPageModule
          ),
      },

      {
        path: "login",
        loadChildren: () =>
          import("../../app-pages/login/login.module").then(
            (m) => m.LoginPageModule
          ),
      },
      
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TabnavPage],
})
export class TabnavPageModule {}
