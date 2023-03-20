import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AnnouncesearchComponent } from "./announcesearch.component";
import {
  Appheader,
  ComponentsPageModule,
} from "src/app/components/components.module";
import { PipesModule } from "src/app/base-services/pipes/pipes.module";
import { ApplinksPageModule } from "../../applinks/applinks.module";
import { MedialinklistComponentModule } from "../../medialinklist/medialinklist.module";
import { RouterModule } from "@angular/router";
import { TributelistComponentModule } from "../../tributes/tributelist/tributelist.module";

export { AnnouncesearchComponent };

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        PipesModule,
        ComponentsPageModule,
        MedialinklistComponentModule,
        TributelistComponentModule,
        RouterModule,
    ],
    exports: [AnnouncesearchComponent],
    declarations: [AnnouncesearchComponent]
})
export class AnnouncesearchModule {}
