import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { QatabPage } from "./qatab.page";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: QatabPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../questionlist/questionlist.module").then(
                (m) => m.QuestionlistPageModule
              ),
          },
        ],
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../myquestions/myquestions.module").then(
                (m) => m.MyquestionsPageModule
              ),
          },
        ],
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../category/category.module").then(
                (m) => m.CategoryPageModule
              ),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/menu/qatabs/tab2",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [QatabPage],
})
export class QatabPageModule {}
