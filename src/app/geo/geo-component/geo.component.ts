import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { IonicSelectableComponent } from "ionic-selectable";
import { Subscription, from } from "rxjs";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

import {
  City,
  District,
  GeoModel,
  IAppLocale,
  GeoResults,
  GeoData,
} from "src/app/base-services/common-service/models/common-model.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ProfileService } from "src/app/profile/services/profile.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";

import { GeoService } from "../services/geo.service";

const DEFAULT_COUNTRY = "Ghana";
const DEFAULT_COUNTRY_CODE = "GHA";
const DEFAULT_REGION_STATE = "Ashanti";
const DEFAULT_REGION_STATE_CODE = "GHA_AS";
const DEFAULT_COUNTY = "Kumasi Metro"; // Kumasi (metropolitan area) is both a district and city

const DEFAULT_CITY = "Kumasi";
//const DEFAULT_CITYCODE = "GHA_AS_KSI";
const DEFAULT_COUNTYCODE = "";
const DEFAULT_CITYCODE = "";

/* const DEFAULT_COUNTYCODE = "GHA_AS_K013";
const DEFAULT_CITYCODE = "GHA_AS_K013_KSI"; */

@Component({
  selector: "app-geo",
  templateUrl: "./geo.component.html",
  styleUrls: ["./geo.component.scss"],
})
export class GeoComponent implements OnInit {
  @Output()
  formReady: EventEmitter<UntypedFormGroup> = new EventEmitter<UntypedFormGroup>();

  @Input() partyContactProfile: GeoModel;
  @Input() formType: string = "max";
  @Input() companyUserId: string;
  rForm: UntypedFormGroup = new UntypedFormGroup({});

  //address1, address2, unit number, city,state, district,
  //country,postal code, latitude and longitude
  @Input() showRegion: boolean = false;
  @Input() showDistrict: boolean = false;
  @Input() showCity: boolean = false;
  @Input() showSuburb: boolean = false;
  @Input() showPostalCode: boolean = false;
  @Input() showAddress1: boolean = false;
  @Input() showAddress2: boolean = false;
  @Input() showUnitNumber: boolean = false;
  @Input() showCordinates: boolean = false;
  @Input() showDirection: boolean = false;
  @Input() showComment: boolean = false;

  geoData: GeoData = null;

  appLocale: IAppLocale = AuthenticationService.env.appLocale;

  selectedCountry: string = DEFAULT_COUNTRY;
  countryCode: string = DEFAULT_COUNTRY_CODE;
  selectedRegion: string = DEFAULT_REGION_STATE;
  selectedRegionCode: string = DEFAULT_REGION_STATE_CODE;
  selectedDistrict: string = "";
  selectedDistrictCode: string = "";
  selectedCity: string = DEFAULT_CITY;
  selectedCityCode: string = DEFAULT_CITYCODE;

  address1: string = "";
  address2: string = "";
  postalCode: string = "";
  unitNumber: string = "";
  longitude: string = "";
  latitude: string = "";
  //suburb: string = "";
  direction: string = "";
  comment: string = "";

  isLoggedIn = false;
  userId: string;
  apiKey: string;

  @ViewChild("cityComponent") cityComponent: IonicSelectableComponent;
  cityForm: UntypedFormGroup;
  cityNameControl: UntypedFormControl;

  @ViewChild("suburbComponent") suburbComponent: IonicSelectableComponent;
  suburbForm: UntypedFormGroup;
  suburbNameControl: UntypedFormControl;

