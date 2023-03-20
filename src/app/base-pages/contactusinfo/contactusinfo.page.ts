import { Component, OnInit } from "@angular/core";

import * as Models from "src/app/base-services/common-service/models/common-model.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { ContactUsService } from "src/app/base-services/remote-service/contactus.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";


@Component({
  selector: "app-contactusinfo",
  templateUrl: "./contactusinfo.page.html",
  styleUrls: ["./contactusinfo.page.scss"],
})
export class ContactusinfoPage implements OnInit {
  isLoggedIn = false;

  isLoading = false;
  contactsLoaded = false;

  public contactusInfo: Models.ContactItems;

  userId: string;
  apiKey: string;
  appId = '';

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: ContactUsService,
    private events: Events
  ) {
    this.events.subscribe("contactus:save", (data: any) => {
      this.getComment();
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;

    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.getComment();
  }

  ionViewDidEnter() {
    this.getComment();
  }

  getComment() {
    this.remoteSvrc.getContactItems(this.appId,null, this.apiKey).subscribe(
      (data) => {
        this.isLoading = false;
        this.contactusInfo = data as Models.ContactItems;

        this.isLoading = true;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

}
