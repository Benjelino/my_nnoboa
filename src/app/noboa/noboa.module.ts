import { EcprofileComponent } from './ecprofile/ecprofile.component';
import { TeammembersComponent } from './teammembers/teammembers.component';
import { ProgressStepComponent } from './progress/progress-step/progress-step.component';
import { ProgressStepDirective } from './progress/progress-step.directive';
import { PopoverComponent } from './popover/popover.component';
import { UpcomingeventCardComponent } from './upcomingevent-card/upcomingevent-card.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TranslateModule } from "@ngx-translate/core";
import { SwiperModule } from "swiper/angular";

import { SeparatorComponent } from './separator/separator.component';
import {ShortCardsComponent} from './app-short-cards/app-short-cards.component';
import { CompanyCardComponent } from './companycard/companycard.component';
import { FeedbackSectionComponent } from './feedback-section/feedback-section.component';
import { ProgressComponent } from './progress/progress.component';
import { ComponentsPageModule } from '../components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SwiperModule,
    ComponentsPageModule,
    IonicSelectableModule,
    TranslateModule.forChild(),
  ],
  exports: [
    SeparatorComponent,
    ShortCardsComponent,
    CompanyCardComponent,
    UpcomingeventCardComponent,
    FeedbackSectionComponent,
    PopoverComponent,
    ProgressComponent,
    ProgressStepDirective,
    ProgressStepComponent,
    TeammembersComponent,
    EcprofileComponent
  ],
  declarations: [
    SeparatorComponent,
    ShortCardsComponent,
    CompanyCardComponent,
    UpcomingeventCardComponent,
    FeedbackSectionComponent,
    PopoverComponent,
    ProgressComponent,
    ProgressStepDirective,
    ProgressStepComponent,
    TeammembersComponent,
    EcprofileComponent
  ],
})
export class NoboaPageModule {}