  isCityAdd = false;
  isSuburbAdd = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastCtrl: ToastComponent,
    private geoSvrc: GeoService,
    private remoteSvrc: RemoteService,
    private auth: AuthenticationService,
    private toast: ToastComponent
  ) {}

  /*  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
    this.formReady.emit(this.rForm);
  } */

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.buildForm();
    this.formReady.emit(this.rForm);

    this.cityNameControl = this.formBuilder.control(null, Validators.required);
    this.suburbNameControl = this.formBuilder.control(
      null,
      Validators.required
    );
    this.cityForm = this.formBuilder.group({
      cityName: this.cityNameControl,
    });
    this.suburbForm = this.formBuilder.group({
      suburbName: this.suburbNameControl,
    });

    this.getCountryList();
    if (undefined != this.partyContactProfile || undefined != this.appLocale) {
      if (Utils.isStringEmpty(this.appLocale)) {
        this.selectedCountry = DEFAULT_COUNTRY;
        this.countryCode = DEFAULT_COUNTRY_CODE;
        this.selectedRegion = DEFAULT_REGION_STATE;
        this.selectedRegionCode = DEFAULT_REGION_STATE_CODE;
        /*   this.selectedDistrict = DEFAULT_COUNTY;

        
        this.selectedCity = DEFAULT_CITY;
        this.selectedCityCode = DEFAULT_CITYCODE; */
      } else {
        if (Utils.isStringEmpty(this.appLocale.appCountryCode)) {
          this.selectedCountry = DEFAULT_COUNTRY;
          this.countryCode = DEFAULT_COUNTRY_CODE;

          // cannot config city, county and region without country
          this.selectedRegion = DEFAULT_REGION_STATE;
          this.selectedRegionCode = DEFAULT_REGION_STATE_CODE;
          /*  this.selectedDistrict = DEFAULT_COUNTY;
        
          
          this.selectedCity = DEFAULT_CITY;
          this.selectedCityCode = DEFAULT_CITYCODE; */
        } else {
          this.selectedCountry = this.appLocale.appCountry;
          this.countryCode = this.appLocale.appCountryCode;

          if (Utils.isStringEmpty(this.appLocale.appRegionCode)) {
            this.selectedRegion = DEFAULT_REGION_STATE;
            this.selectedRegionCode = DEFAULT_REGION_STATE_CODE;

            /*   this.selectedDistrict = DEFAULT_COUNTY;
           
            
            this.selectedCity = DEFAULT_CITY;
            this.selectedCityCode = DEFAULT_CITYCODE; */
          } else {
            this.selectedRegion = this.appLocale.appRegion;
            this.selectedRegionCode = this.appLocale.appRegionCode;

            /*    if (Utils.isStringEmpty(this.appLocale.appCountyCode)) {
              this.selectedDistrict = DEFAULT_COUNTY;
              this.selectedDistrictCode = DEFAULT_COUNTYCODE;
            } else {
              this.selectedDistrict = this.appLocale.appCounty;
              this.selectedDistrictCode = this.appLocale.appCountyCode;
            } */

            /*    if (Utils.isStringEmpty(this.appLocale.appCityCode)) {
              this.selectedCity = DEFAULT_CITY;
              this.selectedCityCode = DEFAULT_CITYCODE;
            } else {
              this.selectedCity = this.appLocale.appCity;
              this.selectedCityCode = this.appLocale.appCityCode;
            } */
          }
        }
      }

      this.setFormData(this.partyContactProfile);
    }
  }
  ionChangeDistrict(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.selectedDistrict = event.value.geoName;
    this.selectedDistrictCode = event.value.geoId;

    if (this.showCity) {
      this.getCitiesList(
        this.countryCode,
        this.selectedRegionCode,
        this.selectedDistrictCode
      );
    }
  }

  ionChangeCity(event: { component: IonicSelectableComponent; value: any }) {
    this.selectedCity = event.value.geoName;
    this.selectedCityCode = event.value.geoId;
    if (this.showCordinates) {
      this.getCityLocationDetails();
    }
    if (this.showSuburb) {
      this.getSuburbList(
        this.countryCode,
        this.selectedRegionCode,
        this.selectedDistrictCode,
        this.selectedCityCode
      );
    }
  }

  getCityLocationDetails() {
    let self = this;
    let city =
      this.selectedCountry +
      "," +
      this.selectedRegion +
      "," +
      this.selectedCity;
    this.geoSvrc.getLocationGeoDetails(city, this.remoteSvrc).subscribe(
      (data) => {
        let result = data as GeoResults;

        if (result.results.length > 0) {
          self.rForm.patchValue({
            latitude: result.results[0].geometry.lat,
            longitude: result.results[0].geometry.lng,
          });
        }
      },
      (err) => {
        // this.toast.presentFailedToast("Server Error | " + JSON.stringify(err));
        console.log("Server Error: " + JSON.stringify(err));
      }
    );
  }

  buildForm() {
    this.rForm = this.formBuilder.group({
      countryCode: [null, Validators.required],
    });

    if (this.showRegion) {
      /* this.rForm.addControl(
        "statePRLine",
        new FormControl(null, Validators.required)
      ); */

      this.rForm = this.formBuilder.group({
        countryCode: [null, Validators.required],
        statePRLine: [null, Validators.required],
      });
    }

    if (this.showDistrict) {
      this.rForm.addControl("district", new UntypedFormControl(null));
    }

    if (this.showCity) {
      this.rForm.addControl("cityLine", new UntypedFormControl(null));
    }

    if (this.showSuburb) {
      this.rForm.addControl("suburb", new UntypedFormControl(null));
    }

    if (this.showPostalCode) {
      this.rForm.addControl("postalCode", new UntypedFormControl(null));
    }

    if (this.showAddress1) {
      this.rForm.addControl("address1", new UntypedFormControl(null));
    }

    if (this.showAddress2) {
      this.rForm.addControl("address2", new UntypedFormControl(null));
    }

    if (this.showComment) {
      this.rForm.addControl("comment", new UntypedFormControl(null));
    }

    if (this.showUnitNumber) {
      this.rForm.addControl("unitNumber", new UntypedFormControl(null));
    }

    if (this.showDirection) {
      this.rForm.addControl("direction", new UntypedFormControl(null));
    }

    if (this.showCordinates) {
      this.rForm.addControl("latitude", new UntypedFormControl(null));
      this.rForm.addControl("longitude", new UntypedFormControl(null));
    }
  }

  ionChangeCountry(event: { component: IonicSelectableComponent; value: any }) {
    this.countryCode = event.value.geoId;
    this.selectedCountry = event.value.geoName;

    this.getStateProvinceRegionList(this.countryCode);
  }

  ionChangeRegion(event: { component: IonicSelectableComponent; value: any }) {
    this.selectedRegion = event.value.geoName;
    this.selectedRegionCode = event.value.geoId;

    if (this.showDistrict) {
      this.getDistrictList(this.countryCode, this.selectedRegionCode);
    }
  }

  getCountryList() {
    let self = this;

    if (Utils.isObjectEmpty(this.countries)) {
      this.geoSvrc.getCountryList().then(
        (data) => {
          self.countries = data;

          /*   console.log(
            "SubscriptionOperationPage::getCountryList() self.countries: " +
              JSON.stringify(self.countries)
          ); */

          self.getStateProvinceRegionList(self.countryCode);
        },
        (err) => {
          console.log(
            "SubscriptionOperationPage::getCountryList() err: " +
              JSON.stringify(err)
          );
        }
      );
    }
  }

  getCountryCurrencyList(countryCode) {
    let self = this;
    this.countryCode = countryCode;

    this.geoSvrc.getCountryCurrencyList().then(
      (data) => {
        if (data["httpStatus"] === "200") {
          self.countries = data["CountryCodes"];
          //self.currencies = data["CurrencyCodes"];
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
    let self = this;
    let msgBody = { countryCode: countryCode };

    this.geoSvrc.getStateProvinceRegionList(msgBody).then(
      (data) => {
        self.stateCodes = data;
        if (self.stateCodes && self.stateCodes.length > 0) {
          if (Utils.isStringEmpty(noCities)) {
            //self.region = data[0];
            //console.log("getStateProvinceRegionList() self.region", JSON.stringify(self.region));
            /*  self.selectedRegion = self.region.geoName;
            self.selectedRegionCode = self.region.geoId;
            self.rForm.patchValue({
              statePRLine: self.region,
            }); */
            // self.getCitiesList(countryCode, self.selectedRegionCode);
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

  getCitiesList(countryCode, regionCode, districtCode, noCity?: string) {
    //console.log("getCitiesList() noCity", noCity);
    let self = this;
    this.geoSvrc
      .getCitiesByCountryRegionDistrictPage(
        countryCode,
        regionCode,
        districtCode,
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
            /*  self.rForm.patchValue({
              cityLine: self.city,
            }); */

            self.selectedCity = self.city.geoName;
            self.selectedCityCode = self.city.geoId;
            self.selectedDistrict = self.city.district;
            self.selectedDistrictCode = self.city.districtId;
          }
        },
        () => {
          self.toastCtrl.presentFailedToast(
            "Error Occured , Please try again !!!"
          );
        }
      );
  }

  getDistrictList(countryCode, regionCode) {
    //console.log("getCitiesList() noCity", noCity);
    let self = this;
    this.geoSvrc.getDistrictList(countryCode, regionCode).subscribe(
      (data) => {
        self.districts = data["Districts"] as District[];
        // console.log("getDistrictList() data", JSON.stringify(data));
        if (self.districts && self.districts.length > 0) {
          if (self.district.regionId != self.districts[0].regionId) {
            /*  self.district = self.districts[0];
            self.rForm.patchValue({
              district: self.district,
            });  */
          }
        }
      },
      () => {
        self.toastCtrl.presentFailedToast(
          "Error Occured , Please try again !!!"
        );
      }
    );
  }

  getSuburbList(countryCode, regionCode, districtCode, cityCode) {
    //console.log("getCitiesList() noCity", noCity);
    let self = this;
    this.geoSvrc
      .getCitiesBySuburbs(countryCode, regionCode, districtCode, cityCode)
      .subscribe(
        (data) => {
          self.suburbs = data["Suburbs"] as City[];
          // console.log("getDistrictList() data", JSON.stringify(data));
          if (self.suburbs && self.suburbs.length > 0) {
            self.suburb = self.suburbs[0];
            self.rForm.patchValue({
              suburb: self.suburb,
            });
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

  districts: District[];
  district: District = {
    geoName: "",
    geoId: "",
    region: DEFAULT_REGION_STATE,
    regionId: DEFAULT_REGION_STATE_CODE,
    country: DEFAULT_COUNTRY,
    countryId: DEFAULT_COUNTRY_CODE,
  };

  cities: City[];
  city: City = {
    geoName: "",
    geoId: "",
    district: DEFAULT_COUNTY,
    districtId: DEFAULT_COUNTYCODE,
    region: DEFAULT_REGION_STATE,
    regionId: DEFAULT_REGION_STATE_CODE,
    country: DEFAULT_COUNTRY,
    countryId: DEFAULT_COUNTRY_CODE,
  };

  suburbs: City[];
  suburb: City;

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
      offset: this.offSet,
      limit: this.limit,
      countryCode: this.countryCode,
      regionCode: this.selectedRegionCode,
      districtCode: this.selectedDistrictCode,
    };
    this.citiesSubscription = from(
      this.geoSvrc.getCitiesByCountryRegionDistrictByCityName(msgBody)
    ).subscribe((data) => {
      // Subscription will be closed when unsubscribed manually.
      if (this.citiesSubscription.closed) {
        return;
      }

      let citys = data.Cities as City[];
      const names = citys.map((person) => {
        return {
          geoName: `${person.geoName}`,
          geoId: person.geoId,
          district: person.district,
          districtId: person.districtId,
        };
      });

      console.log(
        "ProfileFormPage::searchCities() names-cities: ",
        JSON.stringify(names)
      );

      event.component.items = names;
      event.component.endSearch();
    });
  }

  setFormData(partyContactProfile: GeoModel) {
    /*   console.log(
      "setFormData() partyContactProfile gilbert",
      JSON.stringify(partyContactProfile)
    ); */
    // we have already setup the defaults, overwrite if partyContactProfile is not null
    if (partyContactProfile?.country?.geoName)
      this.selectedCountry = partyContactProfile.country.geoName;
    if (partyContactProfile?.country?.geoId)
      this.countryCode = partyContactProfile.country.geoId;
    if (partyContactProfile?.region?.geoName)
      this.selectedRegion = partyContactProfile.region.geoName;
    if (partyContactProfile?.region?.geoId)
      this.selectedRegionCode = partyContactProfile.region.geoId;

    if (partyContactProfile?.district?.geoName) {
      this.selectedDistrict = partyContactProfile.district.geoName;
    }

    if (partyContactProfile?.district?.geoId) {
      this.selectedDistrictCode = partyContactProfile.district.geoId;
    }

    if (partyContactProfile?.city?.geoName)
      this.selectedCity = partyContactProfile.city.geoName;
    if (partyContactProfile?.city?.geoId)
      this.selectedCityCode = partyContactProfile.city.geoId;

    if (partyContactProfile?.postalCode) {
      this.postalCode = partyContactProfile.postalCode;
    }

    if (partyContactProfile?.unitNumber) {
      this.unitNumber = partyContactProfile.unitNumber;
    }

    if (partyContactProfile?.suburb) {
      this.suburb = partyContactProfile.suburb;
    }

    if (partyContactProfile?.address2) {
      this.address2 = partyContactProfile.address2;
    }

    if (partyContactProfile?.address1) {
      this.address1 = partyContactProfile.address1;
    }

    if (partyContactProfile?.latitude) {
      this.latitude = partyContactProfile.latitude;
    }

    if (partyContactProfile?.longitude) {
      this.longitude = partyContactProfile.longitude;
    }

    if (partyContactProfile?.directions) {
      this.direction = partyContactProfile.directions;
    }

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
      district: this.selectedDistrict,
      districtId: this.selectedDistrictCode,
      region: this.selectedRegion,
      regionId: this.selectedRegionCode,
    };

    this.district = {
      geoName: this.selectedDistrict,
      geoId: this.selectedDistrictCode,
      region: this.selectedRegion,
      regionId: this.selectedRegionCode,
    };

    this.getCountryCurrencyList(this.countryCode);
    this.rForm.patchValue({
      countryCode: this.country,
    });

    if (this.showRegion) {
      this.getStateProvinceRegionList(this.countryCode, "nocities");
      this.rForm.patchValue({
        countryCode: this.country,
        statePRLine: this.region,
      });
    }

    if (this.showDistrict) {
      this.getDistrictList(this.countryCode, this.selectedRegionCode);

      this.rForm.patchValue({
        countryCode: this.country,
        statePRLine: this.region,
        district: this.district,
      });
    }

    if (this.showCity) {
      this.getCitiesList(this.countryCode, this.selectedRegionCode, "noCity");

      this.rForm.patchValue({
        countryCode: this.country,
        statePRLine: this.region,
        cityLine: this.city,
      });
    }

    if (this.showSuburb) {
      this.rForm.patchValue({
        suburb: this.suburb,
      });
    }

    if (this.showUnitNumber) {
      this.rForm.patchValue({
        unitNumber: this.unitNumber,
      });
    }

    if (this.showAddress1) {
      this.rForm.patchValue({
        address1: this.address1,
      });
    }

    if (this.showAddress2) {
      this.rForm.patchValue({
        address2: this.address2,
      });
    }

    if (this.showPostalCode) {
      this.rForm.patchValue({
        postalCode: this.postalCode,
      });
    }

    if (this.showCordinates) {
      this.rForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude,
      });
    }

    if (this.showDirection) {
      this.rForm.patchValue({
        direction: this.direction,
      });
    }
  }

  saveForm(post) {
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
      countryCode = post.countryCode.geoId;
      regionCode = post.statePRLine.geoId;
      region = post.statePRLine.geoName;
      cityCode = post.cityLine.geoId;
      city = post.cityLine.geoName;
    } else {
      // some geo items may be configured
      if (Utils.isStringEmpty(this.appLocale.appCountryCode)) {
        countryCode = post.countryCode.geoId;
      } else {
        countryCode = this.countryCode;
      }
      if (Utils.isStringEmpty(this.appLocale.appRegionCode)) {
        regionCode = post.statePRLine.geoId;
        region = post.statePRLine.geoName;
      } else {
        regionCode = this.selectedRegionCode;
        region = this.selectedRegion;
      }
      if (Utils.isStringEmpty(this.appLocale.appCityCode)) {
        cityCode = post.cityLine.geoId;
        city = post.cityLine.geoName;
      } else {
        cityCode = this.selectedCityCode;
        city = this.selectedCity;
      }
    }
  }

  //city component
  cityClear() {
    this.cityComponent.clear();
    this.cityComponent.close();
  }

  cityConfirm() {
    this.cityComponent.confirm();
    this.cityComponent.close();
  }

  onAddCity() {
    // Clean form.
    this.cityNameControl.reset();

    // Copy search text to port name field, so
    // user doesn't have to type again.
    this.cityNameControl.setValue(this.cityComponent.searchText);
    this.isCityAdd = true;
    // Show form.
    this.cityComponent.showAddItemTemplate();
  }

  onSaveCity(event: { component: IonicSelectableComponent; item: City }) {
    // Fill form.
    this.cityNameControl.setValue(event.item.geoName);
    this.isCityAdd = false;
    // Show form.
    event.component.showAddItemTemplate();
  }

  addCity() {
    // Create city.

    let cityName = this.cityNameControl.value;

    this.city = {
      geoName: cityName,
      geoId: this.selectedCityCode,
      district: this.selectedDistrict,
      districtId: this.selectedDistrictCode,
      region: this.selectedRegion,
      regionId: this.selectedRegionCode,
      country: this.selectedCountry,
      countryId: this.countryCode,
    };

    this.geoData = {
      geoDataId: "",
      city: cityName,
      userId: this.companyUserId,
      status: "PE",
      district: this.selectedDistrict,
      districtId: this.selectedDistrictCode,
      region: this.selectedRegion,
      regionId: this.selectedRegionCode,
      country: this.selectedCountry,
      countryId: this.countryCode,
    };

    this.geoSvrc
      .storeGeoDistrictCitySuburb(
        this.geoData,
        null,
        this.apiKey,
        this.remoteSvrc
      )
      .subscribe(
        (data) => {
          console.log("new city added", data);
          if ((data.httpStatus = "200")) {
          }
          this.toast.processResponse(data);
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );

    // Add port to the top of list.
    this.cityComponent.addItem(this.city).then(() => {
      this.cityComponent.search(this.city.geoName);
    });

    // Clean form.
    this.cityNameControl.reset();

    // Show list.
    this.cityComponent.hideAddItemTemplate();
  }

  saveCity(city: City) {
    // Change port.
    city.geoName = this.cityNameControl.value;
    console.log("city we are updating", city);

    // Show list.
    this.cityComponent.hideAddItemTemplate();
  }

  //suburb component
  suburbClear() {
    this.suburbComponent.clear();
    this.suburbComponent.close();
  }

  suburbConfirm() {
    this.suburbComponent.confirm();
    this.suburbComponent.close();
  }

  onAddsuburb() {
    // Clean form.
    this.suburbNameControl.reset();

    // Copy search text to port name field, so
    // user doesn't have to type again.
    this.suburbNameControl.setValue(this.suburbComponent.searchText);
    this.isSuburbAdd = true;
    // Show form.
    this.suburbComponent.showAddItemTemplate();
  }

  onSaveSuburb(event: { component: IonicSelectableComponent; item: City }) {
    // Fill form.
    this.suburbNameControl.setValue(event.item.geoName);
    this.isSuburbAdd = false;
    // Show form.
    event.component.showAddItemTemplate();
  }

  addSuburb() {
    // Create city.

    let suburbName = this.suburbNameControl.value;

    this.city = {
      geoName: suburbName,
      geoId: this.selectedCityCode,
      district: this.selectedDistrict,
      districtId: this.selectedDistrictCode,
      region: this.selectedRegion,
      regionId: this.selectedRegionCode,
      country: this.selectedCountry,
      countryId: this.countryCode,
    };

    this.geoData = {
      geoDataId: "",
      suburb: suburbName,
      cityId: this.selectedCityCode,
      city: this.selectedCity,
      userId: this.companyUserId,
      status: "PE",
      district: this.selectedDistrict,
      districtId: this.selectedDistrictCode,
      region: this.selectedRegion,
      regionId: this.selectedRegionCode,
      country: this.selectedCountry,
      countryId: this.countryCode,
    };

    this.geoSvrc
      .storeGeoDistrictCitySuburb(
        this.geoData,
        null,
        this.apiKey,
        this.remoteSvrc
      )
      .subscribe(
        (data) => {
          console.log("new Suburb added", data);
          if ((data.httpStatus = "200")) {
          }
          this.toast.processResponse(data);
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );

    // Add port to the top of list.
    this.suburbComponent.addItem(this.city).then(() => {
      this.suburbComponent.search(this.city.geoName);
    });

    // Clean form.
    this.suburbNameControl.reset();

    // Show list.
    this.suburbComponent.hideAddItemTemplate();
  }

  saveSuburb(city: City) {
    // Change port.
    city.geoName = this.suburbNameControl.value;
    console.log("city we are updating", city);

    // Show list.
    this.suburbComponent.hideAddItemTemplate();
  }
}
