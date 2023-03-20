import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { IonicModule } from '@ionic/angular'

import { ChatPopoverComponent } from './chat-popover.component'
import { Appheader, ComponentsPageModule } from 'src/app/components/components.module'
import { PipesModule } from 'src/app/base-services/pipes/pipes.module'

export { ChatPopoverComponent };

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        ComponentsPageModule
    ],
    declarations: [ChatPopoverComponent]
})
export class ChatPopoverModule {}
