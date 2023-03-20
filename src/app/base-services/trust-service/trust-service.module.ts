import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HttpClientModule } from '@angular/common/http';

import { PaymentService } from "./payment.service";
import { ToastComponent } from 'src/app/components/toastComponent';


export {
    PaymentService
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    HttpClientModule
  ],
  providers: [ToastComponent
  ]
})
export class TrustServiceModule { }
