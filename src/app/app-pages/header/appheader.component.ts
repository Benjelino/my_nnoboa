import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { Router } from "@angular/router";

import { MenuController } from "@ionic/angular";

import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

/*
 */
@Component({
  selector: "app-header",
  templateUrl: "appheader.component.html",
  styleUrls: ['./appheader.component.scss'],
})
export class Appheader {
  @Input() ptitle: string;

  loggedIn: boolean;

  getPtitle() {
    return this.translateString(this.ptitle);
  }

  constructor(
    public menuCtrl: MenuController,
    private router: Router,
    private translateService: TranslateService,
    private auth: AuthenticationService
  ) {
    this.loggedIn = this.auth.isAuthenticated();
  }

  translateString(key: string): string {
    return this.translateService.instant(key);
  }

  login() {
    AuthenticationService.authState.next("login");
  }

  logout() {
    this.auth.ifLoggedOut();
  }

  register() {
    AuthenticationService.authState.next("register");
  }

  forgot() {
    AuthenticationService.authState.next("forgot");
  }

  home() {
    AuthenticationService.authState.next("home");
  }

  contactus() {
    this.router.navigate(["/menu/contactus"]);
  }

  contactusNotLoggedIn() {
    this.router.navigate(["/contactus"]);
  }


  dashboard() {
    this.router.navigate(["/menu/client-dashboard"]);
  }

  fundme(){
    this.router.navigate(["/menu/fundme"])
  }
}
