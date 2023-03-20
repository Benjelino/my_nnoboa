import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { IonInfiniteScroll, ModalController } from "@ionic/angular";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import {
  GeoData,
  GeoDataByName,
  GeoModel,
} from "src/app/base-services/common-service/models/common-model.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { ToastComponent } from "src/app/components/toastComponent";

import { GeoupdateformComponent } from "../geoupdateform/geoupdateform.component";
import { GeoSearchType } from "../services/geo.models";
import { GeoService } from "../services/geo.service";

@Component({
  selector: "app-geo-data",
  templateUrl: "./geo-data.page.html",
  styleUrls: ["./geo-data.page.scss"],
})
export class GeoDataPage implements OnInit {
  @Input() userType: string;
  geoDataList: GeoData[];
  initialGeoDataList: GeoData[];
  searchControl: UntypedFormControl;
  searching: any = false;
  loading: any = true;
  searchTerm: string = "";
  dataFound: boolean = false;
  searched: boolean = false;

  isLoggedIn = false;
  userId: string;
  apiKey: string;

  newGeoModel: GeoModel = null;

  initialData: GeoData[] = [];
  searchData: GeoDataByName[] = [];
  notData: GeoData[] = [];

  offSet = 0;
  limit = 15;

  searchType = GeoSearchType.All;
  isLoaded = false;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private geoService: GeoService,
    private toast: ToastComponent,
    public modalController: ModalController
  ) {
    this.searchControl = new UntypedFormControl();
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
        tourismData: item.TourData,
      },
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }

  ngAfterViewInit() {
    // this.searchAll();
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }
    console.log("user type", this.userType);

    if (this.userType == "all") {
      this.searchControl.valueChanges
        .pipe(debounceTime(1400), distinctUntilChanged())
        .subscribe((subreddit: any) => {
          this.searching = false;
          // this.setFilteredItems();

          if (subreddit.length > 0) {
            this.isLoaded = false;
            this.searchTerm = subreddit;
            this.searchBySearch();
            this.searched = true;
          } else {
            this.searchAll();
            this.searched = false;
          }
        });
    } else {
      this.getUserData();
    }
  }
  getAdminData() {
    this.geoService.getGeoData(this.apiKey, this.remoteSvrc).subscribe(
      (data) => {
        this.geoDataList = data.GeoData;
        this.initialGeoDataList = data.GeoData;
        this.loading = false;

        if (
          this.geoDataList.length > 0 &&
          this.geoDataList[0].TourData.tourismName != undefined
        ) {
          this.dataFound = true;
        } else {
          this.dataFound = false;
        }
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }

  getUserData() {
    this.geoService.getGeoDataByUser(this.apiKey, this.remoteSvrc).subscribe(
      (data) => {
        this.geoDataList = data.GeoData;
        this.initialGeoDataList = data.GeoData;
        this.loading = false;

        if (
          this.geoDataList.length > 0 &&
          this.geoDataList[0].TourData.tourismName != undefined
        ) {
          this.dataFound = true;
        } else {
          this.dataFound = false;
        }
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }

  filterItems(searchTerm) {
    if (
      this.initialGeoDataList &&
      this.initialGeoDataList[0].TourData.tourismName != undefined
    ) {
      return this.initialGeoDataList.filter((item) => {
        return (
          item.TourData?.tourismName
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) > -1
        );
      });
    }
  }

  setFilteredItems() {
    this.geoDataList = this.filterItems(this.searchTerm);
  }

  onSearchInput() {
    this.searching = true;
  }

  trackByFn(index: number) {
    return index;
  }

  searchAll() {
    if (this.infinite) {
      this.infinite.disabled = false;
    }

    this.offSet = 0;
    this.searchType = GeoSearchType.All;

    this.initialData = [];
    this.notData = [];
    this.geoDataList = [];
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
    this.searchData = [];
    this.loadGeoData();
  }

  loadGeoData(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }

    if (this.searchType == GeoSearchType.All) {
      this.geoService
        .getGeoDataByPage(
          this.limit.toString(),
          this.offSet.toString(),
          this.apiKey,
          this.remoteSvrc
        )
        .subscribe(
          (data) => {
            let hitCounts = data.totNumGeoData as number;
            let myData = data.GeoData;
            this.initialData = [...this.initialData, ...myData];
            this.notData = [...this.notData, ...myData];
            this.geoDataList = [...this.geoDataList, ...myData];

            this.isLoaded = true;

            if (
              this.geoDataList.length > 0 &&
              this.geoDataList[0].TourData.tourismName != undefined
            ) {
              this.dataFound = true;
            } else {
              this.dataFound = false;
            }

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
            this.isLoaded = true;

            if (event) {
              event.target.disabled = true;
            }
          }
        );
    } else {
      this.geoService
        .getGeoDataByName(
          this.searchTerm,
          this.limit.toString(),
          this.offSet.toString(),
          this.apiKey,
          this.remoteSvrc
        )
        .subscribe(
          (data) => {
            let hitCounts = data.totNumGeoData as number;
            let myData = data.GeoData;
            //this.initialData = [...this.initialData, ...myData];
            //this.notData = [...this.notData, ...myData];
            this.searchData = [...this.searchData, ...myData];

            //console.log("searchData", JSON.stringify(this.searchData));
            console.log("search hitCounts", hitCounts);
            console.log(
              "searchData length",
              JSON.stringify(this.searchData.length)
            );

            this.isLoaded = true;

            if (event) {
              event.target.complete();
            }

            if (this.searchData.length > 0) {
              this.dataFound = true;
            } else {
              this.dataFound = false;
            }

            if (this.searchData.length >= hitCounts) {
              if (event) {
                event.target.disabled = true;
              }
            }
          },
          (err) => {
            //this.toast.presentFailedToast("Server Error | " + err);
            this.isLoaded = true;

            if (event) {
              event.target.disabled = true;
            }
          }
        );
    }
  }
}
