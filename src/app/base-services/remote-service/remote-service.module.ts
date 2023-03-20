import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { RemoteService } from "./remote.service";

import { ContactUsService } from "./contactus.service";
import { EsearchService } from "./esearch.service";


export {
    RemoteService,
    ContactUsService,
    EsearchService,
    //FcmNotificationService
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
      RemoteService
  ]
})
export class RemoteServiceModule { }
