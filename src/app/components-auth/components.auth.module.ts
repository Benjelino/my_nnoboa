import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ThomePage } from './thome/thome';
import { Tlogin } from './tlogin/tlogin';

export {
    ThomePage,
    Tlogin
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild()
    ],
    exports: [
        ThomePage,
        Tlogin
    ],
    declarations: [
        ThomePage,
        Tlogin
    ]
})
export class ComponentsAuthPageModule { }
