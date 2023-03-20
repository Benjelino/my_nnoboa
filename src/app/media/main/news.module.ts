import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { NewsPageRoutingModule } from "./news-routing.module";
import { ToastComponent } from "../../components/toastComponent";
import { NewsPage } from "./news.page";
import { QuillModule } from "ngx-quill";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewsPageRoutingModule,
    QuillModule.forRoot(),
  ],
  providers: [ToastComponent],
  declarations: [NewsPage],
})
export class NewsPageModule {}
