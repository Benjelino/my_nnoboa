import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Models from "src/app/media/services/media-model.service";

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { ModalController, Platform } from "@ionic/angular";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Share } from "@capacitor/share";
import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { DcubecmsRemoteService } from "../../services/dcubecms-remote.service";
import { EventService } from "src/app/events/services/event.service";
import { QaaForumService } from "src/app/qanda/services/qaaforum.service";
import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import { DatePipe } from "@angular/common";
import { TributeComponent } from "../../tributes/tribute/tribute.component";
import { Utils } from "src/app/base-services/utility-services/utils";
import { IfStmt } from "@angular/compiler";

const datepipe: DatePipe = new DatePipe("en-US");
@Component({
  selector: "app-news-detail",
  templateUrl: "./news-detail.page.html",
  styleUrls: [
    "./news-detail.page.scss",
    "./travel-details.page.scss",
    "./travel-details.shell.scss",
  ],
})
export class NewsDetailPage implements OnInit {
  myId = null;
  isLoading = false;
  isLoggedIn = false;
  imageLoaded = false;
  linksLoaded = true;
  eventsLoaded = true;
  isAnnouncement = false;
  imageData: any;
  userId = "0";
  appId = "";
  letterObj = {
    to: "",
    from: "",
    text: "",
  };

  apiKey: string;
  public data: Models.Medium;
  public mediaType = Models.mediumType;
  public links: Models.LinkList;
  public events: Models.Event[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private remoteSvrc: DcubecmsRemoteService,
    private eventSvrc: EventService,
    private iab: InAppBrowser,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private qaService: QaaForumService,
    private toast: ToastComponent,
    public modalController: ModalController
  ) {}

  pdfObj = null;

