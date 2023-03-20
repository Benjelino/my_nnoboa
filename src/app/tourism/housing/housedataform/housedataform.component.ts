import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  ActionSheetController,
  ModalController,
  Platform,
  PopoverController,
} from "@ionic/angular";
import { IonicSelectableComponent } from "ionic-selectable";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import { GeoModel } from "src/app/base-services/common-service/models/common-model.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { PaymentService } from "src/app/base-services/trust-service/payment.service";
import { ToastComponent } from "src/app/components/toastComponent";
import {
  HouseAddress,
  HouseEnums,
  Housing,
} from "src/app/tourism/services/tourism-models.service";
import { TourismService } from "../../services/tourism.service";

@Component({
  selector: "app-housedataform",
  templateUrl: "./housedataform.component.html",
  styleUrls: ["./housedataform.component.scss"],
})
export class HousedataformComponent implements OnInit {
  @Input() housing: Housing = null;
  isAndroid = false;
  isWeb = false;
  isLoggedIn = false;
  userId = null;
  apiKey = null;
  appId = "";
  userForm: UntypedFormGroup;
  keys: any;
  contactMechId = "";
  housingId = "";
  selectedLeaseType = "";
  selectedPropertyType = "Land";

  public leaseType: HouseEnums[] = [];
  public rentalType: HouseEnums[] = [];
  public propertyType: HouseEnums[] = [];
  public propertyStatusType: HouseEnums[] = [];
  currencies: any;

  public fLeaseType: any;
  public fRentalType: any;
  public fPropertyType: any;
  public fPropertyStatusType: any;

  public roomLabel: string = "No of Rooms";

  private houseAddress: HouseAddress;
  public geoModel: GeoModel = null;

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;

  constructor(
    private toast: ToastComponent,
    private plt: Platform,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private pymtSrvc: PaymentService,
    public fb: UntypedFormBuilder,
    private tourService: TourismService,
    private popoverCtrl: PopoverController,
    private events: Events
  ) {
    this.userForm = fb.group({
      rentalType: [""],
      leaseType: ["", Validators.compose([Validators.required])],
      propertyType: ["", Validators.compose([Validators.required])],
      furnished: ["N"],
      propertyStatus: ["", Validators.compose([Validators.required])],
      amount: ["", Validators.compose([Validators.required])],
      noOfRooms: ["", Validators.compose([Validators.required])],
      periodOfLease: [0],
      currencyUomId: ["", Validators.compose([Validators.required])],
    });

    if (this.plt.is("cordova") || this.plt.is("android")) {
      this.isAndroid = true;
      this.isWeb = false;
    } else {
      this.isAndroid = false;
      this.isWeb = true;
    }
  }

  formErrors = {
    rentalType: [],
    leaseType: [],
    propertyType: [],
    propertyStatus: [],
    amount: [],
    noOfRooms: [],
    periodOfLease: [],
    currencyUomId: [],
  };

  validationMessages = {
    rentalType: [{ type: "required", message: "Rental Type is required." }],
    currencyUomId: [{ type: "required", message: "Currency Required." }],
    leaseType: [{ type: "required", message: "Lease Type is required." }],
    propertyType: [{ type: "required", message: "Porperty Type is required." }],
    propertyStatus: [
      { type: "required", message: "Property Status is required." },
    ],
    amount: [{ type: "required", message: "Amount is required." }],

    noOfRooms: [{ type: "required", message: "No. Of Rooms is required." }],
    periodOfLease: [
      { type: "required", message: "Period Of Lease is required." },
    ],
  };

