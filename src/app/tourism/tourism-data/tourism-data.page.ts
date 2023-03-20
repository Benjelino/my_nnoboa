import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ToastComponent } from "src/app/components/toastComponent";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import {
  GeoData,
  GeoModel,
  GeoStatusEnumerations,
  TourismData,
  TourismTypeEnumerations,
} from "src/app/base-services/common-service/models/common-model.service";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { GeoService } from "src/app/geo/services/geo.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { Utils } from "src/app/base-services/utility-services/utils";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { TourdataupdateformComponent } from "../tourdataupdateform/tourdataupdateform.component";
import { IonInfiniteScroll, ModalController } from "@ionic/angular";
import { SearchType } from "src/app/qanda/services/models/question.model";
import { GeoupdateformComponent } from "src/app/geo/geoupdateform/geoupdateform.component";

@Component({
  selector: "app-tourism-data",
  templateUrl: "./tourism-data.page.html",
  styleUrls: ["./tourism-data.page.scss"],
})
export class TourismDataPage implements OnInit {
  @Input() userType: string;
  userForm: UntypedFormGroup;
  tourismTypes: TourismTypeEnumerations[];
  geoDataStatus: GeoStatusEnumerations[];

  defaultTourismType: TourismTypeEnumerations;
  tourismAdminData: TourismData[] = [];
  initialtourismAdminData: TourismData[] = [];

  tourismUserData: TourismData[] = [];

  isLoggedIn = false;
  userId: string;
  apiKey: string;

  searchControl: UntypedFormControl;
  searching: any = false;
  loading: any = true;
  searchTerm: string = "";
  locationTerm: string = "";
  isLoading = false;

  searchType = SearchType.All;

  initialData: TourismData[] = [];
  searchData: TourismData[] = [];
  notData: TourismData[] = [];
  tourData: TourismData[] = [];
  offSet = 0;
  limit = 15;

  newGeoModel: GeoModel = null;

