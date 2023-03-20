import { Component, Input, OnInit } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as Models from "src/app/media/services/media-model.service";
import { DcubecmsRemoteService } from "../services/dcubecms-remote.service";

@Component({
  selector: "app-applinks",
  templateUrl: "./applinks.page.html",
  styleUrls: ["./applinks.page.scss"],
})
export class ApplinksPage implements OnInit {
  public links: Models.LinkList;
  @Input() appId: string = "ObraApp";
  @Input() ltype: string = "700";
  linksLoaded = false;
  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: DcubecmsRemoteService,
    private iab: InAppBrowser,
  ) {}

  ngOnInit() {
    this.getLinks();
  }

  resourceUrl = URL_MOQUI_DUTILS_NOAUTH + "getResource?inline=true&pathname=";
  openLink(url: string) {
    if (!url.startsWith("http")) {
      url = this.resourceUrl + url;
    }
    this.iab.create(url, "_system");
  }

  getLinks() {
    this.remoteSvrc.getLinksByAppType(null, this.appId, this.ltype).subscribe(
      (data) => {
        this.linksLoaded = false;
        this.links = data;

        this.linksLoaded = true;
      },
      (err) => {
        this.linksLoaded = false;
      }
    );
  }
}
