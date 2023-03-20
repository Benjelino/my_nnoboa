import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ModalController, PopoverController } from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { GeoModel } from "src/app/base-services/common-service/models/common-model.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { PaymentService } from "src/app/base-services/trust-service/payment.service";
import { ToastComponent } from "src/app/components/toastComponent";
import {
  ClientHousingPref,
  HouseEnums,
} from "../../services/tourism-models.service";
import { TourismService } from "../../services/tourism.service";
import { formatDate } from "@angular/common";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { IonicSelectableComponent } from "ionic-selectable";

@Component({
  selector: "app-houseprefform",
  templateUrl: "./houseprefform.component.html",
  styleUrls: ["./houseprefform.component.scss"],
})
export class HouseprefformComponent implements OnInit {
  isLoggedIn = false;
  userId = null;
  apiKey = null;
  appId = "";
  userForm: UntypedFormGroup;
  keys: any;
  contactMechId = "";
  housingId = "";
  selectedLeaseType = "";

  public leaseType: HouseEnums[] = [];
  public rentalType: HouseEnums[] = [];
  public propertyType: HouseEnums[] = [];
  public propertyStatusType: HouseEnums[] = [];
  currencies: any;

  public roomLabel: string = "No of Rooms";
  selectedPropertyType = "Land";

  flexibility: string = "flex";
  serviceLocationRequired: string = "true";

  public geoModel: GeoModel = null;
  @Input()
  public clientHousingPref: ClientHousingPref;

  constructor(
    private toast: ToastComponent,
    public modalController: ModalController,
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private pymtSrvc: PaymentService,
    public fb: UntypedFormBuilder,
    private tourService: TourismService,
    private popoverCtrl: PopoverController,
    private events: Events
  ) {
    let today = new Date();
    today.setDate(today.getDate() + 24);

    this.userForm = fb.group({
      rentalType: [""],
      leaseType: [""],
      propertyType: [""],
      propertyStatus: [""],
      amountTo: [0, Validators.compose([Validators.required])],
      amountFrom: [0, Validators.compose([Validators.required])],
      noOfRooms: [0],
      furnished: ["N"],
      periodOfLease: [0],
      currencyUomId: [""],
      startDate: [
        formatDate(new Date(), "yyyy-MM-dd", "en"),
        Validators.compose([Validators.required]),
      ],
      endDate: [
        formatDate(today, "yyyy-MM-dd", "en"),
        Validators.compose([Validators.required]),
      ],
    });
  }

  setFormData() {
    if (this.clientHousingPref != null) {
      if (this.clientHousingPref.rentalType != null) {
        let myCurrency = {
          enumId: this.clientHousingPref.rentalType,
          description: this.clientHousingPref.dRentalType,
        };
        this.userForm.patchValue({
          rentalType: myCurrency,
        });
      }

      if (this.clientHousingPref.leaseType != null) {
        this.selectedLeaseType = this.clientHousingPref.leaseType;
        let myCurrency = {
          enumId: this.clientHousingPref.leaseType,
          description: this.clientHousingPref.dRentalType,
        };
        this.userForm.patchValue({
          leaseType: myCurrency,
        });
      }

      if (this.clientHousingPref.propertyType != null) {
        let myCurrency = {
          enumId: this.clientHousingPref.propertyType,
          description: this.clientHousingPref.dPropertyType,
        };
        this.userForm.patchValue({
          propertyType: myCurrency,
        });
      }

      if (this.clientHousingPref.propertyStatusType != null) {
        let myCurrency = {
          enumId: this.clientHousingPref.propertyStatusType,
          description: this.clientHousingPref.dPropertyStatusType,
        };
        this.userForm.patchValue({
          propertyStatus: myCurrency,
        });
      }

      if (this.clientHousingPref.amountTo != null) {
        this.userForm.patchValue({
          amountTo: this.clientHousingPref.amountTo,
        });
      }

      if (this.clientHousingPref.amountFrom != null) {
        this.userForm.patchValue({
          amountFrom: this.clientHousingPref.amountFrom,
        });
      }

      if (this.clientHousingPref.noOfRooms != null) {
        this.userForm.patchValue({
          noOfRooms: this.clientHousingPref.noOfRooms,
        });
      }

      if (this.clientHousingPref.periodOfLease != null) {
        this.userForm.patchValue({
          periodOfLease: this.clientHousingPref.periodOfLease,
        });
      }

      if (this.clientHousingPref.currencyUomId != null) {
        let myCurrency = {
          uomId: this.clientHousingPref.currencyUomId,
          description: this.clientHousingPref.currency,
        };
        this.userForm.patchValue({
          currencyUomId: myCurrency,
        });
      }

      if (this.clientHousingPref.startDate != null) {
        this.userForm.patchValue({
          startDate: formatDate(
            this.clientHousingPref.startDate,
            "yyyy-MM-dd",
            "en"
          ),
        });
      }

      if (this.clientHousingPref.endDate != null) {
        this.userForm.patchValue({
          endDate: formatDate(
            this.clientHousingPref.endDate,
            "yyyy-MM-dd",
            "en"
          ),
        });
      }

      this.geoModel = {
        country: {
          geoId: this.clientHousingPref.countryGeoId,
          geoName: this.clientHousingPref.country,
        },
        region: {
          geoId: this.clientHousingPref.stateProvinceGeoId,
          geoName: this.clientHousingPref.region,
        },
        district: {
          geoId: this.clientHousingPref.countyGeoId,
          geoName: this.clientHousingPref.district,
        },
        city: {
          geoId: this.clientHousingPref.cityGeoId,
          geoName: this.clientHousingPref.city,
        },
        suburb: {
          geoId: this.clientHousingPref.suburbId,
          geoName: this.clientHousingPref.suburb,
        },
      };
    }
  }

