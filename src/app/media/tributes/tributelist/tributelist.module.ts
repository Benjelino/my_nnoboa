import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TributelistComponent } from './tributelist.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [TributelistComponent],
  exports: [TributelistComponent]
})
export class TributelistComponentModule {}
