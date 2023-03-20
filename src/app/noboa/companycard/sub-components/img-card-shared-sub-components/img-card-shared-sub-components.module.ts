import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import { MediaIconsComponent } from '../media-icons/media-icons.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [BadgeComponent, MediaIconsComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [BadgeComponent, MediaIconsComponent]
})
export class ImgCardSharedSubComponentsModule { }
