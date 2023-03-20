import { Component, OnInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

import { Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
// import { Observable } from "rxjs";

import { IChatController, Message, MessageType } from "ng-chat";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as CModels from "src/app/base-services/common-service/models/common-model.service";

import { ToastComponent } from "src/app/components/toastComponent";

import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

import { RemoteService } from "src/app/base-services/remote-service/remote.service";

@Component({
  selector: "app-client-dashboard",
  templateUrl: "./client-dashboard.page.html",
  styleUrls: ["./client-dashboard.page.scss"],
})
export class ClientDashboardPage implements OnInit {
  private id: string;
  public user = "John Doe";
  
  isLoading = false;
  isLoggedIn = false;
  
  userId: string;
  apiKey: string;
 
  myObs: Subscription;
  currentTheme = "dark-theme"; // light or dark
  audioEnabled = false;
  
  browserNotificationEnabled = false;
  public isCollapsed = true;
  userPref: CModels.UserPrefs;

  appId = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private toast: ToastComponent
  ) {
    let userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;
    this.userPref = this.auth.getUserLogin().userPrefs;
    if (this.userPref != undefined) {
      this.currentTheme =
        this.userPref.theme == "dark" ? "dark-theme" : "light-theme";
      this.browserNotificationEnabled =
        this.userPref.browserNotificationsEnable == "Y" ? true : false;
      this.audioEnabled = this.userPref.audioEnabled == "Y" ? true : false;
    }
  }
  ngOnDestroy() {
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.user = this.auth.getUserLogin().userFullName;
    this.appId = AuthenticationService.env.appId;
    this.userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;
  }

  public ngAfterViewInit(): void {}

 

  ionViewWillLeave() {
  }

}
