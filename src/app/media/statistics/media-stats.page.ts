import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";


import * as Models from "src/app/media/services/media-model.service";
import { DcubecmsRemoteService } from "../services/dcubecms-remote.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

@Component({
  selector: "app-media-stats",
  templateUrl: "./media-stats.page.html",
  styleUrls: ["./media-stats.page.scss"],
})
export class MediaStatsPage implements OnInit {
  private id: string;
  public user = "John Doe";

  isLoading = false;
  isLoggedIn = false;
  public data: Models.UserStat;
  appId = "";
  userId: string;
  apiKey: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private remoteSvrc: RemoteService,
    private dremoteSvrc: DcubecmsRemoteService
  ) {
    let userId = this.authenticationService.getUserLogin().userId;
    this.apiKey = this.authenticationService.getUserLogin().apikey;
  }

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isAuthenticated();
   this.appId=AuthenticationService.env.appId;
    this.user = this.authenticationService.getUserLogin().userFullName;
    
    this.userId = this.authenticationService.getUserLogin().userId;
    this.apiKey = this.authenticationService.getUserLogin().apikey;

    this.dremoteSvrc.getUserStats(this.userId, null, this.apiKey, this.appId).subscribe(
      (data) => {
        this.isLoading = false;
        this.data = data;
        this.isLoading = true;
      },
      (err) => {
        console.log("Server Error | " + JSON.stringify(err));
      }
    );
  }
}
