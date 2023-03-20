import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicSelectableModule } from 'ionic-selectable';

import { Appheader, ComponentsPageModule } from 'src/app/components/components.module';

import { CurrencyComponent } from './currency.component';


// 
export { CurrencyComponent }

@NgModule({
    declarations: [
        CurrencyComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicSelectableModule,
        ComponentsPageModule
    ],
    providers: []
})
export class CurrencyModule { }