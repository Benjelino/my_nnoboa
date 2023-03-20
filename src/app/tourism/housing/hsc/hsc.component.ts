import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import {
  AlertController,
  IonInfiniteScroll,
  ModalController,
} from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import { IAppLocale } from "src/app/base-services/common-service/models/common-model.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { PaymentService } from "src/app/base-services/trust-service/payment.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
import { DcubecmsRemoteService } from "src/app/media/services/dcubecms-remote.service";
import {
  ClientHousingPref,
  HouseEnums,
  Housing,
} from "../../services/tourism-models.service";
import { TourismService } from "../../services/tourism.service";
import { HousedataformComponent } from "../housedataform/housedataform.component";
@Component({
  selector: "app-hsc",
  templateUrl: "./hsc.component.html",
  styleUrls: ["./hsc.component.scss"],
})
export class HscComponent implements OnInit {
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
  public clientHousingPref: ClientHousingPref;
  userForm: UntypedFormGroup;

  public leaseType: HouseEnums[] = [];
  public rentalType: HouseEnums[] = [];
  public propertyType: HouseEnums[] = [];
  public propertyStatusType: HouseEnums[] = [];
  currencies: any;
  appLocale: IAppLocale = AuthenticationService.env.appLocale;

  @Input()
  public pref: boolean = false;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private toast: ToastComponent,
    private tourService: TourismService,
    private modalController: ModalController,
    private alertController: AlertController,
    private pymtSrvc: PaymentService,
    private events: Events,
    public fb: UntypedFormBuilder
  ) {
    this.userForm = fb.group({
      rentalType: ["", null],
      leaseType: ["", null],
      propertyType: ["", null],
      propertyStatus: ["", null],
      amountFrom: ["", null],
      amountTo: ["", null],
      noOfRooms: ["", null],
      periodOfLease: ["", null],
      currencyUomId: ["", null],
    });
  }

  addFormControl(name: string, formGroup: UntypedFormGroup): void {
    this.userForm.addControl(name, formGroup);
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.appId = AuthenticationService.env.appId;

    this.getCurrencyList();

    this.tourService.getHousingEnumData(this.remoteSvrc).subscribe(
      (data) => {
        //this.leaseType = data.LeaseTypeEnums;
        if (data.httpStatus == "200") {
          this.leaseType = data.ProviderLeaseTypeEnums;
          this.rentalType = data.RentalTypeEnums;
          this.propertyStatusType = data.PropertyStatusTypeEnums;
          this.propertyType = data.PropertyTypeEnums;
        } else {
          this.toast.presentFailedToast("Server Error  " + data.message);
        }
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );

    // this.searchAll();
  }

  getCurrencyList() {
    const self = this;
    //this.isLoading = false;
    this.pymtSrvc.getCurrencyList().then(
      (data) => {
        self.currencies = data;
        //this.isLoading = true;
      },
      (err) => {
        this.toast.presentFailedToast(
          "PaymentPage::getCurrencyList() err: " + JSON.stringify(err)
        );
      }
    );
  }

  searchParameters: any;
  rpost: any;
  setSearchParameters() {
    if (this.rpost != null) {
      this.searchParameters = {
        appId: this.appId,

        cityId: this.rpost.geo.cityLine?.geoId ?? "",
        districtId: this.rpost.geo.district?.geoId ?? "",
        regionId: this.rpost.geo.statePRLine?.geoId ?? "",
        countryId: this.rpost.geo.countryCode?.geoId ?? "",

        rentalType: this.rpost?.rentalType?.enumId ?? "",
        leaseType: this.rpost?.leaseType?.enumId ?? "",
        propertyType: this.rpost?.propertyType?.enumId ?? "",
        offset: this.offSet,
        limit: this.limit,
        noOfRooms: this.rpost.noOfRooms ?? "",
        periodOfLease: this.rpost.periodOfLease ?? "",
        amountFrom: this.rpost.amountFrom ?? "",
        amountTo: this.rpost.amountTo ?? "",
      };
    } else {
      this.searchParameters = {
        appId: this.appId,
        regionId: this.appLocale?.appRegionCode,
        countryId: this.appLocale?.appCountryCode,
        offset: this.offSet,
        limit: this.limit,
      };
    }
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
    this.setSearchParameters();
    if (loadMore) {
      this.offSet += this.limit;
    }

    this.tourService
      .getHousingByLocation(this.searchParameters, this.apiKey, this.remoteSvrc)
      .subscribe(
        (data) => {
          this.isLoading = false;

          if (data.httpStatus == "200") {
            this.errorOccurred = false;
          } else {
            this.errorOccurred = true;
            if (event) {
              event.target.complete();
            }
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

  async postInterest(housedata: Housing) {
    console.log("housing datea " + JSON.stringify(housedata));

    const alert = await this.alertController.create({
      header: "Interested in Property",
      message: "Are you sure you are interested in this property",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: () => {
            let today = new Date();
            today.setDate(today.getDate() + 30);
            this.clientHousingPref = {
              appId: this.appId,
              postalCode: housedata.postalAddress.postalCode,
              startDate: new Date(),
              endDate: today,

              suburbId: housedata.postalAddress.suburbId,
              cityGeoId: housedata.postalAddress.cityGeoId,
              countyGeoId: housedata.postalAddress.countyGeoId,
              stateProvinceGeoId: housedata.postalAddress.stateProvinceGeoId,
              countryGeoId: housedata.postalAddress.countryCode,
              amountFrom: housedata.amountFrom,
              amountTo: housedata.amountTo,
              leaseType: this.providerLeaseType2LeaseType(housedata.leaseType),
              noOfRooms: housedata.noOfRooms,
              periodOfLease: housedata.periodOfLease,
              propertyType: housedata.propertyType,
              rentalType: housedata.rentalType,
              userId: this.userId,
              createDate: new Date(),
              currencyUomId: housedata.currencyUomId,
              propertyStatusType: housedata.propertyStatusType,
              furnished: housedata.furnished,
              serviceLocReq: "true",
            };

            this.tourService
              .saveClientHousingPreferences(
                this.clientHousingPref,
                this.apiKey,
                this.remoteSvrc
              )
              .subscribe(
                async (data) => {
                  if (data.httpStatus == 200) {
                    this.userForm.reset();
                    // this.modalController.dismiss({ data: data });
                    this.events.publish("housepref:created", {
                      user: null,
                      time: new Date(),
                    });
                  }
                  this.toast.processResponse(data);
                },
                (err) => {
                  this.toast.presentFailedToast(
                    "Error Occured , Please try again !!!"
                  );
                }
              );
          },
        },
      ],
    });
    await alert.present();
  }

  private providerLeaseType2LeaseType(leaseType_p: string) {
    let leaseType = null;
    switch (leaseType_p) {
      case "Sell":
        leaseType = "Buy";
        break;
      case "RentP":
        leaseType = "Rent";
        break;
      case "ShareP":
        leaseType = "Share";
        break;
      case "ShacrpP":
        leaseType = "Shacrp";
        break;
    }

    return leaseType;
  }

  async editHousing(housedata: Housing) {
    const modal = await this.modalController.create({
      component: HousedataformComponent,
      componentProps: {
        housing: housedata,
      },
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }

  async newHouse() {
    const modal = await this.modalController.create({
      component: HousedataformComponent,
      componentProps: {},
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present();
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

  resetForm() {
    this.userForm.reset();
    this.rpost = null;
  }

  submitForm(post: any) {
    this.rpost = post;
    this.searchAll();
  }
}
