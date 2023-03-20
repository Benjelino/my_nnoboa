import { Component, Input, OnInit } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { ModalController } from "@ionic/angular";
import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as Models from "src/app/media/services/media-model.service";

@Component({
  selector: "app-medialinklist",
  templateUrl: "./medialinklist.component.html",
  styleUrls: ["./medialinklist.component.scss"],
})
export class MedialinklistComponent implements OnInit {
  @Input()
  linkList: Models.Link[];

  constructor(
    public modalController: ModalController,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    //console.log(JSON.stringify(this.linkList));
  }

  resourceUrl = URL_MOQUI_DUTILS_NOAUTH + "getResource?inline=true&pathname=";
  openLink(url: string) {
    if (!url.startsWith("http")) {
      url = this.resourceUrl + url;
    }
    this.iab.create(url, "_system");
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
