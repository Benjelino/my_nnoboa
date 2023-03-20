import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HttpClientModule } from "@angular/common/http";

import { QaaForumService } from "./qaaforum.service";

export { QaaForumService };

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [QaaForumService],
})
export class QaaForumServiceModule {}
