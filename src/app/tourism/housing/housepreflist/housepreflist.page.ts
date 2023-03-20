import { Component, OnInit } from "@angular/core";
import { ModalController, PopoverController } from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { ClientHousingPrefList } from "../../services/tourism-models.service";
import { TourismService } from "../../services/tourism.service";
import { HouseprefformComponent } from "../houseprefform/houseprefform.component";

@Component({
  selector: "app-housepreflist",
  templateUrl: "./housepreflist.page.html",
  styleUrls: ["./housepreflist.page.scss"],
})
export class HousepreflistPage implements OnInit {
  errorOccurred = false;
  userId = null;
  apiKey = null;
  isLoggedIn = false;
  appId = "";
  housePrefData: ClientHousingPrefList;

  public pref: boolean = true;

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private toast: ToastComponent,
    private tourService: TourismService,
    private popoverCtrl: PopoverController,
    private events: Events
  ) {
    this.events.subscribe("housepref:created", (data: any) => {
      this.loadData();
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.appId = AuthenticationService.env.appId;
    this.loadData();
  }

  async newRecord(event) {
    const popover = await this.popoverCtrl.create({
      component: HouseprefformComponent,
      componentProps: {},
      cssClass: "bottom-sheet-popover",
      event: event,
      translucent: true,
    });
    return popover.present();
  }

  async editPref(event, housePref: any) {
    const popover = await this.popoverCtrl.create({
      component: HouseprefformComponent,
      componentProps: { clientHousingPref: housePref },
      cssClass: "bottom-sheet-popover",
      event: event,
      translucent: true,
    });
    return popover.present();
  }

  loadData() {
    this.tourService
      .getClientHousingPrefs(
        this.appId,
        this.userId,
        this.remoteSvrc,
        this.apiKey
      )
      .subscribe(
        (data) => {
          if (data.httpStatus == "200") {
            this.errorOccurred = false;
          } else {
            this.errorOccurred = true;
            this.toast.presentFailedToast("Server Error | " + data.message);
            return;
          }
          this.housePrefData = data;
        },
        (err) => {
          this.toast.presentFailedToast("Server Error | " + err);
        }
      );
  }
}
