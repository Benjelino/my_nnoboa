import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import {
  ActionSheetController,
  ModalController,
  Platform,
} from "@ionic/angular";

import { ToastComponent } from "../../components/toastComponent";
import { Location } from "@angular/common";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

import { from, Subscription } from "rxjs";

import { IonicSelectableComponent } from "ionic-selectable";

import {
  PostalAddress,
  City,
  IAppLocale,
  IPartyContactProfile,
  GeoModel,
} from "src/app/base-services/common-service/models/common-model.service";
import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ProfileService } from "../services/profile.service";
import { TestingService } from "src/app/base-services/testing-service/testing.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { PagingService } from "../services/paging.service";
import { GeoService } from "src/app/geo/services/geo.service";

const DEFAULT_CURRENCY = "Ghanaian cedi";
const DEFAULT_CURRENCY_CODE = "GHS";

const DEFAULT_COUNTRY = "Ghana";
const DEFAULT_COUNTRY_CODE = "GHA";
const DEFAULT_REGION_STATE = "Ashanti";
const DEFAULT_REGION_STATE_CODE = "GHA_AS";
const DEFAULT_COUNTY = "Kumasi Metro"; // Kumasi (metropolitan area) is both a district and city
const DEFAULT_COUNTYCODE = "GHA_AS_K013";
const DEFAULT_CITY = "Kumasi";
const DEFAULT_CITYCODE = "GHA_AS_KSI";

const DEFAULT_LOCALE = "en_GH";
const DEFAULT_TIME_ZONE = "GMT/UTC+0";

const DEFAULT_IMAGE = "Audi";
const DEFAULT_WELCOME_MSG = "Hey, how can I help?";

@Component({
  selector: "app-profile-edit",
  templateUrl: "./profile-edit.page.html",
  styleUrls: ["./profile-edit.page.scss"],
})
export class ProfileEditPage implements OnInit {
  @ViewChild("logoFileInput", { static: false }) logoFileInput: ElementRef;
  @ViewChild("avatarFileInput", { static: false }) avatarFileInput: ElementRef;

  @Input() toggled: boolean;
  @Input() displayCancel: string = "false";
  @Input() partyContactProfile: IPartyContactProfile;
  @Output() public EventEmitted: EventEmitter<any> = new EventEmitter<any>();

  rForm: UntypedFormGroup = new UntypedFormGroup({});
  formData = new FormData();

  location: PostalAddress;

  isContactTheSame: string = "Y";
  isPerson: string = "Y";
  isShowExtra = true;
  isShowPerson = true;
  prefContactMethod: string = "PHONE";
  appLocale: IAppLocale = AuthenticationService.env.appLocale;

  selectedCurrency: string = DEFAULT_CURRENCY;
  selectedCurrencyCode: string = DEFAULT_CURRENCY_CODE;

  selectedCountry: string = DEFAULT_COUNTRY;
  countryCode: string = DEFAULT_COUNTRY_CODE;
  selectedRegion: string = DEFAULT_REGION_STATE;
  selectedRegionCode: string = DEFAULT_REGION_STATE_CODE;
  selectedCounty: string = DEFAULT_COUNTY;
  selectedCountyCode: string = DEFAULT_COUNTYCODE;
  selectedCity: string = DEFAULT_CITY;
  selectedCityCode: string = DEFAULT_CITYCODE;

  locale: string = DEFAULT_LOCALE;
  timeZone: string = DEFAULT_TIME_ZONE;
  image: string = DEFAULT_IMAGE;
  welcomeMsg: string = DEFAULT_WELCOME_MSG;

  avatar: any;
  logo: any;
  dataLoaded = false;
  geoModel: GeoModel = null;
  fieldAlert: string = "This field is required";

  navigation;

  resourceUrl = `${URL_MOQUI_DUTILS_NOAUTH}getResource?inline=true&pathname=`;

