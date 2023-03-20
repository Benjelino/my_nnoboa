import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import {
  ComponentsPageModule,
  Appheader,
} from "../../components/components.module";

import { ChangePasswordPage } from "./change-password.page";
import { ToastComponent } from "src/app/components/toastComponent";

const routes: Routes = [
  {
    path: "",
    component: ChangePasswordPage,
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
    ],
    providers: [ToastComponent],
    declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
