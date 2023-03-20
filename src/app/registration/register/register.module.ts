import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { RecaptchaModule } from "ng-recaptcha";

import { TranslateModule } from "@ngx-translate/core";

import { TermsOfServicePage } from "../../components/terms-of-service/terms-of-service.page";
import { PrivacyPolicyPage } from "../../components/privacy-policy/privacy-policy.page";

import { RegisterPage } from "./register.page";

import {
  Appheader,
  ComponentsPageModule,
} from "../../components/components.module";
import { ToastComponent } from "src/app/components/toastComponent";
import { IonicSelectableModule } from "ionic-selectable";

const routes: Routes = [
  {
    path: "",
    component: RegisterPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsPageModule,
    TranslateModule.forChild(),
    RecaptchaModule,
    IonicSelectableModule,
  ],
  providers: [ToastComponent],
  entryComponents: [Appheader, TermsOfServicePage, PrivacyPolicyPage],
  declarations: [RegisterPage],
})
export class RegisterPageModule {}
