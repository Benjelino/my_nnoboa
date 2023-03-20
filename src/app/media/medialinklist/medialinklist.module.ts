import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { MedialinklistComponent } from "./medialinklist.component";
import {
  Appheader,
  ComponentsPageModule,
} from "src/app/components/components.module";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, ComponentsPageModule],
    declarations: [MedialinklistComponent],
    exports: [MedialinklistComponent]
})
export class MedialinklistComponentModule {}
