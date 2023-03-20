import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Models from "src/app/media/services/media-model.service";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { DcubecmsRemoteService } from "../../services/dcubecms-remote.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

@Component({
  selector: "app-announce-detail",
  templateUrl: "./announce-detail.page.html",
  styleUrls: ["./announce-detail.page.scss"],
})
export class AnnounceDetailPage implements OnInit {
  myId = null;
  isLoading = false;
  userId = "0";
  appId = "";
  public data: Models.Medium;
  constructor(
    private activatedRoute: ActivatedRoute,
    private remoteSvrc: DcubecmsRemoteService,
    private toast: ToastComponent
  ) {}

  ngOnInit() {
    this.myId = this.activatedRoute.snapshot.paramMap.get("id");
    this.appId = AuthenticationService.env.appId;
    this.remoteSvrc
      .getMedium(this.myId, this.userId, null, null, this.appId)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.data = data;
          this.isLoading = true;
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }
}
