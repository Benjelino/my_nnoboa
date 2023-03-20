import { Component, OnInit } from "@angular/core";

import { MenuController } from "@ionic/angular";

import { QuestionlistPage } from "../questionlist/questionlist.page";
import { MyquestionsPage } from "../myquestions/myquestions.page";
import { CategoryPage } from "../category/category.page";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

@Component({
  selector: "app-qatab",
  templateUrl: "./qatab.page.html",
  styleUrls: ["./qatab.page.scss"],
})
export class QatabPage implements OnInit {
  tab1 = QuestionlistPage;
  tab2 = MyquestionsPage;
  tab3 = CategoryPage;

  isLoggedIn = false;
  constructor(
    private auth: AuthenticationService,
    public menu: MenuController
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.menu.enable(true);
    }
  }
}
