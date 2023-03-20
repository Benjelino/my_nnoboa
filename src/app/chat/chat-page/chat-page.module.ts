import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatPage } from './chat-page.page';
import { ChatPopoverComponent } from "../chat-popover/chat-popover.module";
import { Appheader, ComponentsPageModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/base-services/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        ComponentsPageModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ChatPage]
})
export class ChatPageModule {}
