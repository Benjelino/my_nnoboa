import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AuthGuardService } from "src/app/auth/auth-service/auth-guard.service";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },

  {
    path: "home",
    loadChildren: () =>
      import("src/app/app-pages/home/home.module").then(
        (m) => m.HomePageModule
      ),
  },

  {
    path: "menu",
    loadChildren: () =>
      import("src/app/app-pages/menu/menu.module").then(
        (m) => m.MenuPageModule
      ),
    canActivate: [AuthGuardService],
  },

  {
    path: "register",
    loadChildren: () =>
      import("src/app/registration/register/register.module").then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'regconfirm',
    loadChildren: () => import('src/app/registration/regconfirm/regconfirm.module').then(m => m.RegconfirmPageModule)
  },

  {
    path: "login",
    loadChildren: () =>
      import("src/app/app-pages/login/login.module").then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: "contactus",
    loadChildren: () =>
      import("src/app/base-pages/contactus/contactus.module").then(
        (m) => m.ContactusPageModule
      ),
  },
  {
    path: "forgot",
    loadChildren: () =>
      import("src/app/components-auth/forgot/forgot.module").then(
        (m) => m.ForgotPageModule
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
    loadChildren: () => import("src/app/noboa/fundme/fundme.module").then(
      (m) => m.FundmePageModule
    ),
  },
  {
    path: "**",
    loadChildren: () =>
      import("src/app/base-pages/page-not-found/page-not-found.module").then(
        (m) => m.PageNotFoundPageModule
      ),
  },
  {
    path: 'companies',
    loadChildren: () => import('./noboa/companies/companies.module').then( m => m.CompaniesPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
