import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ChatContactsPageRoutingModule } from './chat-contacts-routing.module'

import { ChatContactsPage } from './chat-contacts.page'
import { ComponentsPageModule } from 'src/app/components/components.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    ChatContactsPageRoutingModule
  ],
  declarations: [ChatContactsPage]
})
export class ChatContactsPageModule {}
