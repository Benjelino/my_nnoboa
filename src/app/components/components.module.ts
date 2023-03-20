import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TranslateModule } from "@ngx-translate/core";

import { BannerComponentComponent } from "./banner-component/banner-component.component";
import { ExpandableComponent } from "./expandable/expandable.component";
import { PrivacyPolicyPage } from "./privacy-policy/privacy-policy.page";
import { TermsOfServicePage } from "./terms-of-service/terms-of-service.page";

import { ShellModule } from "./shell/shell.module";
import { PipesModule } from "../base-services/pipes/pipes.module";

import { Appheader } from "../app-pages/header/appheader.component";
import { AboutComponent } from "../app-pages/about/about.component";


export { Appheader, ExpandableComponent };

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShellModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    Appheader,
    ExpandableComponent,
    BannerComponentComponent,
    PrivacyPolicyPage,
    TermsOfServicePage,
    ShellModule,
    AboutComponent,
  ],
  declarations: [
    Appheader,
    ExpandableComponent,
    BannerComponentComponent,
    PrivacyPolicyPage,
    TermsOfServicePage,
    AboutComponent,
  ],
})
export class ComponentsPageModule {}