  // for testing
  testing: boolean = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private toastCtrl: ToastComponent,
    private psprof: ProfileService,
    private paging: PagingService,
    private sysLocation: Location,
    private testingSvrc: TestingService,
    public actionSheetController: ActionSheetController,
    private plt: Platform,
    public modalController: ModalController,
    private events: Events,
    private geoSvrc: GeoService
  ) {
    this.buildForm();

    this.navigation = this.router.getCurrentNavigation();

    this.rForm.get("isContactSame").valueChanges.subscribe(() => {
      this.isShowExtra = true;
      this.isContactTheSame = this.rForm.get("isContactSame").value;

      if (this.isContactTheSame == "N") {
        this.isShowExtra = true;
      } else {
        this.isShowExtra = false;
      }
    });

    this.rForm.get("isPersonReg").valueChanges.subscribe(() => {
      this.isShowPerson = true;
      this.isPerson = this.rForm.get("isPersonReg").value;

      if (this.isPerson == "N") {
        this.isShowPerson = false;
        this.rForm.get("firstName").clearValidators();
        this.rForm.get("lastName").clearValidators();
        this.rForm.get("companyName").setValidators([Validators.required]);

        this.rForm.get("firstName").updateValueAndValidity();
        this.rForm.get("lastName").updateValueAndValidity();
        this.rForm.get("companyName").updateValueAndValidity();
      } else {
        this.isShowPerson = true;
        this.rForm.get("companyName").clearValidators();
        this.rForm.get("companyName").updateValueAndValidity();
        this.rForm.get("firstName").setValidators([Validators.required]);
        this.rForm.get("lastName").setValidators([Validators.required]);

        this.rForm.get("firstName").updateValueAndValidity();
        this.rForm.get("lastName").updateValueAndValidity();
      }
    });
  }

  ionViewDidEnter() {}

  async ngOnInit() {
    console.log(
      "ProfileFormPage::ngOnInit() this.partyContactProfile",
      JSON.stringify(this.partyContactProfile)
    );

    if (
      this.partyContactProfile != undefined ||
      this.partyContactProfile != null
    ) {
      this.geoModel = {
        country: {
          geoId: this.partyContactProfile.postalAddress.countryCode,
          geoName: this.partyContactProfile.postalAddress.country,
        },
        address1: this.partyContactProfile.postalAddress.address1,
        address2: this.partyContactProfile.postalAddress.address2,
        city: {
          geoId: this.partyContactProfile.postalAddress.cityGeoId,
          geoName: this.partyContactProfile.postalAddress.city,
        },
        district: {
          geoId: this.partyContactProfile.postalAddress.countyGeoId,
          geoName: this.partyContactProfile.postalAddress.county,
        },
        latitude: this.partyContactProfile.postalAddress.latitude,
        longitude: this.partyContactProfile.postalAddress.longitude,
        postalCode: this.partyContactProfile.postalAddress.postalCode,
        region: {
          geoId: this.partyContactProfile.postalAddress.stateProvinceGeoId,
          geoName: this.partyContactProfile.postalAddress.stateProvince,
        },
        unitNumber: this.partyContactProfile.postalAddress.unitNumber,
      };
    }

    if (undefined != this.partyContactProfile) {
      if (this.partyContactProfile?.userProfile?.userLogo != undefined) {
        if (!this.partyContactProfile.userProfile.userLogo.startsWith("http")) {
          this.logo =
            this.resourceUrl + this.partyContactProfile.userProfile.userLogo;
        } else {
          this.logo = this.partyContactProfile.userProfile.userLogo;
        }
      }

      if (this.partyContactProfile?.userProfile?.photoUrl != undefined) {
        if (!this.partyContactProfile.userProfile.photoUrl.startsWith("http")) {
          this.avatar =
            this.resourceUrl + this.partyContactProfile.userProfile.photoUrl;
        } else {
          this.avatar = this.partyContactProfile.userProfile.photoUrl;
        }
      }

      if (Utils.isStringEmpty(this.appLocale)) {
        this.selectedCurrency = DEFAULT_CURRENCY;
        this.selectedCurrencyCode = DEFAULT_CURRENCY_CODE;
        this.selectedCountry = DEFAULT_COUNTRY;
        this.countryCode = DEFAULT_COUNTRY_CODE;
        this.selectedRegion = DEFAULT_REGION_STATE;
        this.selectedRegionCode = DEFAULT_REGION_STATE_CODE;
        this.selectedCounty = DEFAULT_COUNTY;
        this.selectedCountyCode = DEFAULT_COUNTYCODE;
        this.selectedCity = DEFAULT_CITY;
        this.selectedCityCode = DEFAULT_CITYCODE;
      } else {
        if (Utils.isStringEmpty(this.appLocale.appCurrencyCode)) {
          this.selectedCurrency = DEFAULT_CURRENCY;
          this.selectedCurrencyCode = DEFAULT_CURRENCY_CODE;
        } else {
          this.selectedCurrency = this.appLocale.appCurrency;
          this.selectedCurrencyCode = this.appLocale.appCurrencyCode;
        }

        if (Utils.isStringEmpty(this.appLocale.appCountryCode)) {
          this.selectedCountry = DEFAULT_COUNTRY;
          this.countryCode = DEFAULT_COUNTRY_CODE;

          // cannot config city, county and region without country
          this.selectedRegion = DEFAULT_REGION_STATE;
          this.selectedRegionCode = DEFAULT_REGION_STATE_CODE;
          this.selectedCounty = DEFAULT_COUNTY;
          this.selectedCountyCode = DEFAULT_COUNTYCODE;
          this.selectedCity = DEFAULT_CITY;
          this.selectedCityCode = DEFAULT_CITYCODE;
        } else {
          this.selectedCountry = this.appLocale.appCountry;
          this.countryCode = this.appLocale.appCountryCode;

          if (Utils.isStringEmpty(this.appLocale.appRegionCode)) {
            this.selectedRegion = DEFAULT_REGION_STATE;
            this.selectedRegionCode = DEFAULT_REGION_STATE_CODE;

            this.selectedCounty = DEFAULT_COUNTY;
            this.selectedCountyCode = DEFAULT_COUNTYCODE;
            this.selectedCity = DEFAULT_CITY;
            this.selectedCityCode = DEFAULT_CITYCODE;
          } else {
            this.selectedRegion = this.appLocale.appRegion;
            this.selectedRegionCode = this.appLocale.appRegionCode;

            if (Utils.isStringEmpty(this.appLocale.appCountyCode)) {
              this.selectedCounty = DEFAULT_COUNTY;
              this.selectedCountyCode = DEFAULT_COUNTYCODE;
            } else {
              this.selectedCounty = this.appLocale.appCounty;
              this.selectedCountyCode = this.appLocale.appCountyCode;
            }
            if (Utils.isStringEmpty(this.appLocale.appCityCode)) {
              this.selectedCity = DEFAULT_CITY;
              this.selectedCityCode = DEFAULT_CITYCODE;
            } else {
              this.selectedCity = this.appLocale.appCity;
              this.selectedCityCode = this.appLocale.appCityCode;
            }
          }
        }
      }

      this.setFormData(this.partyContactProfile);
    }
  }

  buildForm() {
    this.rForm = this.formBuilder.group({
      filename: "",
      firstName: [null, Validators.required],
      middleName: "",
      lastName: [null, Validators.required],
      preferredName: "",

      companyName: "",
      slogan: "",

      contactFirstName: [null, Validators.required],
      contactMiddleName: "",
      contactLastName: [null, Validators.required],
      contactCellPhone: [null, Validators.required],
      contactEmailAddress: [null, ""],

      selectedCurrencyCode: "",
      locale: "",
      timeZone: "",

      welcomeMsg: "",
      image: "",
      prefContactMethod: "",
      isContactSame: "",
      isPersonReg: "",
    });
  }

  public emitEvent(eventData: any): void {
    this.EventEmitted.emit(eventData);
  }

  goToNext() {
    console.log("ProviderSubscriptionPage::goToNext() ... ");
    //this.paging.goToNextPage();
    PagingService.goToNextPage();
  }

  async selectLogoImageSource() {
    const buttons = [
      {
        text: "Take Photo",
        icon: "camera",
        handler: () => {
          this.addLogoImage(CameraSource.Camera);
        },
      },
      {
        text: "Choose From Photos Image",
        icon: "image",
        handler: () => {
          this.addLogoImage(CameraSource.Photos);
        },
      },
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is("hybrid")) {
      buttons.push({
        text: "Choose a File",
        icon: "attach",
        handler: () => {
          this.logoFileInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      buttons,
    });
    await actionSheet.present();
  }

  async selectAvatarImageSource() {
    const buttons = [
      {
        text: "Take Photo",
        icon: "camera",
        handler: () => {
          this.addAvatarImage(CameraSource.Camera);
        },
      },
      {
        text: "Choose From Photos Image",
        icon: "image",
        handler: () => {
          this.addAvatarImage(CameraSource.Photos);
        },
      },
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is("hybrid")) {
      buttons.push({
        text: "Choose a File",
        icon: "attach",
        handler: () => {
          this.avatarFileInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      buttons,
    });
    await actionSheet.present();
  }

  async addLogoImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source,
    });

    this.logo = image.webPath;

    let blob = await fetch(image.webPath).then((r) => r.blob());

    let filename = new Date().getTime().toString();
    this.formData.append("logo", blob, filename);
  }

  async addAvatarImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source,
    });

    this.avatar = image.webPath;

    let blob = await fetch(image.webPath).then((r) => r.blob());

    let filename = new Date().getTime().toString();
    this.formData.append("avatar", blob, filename);
  }

  onContactMethod1() {}

  showExtraForm() {
    this.isShowExtra = false;
    this.isContactTheSame = "Y";
  }

  closeExtraForm() {
    this.isShowExtra = true;
    this.isContactTheSame = "N";
  }

  showIsPersonForm() {
    this.isShowPerson = true;
    this.isPerson = "Y";
  }

  closeIsPersonForm() {
    this.isShowPerson = false;
    this.isPerson = "N";
  }

  radioGroupChange() {}

  onContactMethod() {}

  ionChangeCurrency(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.selectedCurrencyCode = event.value.uomId;
    this.selectedCurrency = event.value.description;
  }

  ionChangeCountry(event: { component: IonicSelectableComponent; value: any }) {
    this.countryCode = event.value.geoId;
    this.selectedCountry = event.value.geoName;

    this.getStateProvinceRegionList(this.countryCode);
  }

  ionChangeRegion(event: { component: IonicSelectableComponent; value: any }) {
    this.selectedRegion = event.value.geoName;
    this.selectedRegionCode = event.value.geoId;

    this.getCitiesList(this.countryCode, this.selectedRegionCode);
  }

  getCountryCurrencyList(countryCode) {
    let self = this;
    this.countryCode = countryCode;

    this.geoSvrc.getCountryCurrencyList().then(
      (data) => {
        if (data["httpStatus"] === "200") {
          self.countries = data["CountryCodes"];
          self.currencies = data["CurrencyCodes"];
        }
      },
      (err) => {
        this.toastCtrl.presentFailedToast(
          "ProfileFormPage::getCountryCurrencyList() err: " +
            JSON.stringify(err)
        );
      }
    );
  }

  getStateProvinceRegionList(countryCode: string, noCities?: string) {
    //console.log("getStateProvinceRegionList() noCities", noCities);
    let self = this;
    let msgBody = { countryCode: countryCode };

    this.geoSvrc.getStateProvinceRegionList(msgBody).then(
      (data) => {
        self.stateCodes = data;
        if (self.stateCodes && self.stateCodes.length > 0) {
          if (Utils.isStringEmpty(noCities)) {
            self.region = data[0];
            //console.log("getStateProvinceRegionList() self.region", JSON.stringify(self.region));

            self.selectedRegion = self.region.geoName;
            self.selectedRegionCode = self.region.geoId;
            self.rForm.patchValue({
              statePRLine: self.region,
            });

            self.getCitiesList(countryCode, self.selectedRegionCode);
          }
        }
      },
      (err) => {
        this.toastCtrl.presentFailedToast(
          "ProfileFormPage::getStateProvinceRegionList() err: " +
            JSON.stringify(err)
        );
      }
    );
  }

  getCitiesList(countryCode, regionCode, noCity?: string) {
    //console.log("getCitiesList() noCity", noCity);
    let self = this;
    this.geoSvrc
      .getCitiesListByPage(
        countryCode,
        regionCode,
        this.offSet.toString(),
        this.limit.toString()
      )
      .subscribe(
        (data) => {
          self.cities = data["Cities"] as City[];

          if (
            Utils.isStringEmpty(noCity) &&
            self.cities &&
            self.cities.length > 0
          ) {
            self.city = self.cities[0];
            self.rForm.patchValue({
              cityLine: self.city,
            });
            //console.log("getCitiesList() self.city", JSON.stringify(self.city));
            self.selectedCity = self.city.geoName;
            self.selectedCityCode = self.city.geoId;
            self.selectedCounty = self.city.district;
            self.selectedCountyCode = self.city.districtId;
          }
        },
        () => {
          self.toastCtrl.presentFailedToast(
            "Error Occured , Please try again !!!"
          );
        }
      );
  }

  /////////
  offSet = 0;
  limit = 30;

  currencies: any = [];
  currency: any = {
    description: DEFAULT_CURRENCY,
    uomId: DEFAULT_CURRENCY_CODE,
  };

  countries: any = [];
  country: any = {
    geoName: DEFAULT_COUNTRY,
    geoId: DEFAULT_COUNTRY_CODE,
  };

  stateCodes: any = [];
  region: any = {
    geoName: DEFAULT_REGION_STATE,
    geoId: DEFAULT_REGION_STATE_CODE,
  };

  cities: City[];
  city: City = {
    geoName: DEFAULT_CITY,
    geoId: DEFAULT_CITYCODE,
    district: DEFAULT_COUNTY,
    districtId: DEFAULT_COUNTYCODE,
    region: DEFAULT_REGION_STATE,
    regionId: DEFAULT_REGION_STATE_CODE,
    country: DEFAULT_COUNTRY,
    countryId: DEFAULT_COUNTRY_CODE,
  };

  citiesSubscription: Subscription;

  // called when the user types a character to search
  searchCities(event) {
    //console.log("ProfileFormPage::searchCities() event.text: ", JSON.stringify(event.text));
    const qstr = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.citiesSubscription) {
      this.citiesSubscription.unsubscribe();
    }

    if (!qstr) {
      // Close any running subscription.
      if (this.citiesSubscription) {
        this.citiesSubscription.unsubscribe();
      }

      event.component.items = [];
      event.component.endSearch();
      return;
    }

    const msgBody = {
      qstr,
      offSet: this.offSet,
      limit: this.limit,
      countryCode: this.countryCode,
      regionCode: this.selectedRegionCode,
    };
    this.citiesSubscription = from(
      this.geoSvrc.getCitiesList(msgBody)
    ).subscribe((cities) => {
      // Subscription will be closed when unsubscribed manually.
      if (this.citiesSubscription.closed) {
        return;
      }

      //console.log("ProfileFormPage::searchCities() cities: ", JSON.stringify(cities));
      event.component.items = cities;
      event.component.endSearch();
    });
  }

  avatarSelected(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.avatar = reader.result;
      this.partyContactProfile.userProfile.photoUrl = file.name;

      let file2upload = this.avatar.split(",", 2)[1];

      const blobFile = new Blob([file2upload]);
      this.formData.append("avatar", blobFile, file.name);
    };
  }

  logoSelected(event) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.logo = reader.result;
      this.partyContactProfile.userProfile.userLogo = file.name;

      const blobFile = new Blob([this.logo.split(",", 2)[1]]);
      this.formData.append("logo", blobFile, file.name);
    };
  }

  presentAlert() {
    let invalid = this.findInvalidControls();
    let invaliFormat: string = "";
    for (let i = 0; i < invalid.length - 1; i++) {
      invaliFormat = invaliFormat + invalid[i] + "</br>";
    }
    invaliFormat = invaliFormat + invalid[invalid.length - 1];
  }

  public findInvalidControls(): Array<string> {
    let invalid = new Array<string>();
    const controls = this.rForm.controls;
    for (const name in controls) {
      if (controls[name][status] != "VALID") {
        invalid.push(name);
      }
    }
    return invalid;
  }

  addFormControl(name: string, formGroup: UntypedFormGroup): void {
    this.rForm.addControl(name, formGroup);
  }

  copyField(fieldName: string) {
    let post = this.rForm.value;
    switch (fieldName) {
      case "firstName":
        if (
          post.contactFirstName == null ||
          post.contactFirstName.length == 0
        ) {
          this.rForm.patchValue(
            { contactFirstName: post.firstName },
            { emitEvent: false }
          );
        }
        break;
      case "middleName":
        if (
          post.contactMiddleName == null ||
          post.contactMiddleName.length == 0
        ) {
          this.rForm.patchValue(
            { contactMiddleName: post.middleName },
            { emitEvent: false }
          );
        }
        break;
      case "lastName":
        if (post.contactLastName == null || post.contactLastName.length == 0) {
          this.rForm.patchValue(
            { contactLastName: post.lastName },
            { emitEvent: false }
          );
        }
        break;
    }
  }

  setFormData(partyContactProfile: IPartyContactProfile) {
    //console.log("setFormData() partyContactProfile",JSON.stringify(partyContactProfile));
    // we have already setup the defaults, overwrite if partyContactProfile is not null
    if (partyContactProfile?.userAccount?.currencyUomId)
      this.selectedCurrencyCode = partyContactProfile.userAccount.currencyUomId;

    if (partyContactProfile?.postalAddress?.country)
      this.selectedCountry = partyContactProfile.postalAddress.country;
    if (partyContactProfile?.postalAddress?.countryCode)
      this.countryCode = partyContactProfile.postalAddress.countryCode;
    if (partyContactProfile?.postalAddress?.stateProvince)
      this.selectedRegion = partyContactProfile.postalAddress.stateProvince;
    if (partyContactProfile?.postalAddress?.stateProvinceGeoId)
      this.selectedRegionCode =
        partyContactProfile.postalAddress.stateProvinceGeoId;

    if (partyContactProfile?.postalAddress?.county)
      this.selectedCounty = partyContactProfile.postalAddress.county;
    if (partyContactProfile?.postalAddress?.countyGeoId)
      this.selectedCountyCode = partyContactProfile.postalAddress.countyGeoId;

    if (partyContactProfile?.postalAddress?.city)
      this.selectedCity = partyContactProfile.postalAddress.city;
    if (partyContactProfile?.postalAddress?.cityGeoId)
      this.selectedCityCode = partyContactProfile.postalAddress.cityGeoId;

    let locale = partyContactProfile.userAccount.locale;
    if (Utils.isStringEmpty(locale)) {
      locale = DEFAULT_LOCALE;
    }
    this.locale = locale;

    let timeZone = partyContactProfile.userAccount.timeZone;
    if (Utils.isStringEmpty(timeZone)) {
      timeZone = DEFAULT_TIME_ZONE;
    }
    this.timeZone = timeZone;

    let welcomeMsg = partyContactProfile.userProfile.welcomeMsg;
    if (Utils.isStringEmpty(welcomeMsg)) {
      welcomeMsg = DEFAULT_WELCOME_MSG;
    }
    this.welcomeMsg = welcomeMsg;

    let image = partyContactProfile.userProfile.image;
    if (Utils.isStringEmpty(image)) {
      image = DEFAULT_IMAGE;
    }
    this.image = image;

    this.rForm.patchValue({ firstName: partyContactProfile.party.firstName });
    this.rForm.patchValue({ middleName: partyContactProfile.party.middleName });
    this.rForm.patchValue({ lastName: partyContactProfile.party.lastName });

    this.rForm.patchValue({
      contactFirstName: partyContactProfile.contactInfo.contactFirstName,
    });
    this.rForm.patchValue({
      contactMiddleName: partyContactProfile.contactInfo.contactMiddleName,
    });
    this.rForm.patchValue({
      contactLastName: partyContactProfile.contactInfo.contactLastName,
    });

    this.isContactTheSame = partyContactProfile.isContactSame;
    if (partyContactProfile.party.isPerson != undefined) {
      this.isPerson = partyContactProfile.party.isPerson;
    }

    if (
      partyContactProfile.party.isPerson != undefined &&
      "N" == partyContactProfile.party.isPerson
    ) {
      this.isShowPerson = false;
    } else {
      this.isShowPerson = true;
    }

    if ("Y" == partyContactProfile.isContactSame) {
      this.rForm.patchValue({
        contactFirstName: partyContactProfile.party.firstName,
      });
      this.rForm.patchValue({
        contactMiddleName: partyContactProfile.party.middleName,
      });
      this.rForm.patchValue({
        contactLastName: partyContactProfile.party.lastName,
      });
      this.isShowExtra = false;
    } else {
      this.isShowExtra = true;
    }

    if (partyContactProfile.userProfile.prefContactMethod != undefined) {
      this.prefContactMethod =
        partyContactProfile.userProfile.prefContactMethod;
    }

    this.rForm.patchValue({
      isContactSame: this.isContactTheSame,
    });

    this.rForm.patchValue({
      isPersonReg: this.isPerson,
    });

    this.rForm.patchValue({
      preferredName: partyContactProfile.party.nickname,
    });
    this.rForm.patchValue({
      companyName: partyContactProfile.party.organizationName,
    });

    if (null != partyContactProfile.postalAddress) {
      this.rForm.patchValue({
        addrLine1: partyContactProfile.postalAddress.address1,
      });
      this.rForm.patchValue({
        addrLine2: partyContactProfile.postalAddress.address2,
      });
      this.rForm.patchValue({
        unitNumber: partyContactProfile.postalAddress.unitNumber,
      });
      this.rForm.patchValue({
        pobox: partyContactProfile.postalAddress.pobox,
      });

      this.rForm.patchValue({
        postalCode: partyContactProfile.postalAddress.postalCode,
      });

      this.rForm.patchValue({
        latitude: partyContactProfile.postalAddress.latitude,
      });
      this.rForm.patchValue({
        longitude: partyContactProfile.postalAddress.longitude,
      });
    }

    this.rForm.patchValue({
      slogan: partyContactProfile.userProfile.userSlogan,
    });

    this.rForm.patchValue({
      contactCellPhone: partyContactProfile.phoneNumber.phone,
    });

    this.rForm.patchValue({
      contactEmailAddress: partyContactProfile.emailAddress.emailAddress,
    });

    this.rForm.patchValue({ welcomeMsg: welcomeMsg });

    this.rForm.patchValue({ locale: locale });
    this.rForm.patchValue({ timeZone: timeZone });
    this.rForm.patchValue({ prefContactMethod: this.prefContactMethod });

    this.currency = {
      description: this.selectedCurrency,
      uomId: this.selectedCurrencyCode,
    };

    this.country = {
      geoName: this.selectedCountry,
      geoId: this.countryCode,
    };

    this.region = {
      geoName: this.selectedRegion,
      geoId: this.selectedRegionCode,
    };

    this.city = {
      geoName: this.selectedCity,
      geoId: this.selectedCityCode,
      district: this.selectedCounty,
      districtId: this.selectedCountyCode,
      region: this.selectedRegion,
      regionId: this.selectedRegionCode,
    };

    if (Utils.isStringEmpty(this.appLocale)) {
      this.getCountryCurrencyList(this.countryCode);
      this.getStateProvinceRegionList(this.countryCode, "nocities");
      this.getCitiesList(this.countryCode, this.selectedRegionCode, "noCity");

      // geo items not configured, we need to get them from user
      this.rForm.patchValue({
        selectedCurrencyCode: this.currency,
        countryCode: this.country,
        statePRLine: this.region,
        cityLine: this.city,
      });
    } else {
      // some geo items are configured, we will do nothing for those
      if (
        Utils.isStringEmpty(this.appLocale.appCurrencyCode) ||
        Utils.isStringEmpty(this.appLocale.appCountryCode)
      ) {
        //console.log("setFormData() step 1 this.countryCode", this.countryCode);
        this.getCountryCurrencyList(this.countryCode);
      }

      if (Utils.isStringEmpty(this.appLocale.appCurrencyCode)) {
        this.rForm.patchValue({
          selectedCurrencyCode: this.currency,
        });
      } else {
        this.rForm.patchValue({
          selectedCurrencyCode: this.selectedCurrencyCode,
        });
      }

      if (Utils.isStringEmpty(this.appLocale.appCountryCode)) {
        // cannot config city, county and region without country
        this.rForm.patchValue({
          countryCode: this.country,
          statePRLine: this.region,
          cityLine: this.city,
        });
      } else {
        this.rForm.patchValue({
          countryCode: this.countryCode,
        });

        if (Utils.isStringEmpty(this.appLocale.appRegionCode)) {
          //console.log("setFormData() step 2 this.region", JSON.stringify(this.region));
          //console.log("setFormData() step 2 this.city", JSON.stringify(this.city));
          // cannot config city and county without region
          this.rForm.patchValue({
            statePRLine: this.region,
            cityLine: this.city,
          });
          this.getStateProvinceRegionList(this.countryCode, "nocities");
          this.getCitiesList(
            this.countryCode,
            this.selectedRegionCode,
            "noCity"
          );
        } else {
          this.rForm.patchValue({
            statePRLine: this.selectedRegion,
          });

          if (Utils.isStringEmpty(this.appLocale.appCityCode)) {
            //console.log("setFormData() step 2 this.city", JSON.stringify(this.city));
            // package the codes
            this.getCitiesList(
              this.countryCode,
              this.selectedRegionCode,
              "noCity"
            );
            //this.getCitiesList(this.countryCode, this.selectedRegionCode);
            this.rForm.patchValue({
              cityLine: this.city,
            });
          } else {
            this.rForm.patchValue({
              cityLine: this.selectedCity,
            });
          }
        }
      }
    }

    this.testDataLoaded();
  }

  testDataLoaded() {
    setTimeout(() => {
      this.dataLoaded = true;
    }, 550);
  }

  saveForm(post) {
    if (this.isPerson == "Y") {
      this.partyContactProfile.party.firstName = post.firstName;
      this.partyContactProfile.party.middleName = post.middleName;
      this.partyContactProfile.party.lastName = post.lastName;
      this.partyContactProfile.party.nickname = post.preferredName;
    } else {
      this.partyContactProfile.party.organizationName = post.companyName;
      this.partyContactProfile.userProfile.userSlogan = post.slogan;
    }

    this.partyContactProfile.party.isPerson = this.isPerson;

    this.partyContactProfile.postalAddress.address1 = post.geo.address1;
    this.partyContactProfile.postalAddress.address2 = post.geo.address2;
    this.partyContactProfile.postalAddress.unitNumber = post.geo.unitNumber;
    this.partyContactProfile.postalAddress.pobox = post.geo.postalCode;

    let city = null;
    let cityCode = null;
    let county = null;
    let countyCode = null;
    let region = null;
    let regionCode = null;
    let countryCode = null;
    let currencyCode = null;
    if (Utils.isStringEmpty(this.appLocale)) {
      // no geo item is configured, we need to get values from the user
      currencyCode = post.selectedCurrencyCode.uomId;
      countryCode = post.geo.countryCode.geoId;
      regionCode = post.geo.statePRLine.geoId;
      region = post.geo.statePRLine.geoName;
      cityCode = post.geo.cityLine.geoId;
      city = post.geo.cityLine.geoName;
    } else {
      // some geo items may be configured
      if (Utils.isStringEmpty(this.appLocale.appCurrencyCode)) {
        currencyCode = post.selectedCurrencyCode.uomId;
      } else {
        currencyCode = this.selectedCurrencyCode;
      }

      if (Utils.isStringEmpty(this.appLocale.appCountryCode)) {
        countryCode = post.geo.countryCode.geoId;
      } else {
        //countryCode = this.countryCode;
        countryCode = post.geo.countryCode.geoId;
      }
      if (Utils.isStringEmpty(this.appLocale.appRegionCode)) {
        regionCode = post.geo.statePRLine.geoId;
        region = post.geo.statePRLine.geoName;
      } else {
        regionCode = this.selectedRegionCode;
        region = this.selectedRegion;
      }
      if (Utils.isStringEmpty(this.appLocale.appCityCode)) {
        cityCode = post.geo.cityLine.geoId;
        city = post.geo.cityLine.geoName;
      } else {
        cityCode = this.selectedCityCode;
        city = this.selectedCity;
      }
    }

    this.partyContactProfile.userAccount.currencyUomId = currencyCode;

    this.partyContactProfile.postalAddress.city = city;
    this.partyContactProfile.postalAddress.cityGeoId = cityCode;
    this.partyContactProfile.postalAddress.county = county;
    this.partyContactProfile.postalAddress.countyGeoId = countyCode;
    this.partyContactProfile.postalAddress.stateProvince = region;
    this.partyContactProfile.postalAddress.stateProvinceGeoId = regionCode;
    this.partyContactProfile.postalAddress.countryCode = countryCode;

    this.partyContactProfile.postalAddress.postalCode = post.geo.postalCode;
    this.partyContactProfile.postalAddress.latitude = post.geo.latitude;
    this.partyContactProfile.postalAddress.longitude = post.geo.longitude;

    this.partyContactProfile.isContactSame = this.isContactTheSame;
    this.partyContactProfile.contactInfo.contactFirstName =
      post.contactFirstName;
    this.partyContactProfile.contactInfo.contactMiddleName =
      post.contactMiddleName;
    this.partyContactProfile.contactInfo.contactLastName = post.contactLastName;

    this.partyContactProfile.phoneNumber.phone = post.contactCellPhone;
    this.partyContactProfile.emailAddress.emailAddress =
      post.contactEmailAddress;
    this.partyContactProfile.userProfile.prefContactMethod =
      post.prefContactMethod;

    this.partyContactProfile.userProfile.image = post.image;
    this.partyContactProfile.userProfile.welcomeMsg = post.welcomeMsg;

    this.partyContactProfile.userAccount.locale = post.locale;
    this.partyContactProfile.userAccount.timeZone = post.timeZone;
  }

  /**
   * submit button for submitting now
   * @param post
   */
  isSaving = false;
  submitForm(sform) {
    let post = sform.value;
    if (this.isSaving == false) {
      this.isSaving = true;
      this.saveForm(post);

      this.psprof
        .storePartyContactProfile(this.partyContactProfile, this.formData)
        .then((res: any) => {
          if (res.httpStatus === "200") {
            this.toastCtrl.presentSuccess();
          }

          this.rForm.reset();
          this.formData.delete("avatar");
          this.formData.delete("logo");
          this.isSaving = false;

          //goback to the userprofile
          //this.sysLocation.back();
          this.router.navigate(["/menu/client-dashboard"]);
        })
        .catch(() => {
          this.isSaving = false;
          this.toastCtrl.presentFailure();
        });
    }
  }

  cancel() {
    this.router.navigateByUrl("/menu/profile");
  }

  regData: IPartyContactProfile;

  loadSubscriptionContactData(rForm) {
    let self = this;
    let value = rForm["value"];
    let filename_p = value.filename;

    let filename = "assets/testdata/dcubeappc1_profile.json";
    if (Utils.stringNotEmpty(filename_p)) {
      filename = filename_p;
    }

    this.testingSvrc.loadSubscriptionContactData(filename).then(
      (data) => {
        self.regData = <IPartyContactProfile>data;

        self.setFormData(self.regData);
      },
      (err) => {
        this.toastCtrl.presentFailedToast(
          "ProfileFormPage::loadSubscriptionContactData() err: " +
            JSON.stringify(err)
        );
      }
    );
  }
}
