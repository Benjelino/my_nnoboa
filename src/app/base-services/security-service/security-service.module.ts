import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CryptojsService } from './cryptojs.service';

export { CryptojsService };

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    CryptojsService
  ]
})
export class SecurityServiceModule { }
