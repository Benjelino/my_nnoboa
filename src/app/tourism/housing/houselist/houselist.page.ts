import { Component, OnInit, ViewChild } from "@angular/core";
import {
  IonInfiniteScroll,
  ModalController,
  PopoverController,
} from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
import { DcubecmsRemoteService } from "src/app/media/services/dcubecms-remote.service";
import { Housing } from "../../services/tourism-models.service";
import { TourismService } from "../../services/tourism.service";
import { HousedataformComponent } from "../housedataform/housedataform.component";

@Component({
  selector: "app-houselist",
  templateUrl: "./houselist.page.html",
  styleUrls: ["./houselist.page.scss"],
})
export class HouselistPage implements OnInit {
  initialData: Housing[] = [];
  notData: Housing[] = [];
  offSet = 0;
  limit = 5;
  appId = "";
  testData: Housing[] = [];
  errorOccurred = false;
  userId = null;
  apiKey = null;
  isLoggedIn = false;
  isLoading = false;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private toast: ToastComponent,
    private tourService: TourismService,
    private modalController: ModalController,
    private popoverCtrl: PopoverController,
    private events: Events
  ) {
    this.events.subscribe("housedata:created", (data: any) => {
      this.searchAll();
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.appId = AuthenticationService.env.appId;
    this.searchAll();
  }

  searchAll() {
    if (this.infinite) {
      this.infinite.disabled = false;
    }

    this.offSet = 0;
    this.initialData = [];
    this.notData = [];
    this.testData = [];
    this.loadData();
  }

  loadData(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }

    this.tourService
      .getHousingByProvider(
        this.appId,
        this.userId,
        this.offSet.toString(),
        this.limit.toString(),
        this.apiKey,
        this.remoteSvrc
      )
      .subscribe(
        (data) => {
          this.isLoading = false;

          if (data.httpStatus == "200") {
            this.errorOccurred = false;
          } else {
            this.errorOccurred = true;
            this.toast.presentFailedToast("Server Error | " + data.message);
            return;
          }
          this.initialData = [...this.initialData, ...data.HousingData];
          this.notData = [...this.notData, ...data.HousingData];
          this.testData = [...this.testData, ...data.HousingData];
          this.isLoading = true;

          if (event) {
            event.target.complete();
          }

          if (this.notData.length >= data.totNumHousingData) {
            this.infinite.disabled = true;
          }
        },
        (err) => {
          this.toast.presentFailedToast("Server Error | " + err);
        }
      );
  }

  async editHousing(event, housedata: Housing) {
    /*    const modal = await this.modalController.create({
      component: HousedataformComponent,
      componentProps: {
        housing: housedata,
      },
    });

   

    modal.onDidDismiss().then((data) => {
      
      if (data != null || data != undefined) {
        this.searchAll();
      }
    });

    return await modal.present(); */

    const popover = await this.popoverCtrl.create({
      component: HousedataformComponent,
      componentProps: { housing: housedata },
      cssClass: "bottom-sheet-popover",
      event: event,
      translucent: true,
    });
    return popover.present();
  }

  async newHouse(event) {
    /*    const modal = await this.modalController.create({
      component: HousedataformComponent,
      componentProps: {},
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present(); */

    const popover = await this.popoverCtrl.create({
      component: HousedataformComponent,
      componentProps: {},
      cssClass: "ion-popover",
      event: event,
      translucent: true,
    });
    return popover.present();
  }

  getPicture(item: Housing) {
    if (
      item.ImageUrls != undefined &&
      item.ImageUrls.length > 0 &&
      item.ImageUrls[0].imageUrl != null
    ) {
      if (!item.ImageUrls[0].imageUrl.startsWith("http")) {
        //console.log("getPicture(2) url prefix ", AppConstants.URL_MOQUI_DUTILS_NOAUTH);
        return (
          URL_MOQUI_DUTILS_NOAUTH +
          "getResource?inline=true&pathname=" +
          item.ImageUrls[0].imageUrl
        );
      } else {
        return item.ImageUrls[0].imageUrl;
      }
    } else {
      return (
        URL_MOQUI_DUTILS_NOAUTH +
        "getResource?inline=true&pathname=dbresource://dcube-utils/sabonay_logo.png"
      );
    }
    //console.log("getPicture() picture ", picture);
  }
}
