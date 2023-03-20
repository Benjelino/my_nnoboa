import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ChatListPageRoutingModule } from './chat-list-routing.module'

import { ChatListPage } from './chat-list.page'
import { Appheader, ComponentsPageModule } from 'src/app/components/components.module'



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsPageModule,
        ChatListPageRoutingModule
    ],
    providers: [],
    declarations: [ChatListPage]
})
export class ChatListPageModule {}
