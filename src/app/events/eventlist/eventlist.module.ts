import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular'

import { EventlistComponent } from './eventlist.component';
import { Appheader, ComponentsPageModule } from 'src/app/components/components.module'
import { PipesModule } from 'src/app/base-services/pipes/pipes.module'

export { EventlistComponent };

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        PipesModule,
        ComponentsPageModule
    ],
    declarations: [EventlistComponent]
})
export class EventlistModule {}