  userGeoModel: GeoModel = null;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    public fb: UntypedFormBuilder,
    private geoService: GeoService,
    private toast: ToastComponent,
    public modalController: ModalController
  ) {
    this.userForm = fb.group({
      tourismType: ["", Validators.compose([Validators.required])],
      tourismName: ["", Validators.compose([Validators.required])],
      tourismLocation: ["", Validators.compose([Validators.required])],
      phone: ["", Validators.compose([Validators.required])],
      grade: ["", Validators.compose([Validators.required])],
      tourismCost: ["", Validators.compose([Validators.required])],
      capacity: ["", Validators.compose([Validators.required])],
      status: ["", Validators.compose([Validators.required])],
    });

    this.searchControl = new UntypedFormControl();
  }

  validationMessages = {
    tourismType: [{ type: "required", message: "Tourism Type is Required." }],
    tourismName: [{ type: "required", message: "Tourism Name is Required" }],
    tourismLocation: [
      { type: "required", message: "Tourism Location is Required" },
    ],
    phone: [{ type: "required", message: "Phone is Required" }],
    grade: [{ type: "required", message: "Grade is Required" }],
    tourismCost: [{ type: "required", message: "Tourism Cost is Required" }],
    capacity: [{ type: "required", message: "Capacity is Required" }],
    status: [{ type: "required", message: "Status is Required" }],
  };

  addFormControl(name: string, formGroup: UntypedFormGroup): void {
    this.userForm.addControl(name, formGroup);
  }

  async showGeoForm(item: GeoData) {
    this.newGeoModel = {
      country: {
        geoId: item.countryId,
        geoName: item.country,
      },
    };

    this.newGeoModel.userId = item.userId;
    this.newGeoModel.geoId = item.geoDataId;

    if (item.regionId != undefined || item.regionId != null) {
      this.newGeoModel.region = {
        geoId: item.regionId,
        geoName: item.region,
      };
    }

    if (item.districtId != undefined || item.districtId != null) {
      this.newGeoModel.district = {
        geoId: item.districtId,
        geoName: item.district,
      };
    }

    if (item.cityId != undefined || item.cityId != null) {
      this.newGeoModel.city = {
        geoId: item.cityId,
        geoName: item.city,
      };
    }

    if (item.suburbId != undefined || item.suburbId != null) {
      this.newGeoModel.suburb = {
        geoId: item.suburbId,
        geoName: item.suburb,
      };
    }

    const modal = await this.modalController.create({
      component: GeoupdateformComponent,
      componentProps: {
        geoModel: this.newGeoModel,
      },
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.geoService.getTourismTypes(this.remoteSvrc).subscribe(
      (data) => {
        this.tourismTypes = data.TourismTypeEnumerations;
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );

    this.geoService.getGeoEnumData(this.remoteSvrc).subscribe(
      (data) => {
        this.geoDataStatus = data.GeoStatusTypeEnumerations;
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );

    // console.log("userType", this.userType);

    if (this.userType == "all") {
      // this.searchAll();

      this.searchControl.valueChanges
        .pipe(debounceTime(1500), distinctUntilChanged())
        .subscribe((subreddit: any) => {
          this.searching = false;
          // this.setFilteredItems();

          if (subreddit.length > 0) {
            this.isLoading = false;
            this.searchTerm = subreddit;
            this.searchBySearch();
          } else {
            this.searchAll();
          }
        });
    } else {
      this.getUserData();
    }
  }

  filterItems(searchTerm) {
    if (this.initialtourismAdminData) {
      return this.initialtourismAdminData.filter((item) => {
        return (
          item.tourismName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
      });
    }
  }

  setFilteredItems() {
    this.tourismAdminData = this.filterItems(this.searchTerm);
  }

  getUserData() {
    this.geoService
      .getTourismDataByUser(this.apiKey, this.remoteSvrc)
      .subscribe(
        (data) => {
          this.tourismUserData = data["TourismData"] as TourismData[];
          this.loading = false;
          /*  if (this.tourismUserData != null) {
            this.defaultTourismType = this.tourismTypes.find(
              (a) => a.enumId == this.tourismUserData.tourismType
            );

            console.log("tourism type ", this.defaultTourismType);

            this.userForm.patchValue({
              tourismType: this.defaultTourismType,
              tourismName: this.tourismUserData.tourismName,
              tourismLocation: this.tourismUserData.tourismLocation,
              phone: this.tourismUserData.phone,
              grade: this.tourismUserData.grade,
              tourismCost: this.tourismUserData.tourismCost,
              capacity: this.tourismUserData.capacity,
              status: this.tourismUserData.status,
              cost: this.tourismUserData.tourismCost,
            });

            //setuser data for geo component
            let item = this.tourismUserData.GeoData;
            this.userGeoModel = {
              country: {
                geoId: item.countryId,
                geoName: item.country,
              },
            };

            this.userGeoModel.userId = item.userId;
            this.userGeoModel.geoId = item.geoDataId;

            if (item.regionId != undefined || item.regionId != null) {
              this.userGeoModel.region = {
                geoId: item.regionId,
                geoName: item.region,
              };
            }

            if (item.districtId != undefined || item.districtId != null) {
              this.userGeoModel.district = {
                geoId: item.districtId,
                geoName: item.district,
              };
            }

            if (item.cityId != undefined || item.cityId != null) {
              this.userGeoModel.city = {
                geoId: item.cityId,
                geoName: item.city,
              };
            }

            if (item.suburbId != undefined || item.suburbId != null) {
              this.userGeoModel.suburb = {
                geoId: item.suburbId,
                geoName: item.suburb,
              };
            }
          } */
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );
  }

  getAdminData() {
    this.geoService
      .getTourismDataByAdmin(this.apiKey, this.remoteSvrc)
      .subscribe(
        (data) => {
          this.tourismAdminData = data["TourismData"] as TourismData[];
          this.initialtourismAdminData = this.tourismAdminData;
          this.loading = false;
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );
  }

  trackByFn(index: number) {
    return index;
  }

  geoData: GeoData = null;
  storeData(value: any) {
    const cat: TourismData = {
      tourismType: value.tourismType,
      tourismName: value.tourismName,
      tourismLocation: value.tourismLocation,
      phone: value.phone,
      grade: value.grade,
      tourismCost: value.tourismCost,
      capacity: value.capacity,
      status: value.status,
      region: "",
      userId: this.userId,
    };

    let approved = "approved";
    if (Utils.stringNotEmpty(cat.status) && approved == cat.status) {
      cat.status = "UD";
    }

    /*   this.geoService
      .storeTourism(cat, null, this.apiKey, this.remoteSvrc)
      .subscribe(
        (data) => {
          this.userForm.reset();

          this.toast.presentSuccessToast("Comment Saved Successfuly");
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      ); */

    // let post = rpost.value;
    /* this.geoData = {
      geoDataId: "",
      country: value.geo.countryCode.geoName,
      countryId: value.geo.countryCode.geoId,
      city: value.geo.cityLine.geoName,
      cityId: value.geo.cityLine.geoId,
      district: value.geo.district.geoName,
      districtId: value.geo.district.geoId,
      region: value.geo.statePRLine.geoName,
      regionId: value.geo.statePRLine.geoId,
      userId: this.userId,
    }; */

    /*  if (value.geo.suburb.geoId != undefined || value.geo.suburb.geoId != null) {
      this.geoData.suburbId = value.geo.suburb.geoId;
      this.geoData.suburb = value.geo.suburb.geoName;
    }

    if (this.tourismUserData != null) {
      this.geoData.geoDataId = this.tourismUserData.GeoData.geoDataId;
    }

    this.geoService
      .storeGeoData(this.geoData, null, this.apiKey, this.remoteSvrc)
      .subscribe(
        (data) => {
          //this.loading = false;
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      ); */
  }

  onSearchInput() {
    this.searching = true;
  }

  async showTourForm(tourdata: TourismData) {
    this.newGeoModel = {
      country: {
        geoId: tourdata.GeoData.countryId,
        geoName: tourdata.GeoData.country,
      },
    };

    this.newGeoModel.userId = tourdata.GeoData.userId;
    this.newGeoModel.geoId = tourdata.GeoData.geoDataId;

    if (
      tourdata.GeoData.regionId != undefined ||
      tourdata.GeoData.regionId != null
    ) {
      this.newGeoModel.region = {
        geoId: tourdata.GeoData.regionId,
        geoName: tourdata.GeoData.region,
      };
    }

    if (
      tourdata.GeoData.districtId != undefined ||
      tourdata.GeoData.districtId != null
    ) {
      this.newGeoModel.district = {
        geoId: tourdata.GeoData.districtId,
        geoName: tourdata.GeoData.district,
      };
    }

    if (
      tourdata.GeoData.cityId != undefined ||
      tourdata.GeoData.cityId != null
    ) {
      this.newGeoModel.city = {
        geoId: tourdata.GeoData.cityId,
        geoName: tourdata.GeoData.city,
      };
    }

    if (
      tourdata.GeoData.suburbId != undefined ||
      tourdata.GeoData.suburbId != null
    ) {
      this.newGeoModel.suburb = {
        geoId: tourdata.GeoData.suburbId,
        geoName: tourdata.GeoData.suburb,
      };
    }

    if (tourdata.directions != undefined || tourdata.directions != null) {
      this.newGeoModel.directions = tourdata.directions;
    }

    const modal = await this.modalController.create({
      component: TourdataupdateformComponent,
      componentProps: {
        tourismData: tourdata,
        geoModel: this.newGeoModel,
      },
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }

  searchAll() {
    if (this.infinite) {
      this.infinite.disabled = false;
    }

    this.offSet = 0;
    this.searchType = SearchType.All;

    this.initialData = [];
    this.notData = [];
    this.tourData = [];
    this.loadData();
  }

  searchBySearch() {
    if (this.infinite) {
      this.infinite.disabled = true;
    }

    this.offSet = 0;
    this.searchType = SearchType.Search;
    this.initialData = [];
    this.notData = [];
    this.tourData = [];
    this.loadData();
  }

  ionViewDidEnter() {
    this.initialData = [];
    this.notData = [];
    this.tourData = [];

  }

  ngAfterViewInit() {
  }

  loadData(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }

    if (this.searchType == SearchType.All) {
      this.geoService
        .getTourismDataByAdminPage(
          this.offSet.toString(),
          this.limit.toString(),
          this.apiKey,
          this.remoteSvrc
        )
        .subscribe(
          (data) => {
            let hitCounts = data.totNumTourismData as number;
            let myData = data["TourismData"] as TourismData[];
            this.initialData = [...this.initialData, ...myData];
            this.notData = [...this.notData, ...myData];
            this.tourData = [...this.tourData, ...myData];

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
      this.geoService
        .getTourismDataByNameLocation(
          this.searchTerm,
          this.locationTerm,
          this.apiKey,
          this.remoteSvrc
        )
        .subscribe(
          (data) => {
            let hitCounts = data.hitsCount as number;
            let myData = data["TourismData"] as TourismData[];
            this.initialData = [...this.initialData, ...myData];
            this.notData = [...this.notData, ...myData];
            this.tourData = [...this.tourData, ...myData];

            this.isLoading = true;

            if (event) {
              event.target.complete();
              event.target.disabled = true;
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