  setFormData() {
    if (this.housing !== undefined && this.housing !== null) {
      this.fLeaseType = {
        enumId: this.housing.leaseType,
        description: this.housing.dLeaseType,
      };

      this.fPropertyStatusType = {
        enumId: this.housing.propertyStatusType,
        description: this.housing.dPropertyStatusType,
      };

      this.fPropertyType = {
        enumId: this.housing.propertyType,
        description: this.housing.dPropertyType,
      };

      this.fRentalType = {
        enumId: this.housing.rentalType,
        description: this.housing.dRentalType,
      };

      this.userForm.patchValue({
        periodOfLease: this.housing.periodOfLease,
      });

      this.userForm.patchValue({
        amount: this.housing.amount,
      });

      this.userForm.patchValue({
        noOfRooms: this.housing.noOfRooms,
      });

      this.userForm.patchValue({
        rentalType: this.fRentalType,
      });

      this.userForm.patchValue({
        leaseType: this.fLeaseType,
      });

      this.userForm.patchValue({
        propertyType: this.fPropertyType,
      });

      this.userForm.patchValue({
        propertyStatus: this.fPropertyStatusType,
      });

      this.userForm.patchValue({
        currencyUomId: {
          uomId: this.housing.currencyUomId,
          description: this.housing.currency,
        },
      });

      this.contactMechId = this.housing.contactMechId;
      this.housingId = this.housing.housingId;

      /* rentalType: [],
      leaseType: [],
      propertyType: [],
      propertyStatus: [], */

      this.geoModel = {
        country: {
          geoId: this.housing.postalAddress.countryCode,
          geoName: this.housing.postalAddress.country,
        },
      };

      if (
        this.housing.postalAddress.stateProvinceGeoId != undefined ||
        this.housing.postalAddress.stateProvinceGeoId != null
      ) {
        this.geoModel.region = {
          geoId: this.housing.postalAddress.stateProvinceGeoId,
          geoName: this.housing.postalAddress.region,
        };
      }

      if (
        this.housing.postalAddress.countyGeoId != undefined ||
        this.housing.postalAddress.countyGeoId != null
      ) {
        this.geoModel.district = {
          geoId: this.housing.postalAddress.countyGeoId,
          geoName: this.housing.postalAddress.district,
        };
      }

      if (
        this.housing.postalAddress.cityGeoId != undefined ||
        this.housing.postalAddress.cityGeoId != null
      ) {
        this.geoModel.city = {
          geoId: this.housing.postalAddress.cityGeoId,
          geoName: this.housing.postalAddress.city,
        };
      }

      if (
        this.housing.postalAddress.suburbId != undefined ||
        this.housing.postalAddress.suburbId != null
      ) {
        this.geoModel.suburb = {
          geoId: this.housing.postalAddress.suburbId,
          geoName: this.housing.postalAddress.suburb,
        };
      }

      if (
        this.housing.postalAddress.directions != undefined ||
        this.housing.postalAddress.directions != null
      ) {
        this.geoModel.directions = this.housing.postalAddress.directions;
      }

      if (
        this.housing.postalAddress.postalCode != undefined ||
        this.housing.postalAddress.postalCode != null
      ) {
        this.geoModel.postalCode = this.housing.postalAddress.postalCode;
      }

      if (
        this.housing.postalAddress.latitude != undefined ||
        this.housing.postalAddress.latitude != null
      ) {
        this.geoModel.latitude = this.housing.postalAddress.latitude;
      }

      if (
        this.housing.postalAddress.longitude != undefined ||
        this.housing.postalAddress.longitude != null
      ) {
        this.geoModel.longitude = this.housing.postalAddress.longitude;
      }

      if (
        this.housing.postalAddress.unitNumber != undefined ||
        this.housing.postalAddress.unitNumber != null
      ) {
        this.geoModel.unitNumber = this.housing.postalAddress.unitNumber;
      }

      if (
        this.housing.postalAddress.address2 != undefined ||
        this.housing.postalAddress.address2 != null
      ) {
        this.geoModel.address2 = this.housing.postalAddress.address2;
      }

      if (
        this.housing.ImageUrls != undefined &&
        this.housing.ImageUrls.length > 0 &&
        this.housing.ImageUrls[0].imageUrl != null
      ) {
        this.image =
          URL_MOQUI_DUTILS_NOAUTH +
          "getResource?inline=true&pathname=" +
          this.housing.ImageUrls[0].imageUrl;
      }
    }
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.setFormData();

    let defaultCurrency = {
      uomId: "GHS",
      description: "Ghanaian cedi",
    };

    this.userForm.patchValue({
      currencyUomId: defaultCurrency,
    });

    this.appId = AuthenticationService.env.appId;

    this.getCurrencyList();

    this.tourService.getHousingEnumData(this.remoteSvrc).subscribe(
      (data) => {
        //this.leaseType = data.LeaseTypeEnums;
        this.leaseType = data.ProviderLeaseTypeEnums;
        this.rentalType = data.RentalTypeEnums;
        this.propertyStatusType = data.PropertyStatusTypeEnums;
        this.propertyType = data.PropertyTypeEnums;
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }

  addFormControl(name: string, formGroup: UntypedFormGroup): void {
    this.userForm.addControl(name, formGroup);
  }

  isSaving = false;
  async submitForm(rpost) {
    // console.log(rpost);
    if (this.isSaving) {
      return;
    }

    this.houseAddress = {
      appId: this.appId,
      postalCode: rpost.geo.postalCode,
      address1: rpost.geo.address1,
      address2: rpost.geo.address2,
      suburbId: rpost.geo.suburb?.geoId,
      cityGeoId: rpost.geo.cityLine?.geoId,
      countyGeoId: rpost.geo.district?.geoId,
      stateProvinceGeoId: rpost.geo.statePRLine?.geoId,
      countryCode: rpost.geo.countryCode?.geoId,
      contactMechId: this.contactMechId,
      unitNumber: rpost.geo.unitNumber,
      latitude: rpost.geo.latitude,
      longitude: rpost.geo.longitude,
      directions: rpost.geo.direction,
    };

    this.formData.append("housingId", this.housingId);
    this.formData.append("appId", this.appId);
    this.formData.append("userId", this.userId);
    this.formData.append("contactMechId", this.contactMechId);
    this.formData.append("rentalType", rpost.rentalType.enumId);
    this.formData.append("leaseType", rpost.leaseType.enumId);
    this.formData.append("propertyType", rpost.propertyType.enumId);
    this.formData.append("propertyStatusType", rpost.propertyStatus.enumId);
    this.formData.append("amount", rpost.amount);
    this.formData.append("noOfRooms", rpost.noOfRooms);
    this.formData.append("periodOfLease", rpost.periodOfLease);
    this.formData.append("currencyUomId", rpost.currencyUomId.uomId);
    if (rpost.furnished) {
      this.formData.append("furnished", rpost.furnished);
    }

    this.formData.append("postalAddress", JSON.stringify(this.houseAddress));
    this.isSaving = true;
    this.tourService
      .saveHousing(this.formData, this.apiKey, this.remoteSvrc)
      .subscribe(
        async (data) => {
          this.formData.delete("appId");
          this.formData.delete("userId");
          this.formData.delete("rentalType");
          this.formData.delete("leaseType");
          this.formData.delete("propertyType");
          this.formData.delete("propertyStatus");
          this.formData.delete("amount");
          this.formData.delete("noOfRooms");
          this.formData.delete("periodOfLease");
          this.formData.delete("measure");
          this.formData.delete("postalAddress");
          this.formData.delete("currencyUomId");
          if (rpost.furnished) {
            this.formData.delete("furnished");
          }

          this.image = null;

          if (data.httpStatus == 200) {
            this.userForm.reset();

            this.events.publish("housedata:created", {
              user: null,
              time: new Date(),
            });

            await this.popoverCtrl.dismiss({});
          }
          this.isSaving = false;
          this.toast.processResponse(data);
        },
        (err) => {
          this.isSaving = false;
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

  async cancelModal() {
    await this.popoverCtrl.dismiss({});
  }

  getRandomString(length) {
    var randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  formData = new FormData();
  image: any;
  imageSelected(evt) {
    let self = this;

    let files: FileList = evt.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      let file = files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        self.image = reader.result;

        /*  self.images.push(self.image);
        self.fileNames.push(file.name); */

        let file2upload = self.image.split(",", 2)[1];

        const blobFile = new Blob([file2upload]);

        self.formData.append("reqFile", blobFile, this.getRandomString(15));
      };
    }
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source,
    });

    this.image = image.webPath;

    let blob = await fetch(image.webPath).then((r) => r.blob());

    let filename = new Date().getTime().toString();
    this.formData.append("reqFile", blob, filename);
  }

  async selectImageSource() {
    const buttons = [
      {
        text: "Take Photo",
        icon: "camera",
        handler: () => {
          this.addImage(CameraSource.Camera);
        },
      },
      {
        text: "Choose From Photos Photo",
        icon: "image",
        handler: () => {
          this.addImage(CameraSource.Photos);
        },
      },
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is("hybrid")) {
      buttons.push({
        text: "Choose a File",
        icon: "attach",
        handler: () => {
          this.fileInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      buttons,
    });
    await actionSheet.present();
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
}
