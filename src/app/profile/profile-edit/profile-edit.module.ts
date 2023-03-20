import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { IonicSelectableModule } from "ionic-selectable";

import { ComponentsPageModule } from "../../components/components.module";

import { ProfileEditPage } from "./profile-edit.page";
import { GeoModule } from "src/app/geo/geo-component/geo.module";

export { ProfileEditPage };

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        IonicSelectableModule,
        ComponentsPageModule,
        GeoModule,
    ],
    providers: [],
    declarations: [ProfileEditPage],
    exports: [ProfileEditPage]
})
export class ProfileEditPageModule {}