  createPdf() {
    let events = "<ul>";

    let links = "<ul>";

    this.data.events.forEach(function (event) {
      events =
        events +
        "<li> " +
        event.description +
        "  -Location : " +
        event.locationName +
        "</h6> -Date : " +
        datepipe.transform(event.startDate, "dd-MMM-YYYY HH:mm") +
        "</li>";
    });

    events = events + "</ul>";

    for (let i = 0; i < this.data.links.length; i++) {
      if (this.data.links[i].urlink) {
        links =
          links +
          "<li> " +
          "<a href='" +
          this.getActualLink(this.data.links[i].urlink) +
          "'>" +
          this.data.links[i].title +
          "</a>";

        ("</li>");
      }
    }

    links = links + "</ul>";

    let html = htmlToPdfmake(
      " <b>Title:</b> " +
        this.data.title +
        "<br> <b>Author:</b> " +
        this.data.author +
        "<br> <b>Content:</b> " +
        this.data.content +
        "<br> <b>Events:</b> " +
        events +
        "<br> <b>Links:</b> " +
        links
    );

    if (this.isAnnouncement) {
      let tributes = "<ul>";
      this.data.tributes.forEach(function (tribute) {
        if (tribute) {
          tributes =
            tributes +
            "<li> " +
            " <b>Title:</b> " +
            tribute.title +
            " <b>Message:</b> " +
            tribute.content +
            "  -Author : " +
            tribute.author +
            "</li>";
        }
      });

      tributes = tributes + "</ul>";

      html = htmlToPdfmake(
        " <b>Title:</b> " +
          this.data.title +
          "<br> <b>Author:</b> " +
          this.data.author +
          "<br> <b>Content:</b> " +
          this.data.content +
          "<br> <b>Events:</b> " +
          events +
          "<br> <b>Tributes:</b> " +
          tributes +
          "<br> <b>Links:</b> " +
          links
      );
    }

    //let html = htmlToPdfmake(content1);

    var docDefinition = {
      content: [html],

      styles: {
        header: {
          bold: true,
          fontSize: 15,
        },
      },
      defaultStyle: {
        fontSize: 12,
      },
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  downloadPdf() {
    if (this.plt.is("cordova") || this.plt.is("android")) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: "application/pdf" });

        // Save the PDF to the data Directory of our App
        this.file
          .writeFile(this.file.dataDirectory, "myletter.pdf", blob, {
            replace: true,
          })
          .then((fileEntry) => {
            this.fileOpener.open(
              this.file.dataDirectory +
                this.qaService.slugify(this.data.title) +
                ".pdf",
              "application/pdf"
            );
          });
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download(this.qaService.slugify(this.data.title));
    }
  }

  async sendShare(message, subject) {
    const url = "https://www.ccc.com";
    let shareRet = await Share.share({
      title: subject,
      text: message,
      url: "https://www.ccc.com",
      dialogTitle: "Share with buddies",
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;
    this.myId = this.activatedRoute.snapshot.paramMap.get("id");

    if (this.isLoggedIn == true) {
      this.apiKey = this.auth.getUserLogin().apikey;
      this.userId = this.auth.getUserLogin().userId;
    }

    this.remoteSvrc
      .getMedium(this.myId, this.userId, null, this.apiKey, this.appId)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.data = data;
          this.isLoading = true;

          if (this.data.mtype == Models.mediumType.Announcement) {
            this.isAnnouncement = true;
          } else {
            this.isAnnouncement = false;
          }

          if (this.data.hasOwnProperty("imageUrl")) {
            this.remoteSvrc.getResource(this.data.imageUrl).subscribe(
              (data) => {
                this.imageLoaded = false;

                this.imageData =
                  URL_MOQUI_DUTILS_NOAUTH +
                  "getResource?inline=true&pathname=" +
                  this.data.imageUrl;

                this.imageLoaded = true;
              },
              (err) => {
                this.imageLoaded = false;
              }
            );
          } else {
            this.imageLoaded = false;
          }

          //this.getLinks();
          // this.getEvents();
        },
        (err) => {
          this.imageLoaded = false;
          this.linksLoaded = false;
        }
      );
  }

  getMedium() {
    this.remoteSvrc
      .getMedium(this.myId, this.userId, null, this.apiKey, this.appId)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.data = data;

          this.isLoading = true;
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }

  getLinks() {
    if (this.data.hasOwnProperty("mediumId")) {
      this.remoteSvrc
        .getLinksByMedium(
          this.data.mediumId,
          this.userId,
          null,
          this.apiKey,
          this.appId
        )
        .subscribe(
          (data) => {
            this.linksLoaded = false;
            this.links = data;

            this.linksLoaded = true;
          },
          (err) => {
            this.linksLoaded = false;
          }
        );
    } else {
      this.linksLoaded = false;
    }
  }

  getEvents() {
    if (this.data.hasOwnProperty("mediumId")) {
      this.eventSvrc
        .getEventsByMediumId(this.data.mediumId, null, this.apiKey, this.appId)
        .subscribe(
          (data) => {
            this.events = data.Events as Models.Event[];

            this.eventsLoaded = true;
          },
          (err) => {
            this.eventsLoaded = false;
            this.toast.presentFailedToast("events " + JSON.stringify(err));
          }
        );
    } else {
      this.eventsLoaded = false;
    }
  }

  resourceUrl = URL_MOQUI_DUTILS_NOAUTH + "getResource?inline=true&pathname=";
  openLink(url: string) {
    if (!url.startsWith("http")) {
      url = this.resourceUrl + url;
    }
    this.iab.create(url, "_system");
  }

  getActualLink(url: string): string {
    if (!url.startsWith("http")) {
      url = this.resourceUrl + url;
    }
    return url;
  }

  postLike() {
    if (this.isLoggedIn == true) {
      this.remoteSvrc
        .saveLike(this.appId, this.myId, "Y", this.userId, null, this.apiKey)
        .subscribe(
          (data) => {
            this.getMedium();
          },
          (err) => {
            this.toast.presentFailedToast("Server Error | " + err);
          }
        );
    }
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        this.imageData = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  ionViewDidEnter() {
    if (this.isLoading == true) {
      this.getMedium();
      //  this.getLinks();
      //this.getEvents();
    }
  }

  stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  async showTributeForm() {
    const modal = await this.modalController.create({
      component: TributeComponent,
      componentProps: {
        mediumId: this.data.mediumId,
      },
    });

    modal.onDidDismiss().then((data) => {
      console.log(JSON.stringify(data));

      if (data != null || data != undefined) {
        this.getMedium();
      }
    });

    return await modal.present();
  }
}
