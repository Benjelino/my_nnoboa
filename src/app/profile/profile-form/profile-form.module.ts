import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { IonicSelectableModule } from 'ionic-selectable';


import {
  ComponentsPageModule,
  Appheader,
  ExpandableComponent,
} from "../../components/components.module";

import { ProfileFormPage } from "./profile-form.page";
import { DataConfigService } from "src/app/base-services/common-service/config-service";
import { ProfileEditPageModule } from "../profile-edit/profile-edit.module";

export { ProfileFormPage }

const routes: Routes = [
  {
    path: "",
    component: ProfileFormPage,
  },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        IonicSelectableModule,
        ComponentsPageModule,
        ProfileEditPageModule
    ],
    providers: [DataConfigService],
    declarations: [ProfileFormPage],
    exports: [ProfileFormPage]
})
export class ProfileFormPageModule {}
