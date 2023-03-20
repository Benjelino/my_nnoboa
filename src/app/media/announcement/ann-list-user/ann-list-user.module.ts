

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnListUserPageRoutingModule } from './ann-list-user-routing.module';

import { AnnListUserPage } from './ann-list-user.page';


import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { ComponentsPageModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/base-services/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsPageModule,
    ReactiveFormsModule,
    PipesModule,
    AnnListUserPageRoutingModule
  ],
  declarations: [AnnListUserPage]
})
export class AnnListUserPageModule {}
