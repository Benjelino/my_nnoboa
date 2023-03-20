import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';



import { FormControl, FormGroup } from "@angular/forms";

import { AnnlistPageRoutingModule } from './annlist-routing.module';

import { AnnlistPage } from './annlist.page';
import { PipesModule } from 'src/app/base-services/pipes/pipes.module';
import { Appheader, ComponentsPageModule } from 'src/app/components/components.module';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        ReactiveFormsModule,
        ComponentsPageModule,
        RouterModule.forChild([
            {
                path: '',
                component: AnnlistPage
            }
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [AnnlistPage]
})
export class AnnlistPageModule {}
