import { Component, OnInit, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { IonInfiniteScroll, ModalController } from "@ionic/angular";
import { IonicSelectableComponent } from "ionic-selectable";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  City,
  District,
  GeoModel,
} from "src/app/base-services/common-service/models/common-model.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
import { ProfileService } from "src/app/profile/services/profile.service";

import { GeoupdateformComponent } from "../geoupdateform/geoupdateform.component";
import { GeoSearchType } from "../services/geo.models";
import { GeoService } from "../services/geo.service";

const DEFAULT_COUNTRY = "Ghana";
const DEFAULT_COUNTRY_CODE = "GHA";
const DEFAULT_REGION_STATE = "Ashanti";
const DEFAULT_REGION_STATE_CODE = "GHA_AS";
const DEFAULT_COUNTY = "Kumasi Metro"; // Kumasi (metropolitan area) is both a district and city
const DEFAULT_COUNTYCODE = "GHA_AS_K013";
const DEFAULT_CITY = "Kumasi";
const DEFAULT_CITYCODE = "GHA_AS_KSI";

@Component({
  selector: "app-geosearch",
  templateUrl: "./geosearch.component.html",
  styleUrls: ["./geosearch.component.scss"],
})
export class GeosearchComponent implements OnInit {
  selectedCountry: string = DEFAULT_COUNTRY;
  countryCode: string = DEFAULT_COUNTRY_CODE;
  selectedRegion: string = "";
  selectedRegionCode: string = "";
  selectedCity: string = "";
  selectedCityCode: string = "";
  selectedDistrict: string = "";
  selectedDistrictCode: string = "";

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
    geoName: DEFAULT_CITY,
    geoId: DEFAULT_CITYCODE,
    region: DEFAULT_REGION_STATE,
    regionId: DEFAULT_REGION_STATE_CODE,
    country: DEFAULT_COUNTRY,
    countryId: DEFAULT_COUNTRY_CODE,
  };

  initialCities: City[];
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

  rForm: UntypedFormGroup = new UntypedFormGroup({});
  geoModel: GeoModel = null;

  searchControl: UntypedFormControl;
  searching: any = false;
  loading: any = true;
  searchTerm: string = "";

  citySuburbId: string = "";
  suburbs: City[];

  initialData: City[] = [];
  searchData: City[] = [];
  notData: City[] = [];
  cities: City[];

  searchType = GeoSearchType.All;
  isLoading = false;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private geoSvrc: GeoService,
    private toastCtrl: ToastComponent,
    public modalController: ModalController
  ) {
    this.searchControl = new UntypedFormControl();
  }

  async showSuburbs(city: City) {
    /*   this.geoModel = {
      country: {
        geoId: this.countryCode,
        geoName: city.country,
      },

      city: {
        geoId: city.geoId,
        geoName: city.geoName,
      },
      district: {
        geoId: this.selectedDistrictCode,
        geoName: city.district,
      },

      region: {
        geoId: this.selectedRegionCode,
        geoName: city.region,
      },
    };

    const modal = await this.modalController.create({
      component: GeoupdateformComponent,
      componentProps: {
        geoModel: this.geoModel,
      },
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present(); */

    this.getSuburbs(
      this.countryCode,
      this.selectedRegionCode,
      this.selectedDistrictCode,
      city.geoId
    );
  }

  ngOnInit() {
    this.cities = [];
    this.buildForm();
    this.getStateProvinceRegionList(DEFAULT_COUNTRY_CODE);
    this.countryCode = DEFAULT_COUNTRY_CODE;
    this.selectedRegionCode = DEFAULT_REGION_STATE_CODE;
    this.selectedDistrictCode = DEFAULT_COUNTYCODE;

    this.searchControl.valueChanges
      .pipe(debounceTime(1400), distinctUntilChanged())
      .subscribe((subreddit: any) => {
        this.searching = false;
        //  this.setFilteredItems();

        if (subreddit.length > 0) {
          this.isLoading = false;
          this.searchTerm = subreddit;
          this.searchBySearch();
        } else {
          this.searchAll();
        }
      });
  }

  trackByFn(index: number) {
    return index;
  }

  buildForm() {
    this.rForm = this.formBuilder.group({
      regionCode: [null, Validators.required],
      districtCode: [null, Validators.required],
    });
  }

  ionChangeRegion(event: { component: IonicSelectableComponent; value: any }) {
    this.selectedRegion = event.value.geoName;
    this.selectedRegionCode = event.value.geoId;

    this.getDistrictList(this.countryCode, this.selectedRegionCode);
  }

  ionChangeDistrict(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.selectedDistrict = event.value.geoName;
    this.selectedDistrictCode = event.value.geoId;

    /*   this.getCitiesList(
      this.countryCode,
      this.selectedRegionCode,
      this.selectedDistrictCode
    ); */

    this.searchAll();
  }

  getStateProvinceRegionList(countryCode: string) {
    //console.log("getStateProvinceRegionList() noCities", noCities);
    let self = this;
    let msgBody = { countryCode: countryCode };

    this.geoSvrc.getStateProvinceRegionList(msgBody).then(
      (data) => {
        self.stateCodes = data;
        if (self.stateCodes && self.stateCodes.length > 0) {
          self.region = data[0];
          //console.log("getStateProvinceRegionList() self.region", JSON.stringify(self.region));

          self.selectedRegion = self.region.geoName;
          self.selectedRegionCode = self.region.geoId;
          self.rForm.patchValue({
            districtCode: null,
          });

          //  self.getDistrictList(countryCode, self.selectedRegionCode);
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

  getCitiesList(countryCode, regionCode, districtCode) {
    //console.log("getCitiesList() noCity", noCity);
    let self = this;
    this.loading = true;
    this.geoSvrc
      .getCitiesByCountryRegionDistrict(countryCode, regionCode, districtCode)
      .subscribe(
        (data) => {
          self.cities = data["Cities"] as City[];
          self.initialCities = self.cities;

          self.city = self.cities[0];
          self.selectedCity = self.city.geoName;
          self.selectedCityCode = self.city.geoId;
          self.selectedRegionCode = data["regionCode"];
          self.countryCode = data["countryCode"];
          self.selectedDistrictCode = data["districtCode"];

          /*  "regionCode" : "GHA_AS",
  "districtCode" : "GHA_AS_K019",
  "countryCode" : "GHA", */
          this.loading = false;
        },
        () => {
          self.toastCtrl.presentFailedToast(
            "Error Occured , Please try again !!!"
          );
        }
      );
  }

  getSuburbs(countryCode, regionCode, districtCode, cityCode) {
    //console.log("getCitiesList() noCity", noCity);
    let self = this;
    this.geoSvrc
      .getCitiesBySuburbs(countryCode, regionCode, districtCode, cityCode)
      .subscribe(
        (data) => {
          self.suburbs = data["Suburbs"] as City[];
          self.citySuburbId = data.cityId;
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
    // this.loading = true;
    this.geoSvrc.getDistrictList(countryCode, regionCode).subscribe(
      (data) => {
        self.districts = data["Districts"] as District[];
        // console.log("getDistrictList() data", JSON.stringify(data));
        if (self.districts && self.districts.length > 0) {
          self.district = self.districts[0];
          this.selectedRegionCode = countryCode;
          this.selectedDistrictCode = self.district.geoId;
          self.rForm.patchValue({
            districtCode: self.district,
          });
          // this.getCitiesList(countryCode, regionCode, self.district.geoId);
          this.searchAll();
        }
        // this.loading = false;
      },
      () => {
        self.toastCtrl.presentFailedToast(
          "Error Occured , Please try again !!!"
        );
      }
    );
  }

  filterItems(searchTerm) {
    if (this.initialCities) {
      return this.initialCities.filter((item) => {
        return (
          item.geoName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          item.district.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
      });
    }
  }

  setFilteredItems() {
    this.cities = this.filterItems(this.searchTerm);
  }

  onSearchInput() {
    this.searching = true;
  }

  searchAll() {
    if (this.infinite) {
      this.infinite.disabled = false;
    }

    this.offSet = 0;
    this.searchType = GeoSearchType.All;

    this.initialData = [];
    this.notData = [];
    this.cities = [];
    this.loadGeoData();
  }

  searchBySearch() {
    if (this.infinite) {
      this.infinite.disabled = true;
    }

    this.offSet = 0;
    this.searchType = GeoSearchType.Search;
    this.initialData = [];
    this.notData = [];
    this.cities = [];
    this.loadGeoData();
  }

  loadGeoData(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }

    if (this.searchType == GeoSearchType.All) {
      this.geoSvrc
        .getCitiesByCountryRegionDistrictPage(
          this.countryCode,
          this.selectedRegionCode,
          this.selectedDistrictCode,
          this.limit.toString(),
          this.offSet.toString()
        )
        .subscribe(
          (data) => {
            let hitCounts = data.totNumGeoData as number;
            let myData = data["Cities"];
            this.initialData = [...this.initialData, ...myData];
            this.notData = [...this.notData, ...myData];
            this.cities = [...this.cities, ...myData];

            this.isLoading = true;

            if (event) {
              event.target.complete();
            }

            if (this.notData.length >= hitCounts) {
              if (event) {
                event.target.disabled = true;
              }
            }
          },
          (err) => {
            this.isLoading = true;

            if (event) {
              event.target.disabled = true;
            }
          }
        );
    } else {
      this.geoSvrc
        .getCitiesByCountryRegionDistrictName(
          this.countryCode,
          this.searchTerm,
          this.limit.toString(),
          this.offSet.toString()
        )
        .subscribe(
          (data) => {
            let hitCounts = data.totNumCities as number;
            let myData = data["Cities"] as City[];
            this.initialData = [...this.initialData, ...myData];
            this.notData = [...this.notData, ...myData];
            this.cities = [...this.cities, ...myData];

            this.isLoading = true;

            if (event) {
              event.target.complete();
            }

            if (this.notData.length >= hitCounts) {
              if (event) {
                event.target.disabled = true;
              }
            }
          },
          (err) => {
            //this.toast.presentFailedToast("Server Error | " + err);
            this.isLoading = true;

            if (event) {
              event.target.disabled = true;
            }
          }
        );
    }
  }
}