  ionViewDidEnter() {}

  

  ionChangePropertyType(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.selectedPropertyType = event.value.enumId;
    if (event.value.enumId == "Land") {
      this.roomLabel = "No of Plots";
    } else {
      this.roomLabel = "No of Rooms";
    }
  }

  ngOnInit() {
    this.userForm.setValidators([
      this.customAmountValidator(),
      this.customDateValidator(),
    ]);

    this.userForm.updateValueAndValidity();

    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.appId = AuthenticationService.env.appId;

    this.getCurrencyList();

    this.tourService.getHousingEnumData(this.remoteSvrc).subscribe(
      (data) => {
        //this.leaseType = data.LeaseTypeEnums;
        this.leaseType = data.LeaseTypeEnums;
        this.rentalType = data.RentalTypeEnums;
        this.propertyStatusType = data.PropertyStatusTypeEnums;
        this.propertyType = data.PropertyTypeEnums;
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );

    this.setFormData();

    let defaultCurrency = {
      uomId: "GHS",
      description: "Ghanaian cedi",
    };

    this.userForm.patchValue({
      currencyUomId: defaultCurrency,
    });
  }

  customDateValidator() {
    return (fg: UntypedFormGroup) => {
      const sDate = new Date(fg.get("startDate").value).getTime();
      const eDate = new Date(fg.get("endDate").value).getTime();
      const error =
        sDate && eDate && eDate >= sDate ? null : { dateAfter: true };

      fg.get("endDate").setErrors(error);
      return error;
    };
  }

  customAmountValidator() {
    return (fg: UntypedFormGroup) => {
      const amountFrom = Number(fg.get("amountFrom").value);
      const amountTo = Number(fg.get("amountTo").value);
      const error =
        amountTo && amountFrom && amountTo > amountFrom
          ? null
          : { amountAfter: true };

      fg.get("amountTo").setErrors(error);
      return error;
    };
  }

  formErrors = {
    rentalType: [],
    leaseType: [],
    propertyType: [],
    propertyStatus: [],
    amountTo: [],
    amountFrom: [],
    noOfRooms: [],
    periodOfLease: [],
    currencyUomId: [],
    startDate: [],
    endDate: [],
  };

  validationMessages = {
    rentalType: [{ type: "required", message: "Rental Type is required." }],
    currencyUomId: [{ type: "required", message: "Currency Required." }],
    leaseType: [{ type: "required", message: "Lease Type is required." }],
    propertyType: [{ type: "required", message: "Porperty Type is required." }],
    propertyStatus: [
      { type: "required", message: "Property Status is required." },
    ],

    noOfRooms: [{ type: "required", message: "No. Of Rooms is required." }],
    periodOfLease: [
      { type: "required", message: "Period Of Lease is required." },
    ],
    startDate: [{ type: "required", message: "End Date is Required" }],
    endDate: [
      { type: "required", message: "End Date is Required" },
      { type: "dateAfter", message: "Must be after Start Date" },
    ],
    amountFrom: [{ type: "required", message: "Amount From is required." }],
    amountTo: [
      { type: "required", message: "Amount To is Required" },
      {
        type: "amountAfter",
        message: "Amount To should be greater than Amount From",
      },
    ],
  };

  addFormControl(name: string, formGroup: UntypedFormGroup): void {
    this.userForm.addControl(name, formGroup);
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

  onSelectFlexibility(event: { [x: string]: { [x: string]: any } }) {
    let value = event["detail"]["value"];
    this.flexibility = value;
  }

  onLocationRequired(event: { [x: string]: { [x: string]: any } }) {
    let value = event["detail"]["value"];
    this.serviceLocationRequired = value;
  }

  async cancelModal() {
    //await this.modalController.dismiss(null);
    await this.popoverCtrl.dismiss({});
  }

  async submitForm(rpost) {
    // console.log(rpost);
    let pqueryId = null;
    if (this.clientHousingPref) {
      pqueryId = this.clientHousingPref.pqueryId;
    }

    this.clientHousingPref = {
      appId: this.appId,
      postalCode: rpost.geo.postalCode,

      suburbId: rpost.geo.suburb?.geoId,
      cityGeoId: rpost.geo.cityLine?.geoId,
      countyGeoId: rpost.geo.district?.geoId,
      stateProvinceGeoId: rpost.geo.statePRLine?.geoId,
      countryGeoId: rpost.geo.countryCode?.geoId,
      amountFrom: rpost.amountFrom,
      amountTo: rpost.amountTo,
      leaseType: rpost.leaseType.enumId,
      noOfRooms: rpost.noOfRooms,
      periodOfLease: rpost.periodOfLease,
      propertyType: rpost.propertyType.enumId,
      rentalType: rpost.rentalType.enumId,
      serviceLocReq: this.serviceLocationRequired,
      userId: this.userId,
      createDate: new Date(),
      currencyUomId: rpost.currencyUomId.uomId,
      endDate: rpost.endDate,
      startDate: rpost.startDate,
      flexibilityType: rpost.flexibilityType,
      propertyStatusType: rpost.propertyStatus.enumId,
      furnished:rpost.furnished
    };

    if (pqueryId) {
      this.clientHousingPref.pqueryId = pqueryId;
    }

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

            await this.popoverCtrl.dismiss({});
          }
          this.toast.processResponse(data);
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );
  }

  ionChangeLeaseType(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.selectedLeaseType = event.value.enumId;
  }
}
