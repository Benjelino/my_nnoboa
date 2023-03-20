import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TranslateModule } from "@ngx-translate/core";

import {
  Appheader,
  ComponentsPageModule,
} from "../../components/components.module";
import {
  ThomePage,
  Tlogin,
  ComponentsAuthPageModule,
} from "../../components-auth/components.auth.module";

import { LoginPage } from "./login.page";

export { LoginPage };

const routes: Routes = [
  {
    path: "",
    component: LoginPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    ComponentsAuthPageModule,
    ComponentsPageModule,
  ],
  declarations: [LoginPage],
  entryComponents: [Appheader, ThomePage, Tlogin],
})
export class LoginPageModule {}
