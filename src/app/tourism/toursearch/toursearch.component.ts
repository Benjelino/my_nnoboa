import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { IonInfiniteScroll } from "@ionic/angular";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import * as Models from "src/app/base-services/common-service/models/common-model.service";

import { ToastComponent } from "src/app/components/toastComponent";
import { EsearchService } from "src/app/base-services/remote-service/esearch.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { SearchType } from "src/app/qanda/services/models/question.model";

@Component({
  selector: "app-toursearch",
  templateUrl: "./toursearch.component.html",
  styleUrls: ["./toursearch.component.scss"],
})
export class ToursearchComponent implements OnInit {
  isLoggedIn = false;
  isLoading = false;
  searching: any = false;
  searchTerm: string = "Ghana";
  searchCategory: string = "";
  searchRegion: string = "";
  searchControl: UntypedFormControl;
  public data: Models.TourSiteList[];
  errorOccurred = false;
  initialData: Models.TourSiteList[] = [];
  searchData: Models.TourSiteList[] = [];
  notData: Models.TourSiteList[] = [];
  offSet = 0;
  limit = 15;

  searchType = 1;
  testData: Models.TourSiteList[] = [];

  public searchForm: UntypedFormGroup;

  userId = "0";
  @Input() searchName: string;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private esrchSvrc: EsearchService,
    private toast: ToastComponent
  ) {
    this.searchForm = new UntypedFormGroup({
      searchControl: new UntypedFormControl(""),
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();

    this.searchForm
      .get("searchControl")
      .valueChanges.pipe(debounceTime(1400), distinctUntilChanged())
      .subscribe((subreddit: any) => {
        if (subreddit.length > 0) {
          this.isLoading = false;
          this.errorOccurred = false;
          this.searchTerm = subreddit;
          this.searchBySearch();
        } else {
          this.searchTerm = "Ghana";

          this.searchAll();
        }
      });
  }

  filterItems(searchTerm) {
    this.esrchSvrc
      .getTourSearchPageRegion(
        searchTerm,
        this.searchCategory,
        this.searchRegion,
        null,
        null,
        this.offSet.toString(),
        this.limit.toString()
      )
      .subscribe(
        (data) => {
          this.searchData = data.TourismData as Models.TourSiteList[];
        },
        (err) => {
          this.toast.presentFailedToast("Server Error | " + err);
        }
      );

    return this.searchData;
  }

  setFilteredItems(searchItem: string) {
    this.testData = this.filterItems(searchItem);
  }

  onSearchInput() {
    this.searching = true;
  }

  ionViewDidEnter() {
    this.initialData = [];
    this.notData = [];
    this.testData = [];
  
  }

  ngAfterViewInit() {
    this.searchAll();
  }

  searchByCategory(catId: string) {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.searchTerm = catId;
    this.searchType = SearchType.Categeory;
    this.notData = [];
    this.testData = [];
    this.loadData();
  }

  searchByRegion(catId: string) {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.searchRegion = catId;
    this.searchType = SearchType.Categeory;
    this.notData = [];
    this.testData = [];
    this.loadData();
  }

  searchByTouristType(catId: string) {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.searchCategory = catId;
    this.searchType = SearchType.Categeory;
    this.notData = [];
    this.testData = [];
    this.loadData();
  }

  searchAll() {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.searchType = SearchType.All;
    if (this.searchName) {
      this.searchTerm = this.searchName;
    } else {
      this.searchTerm = "Ghana";
    }

    this.searchCategory = "";
    this.searchRegion = "";
    this.initialData = [];
    this.notData = [];
    this.testData = [];
    this.loadData();
  }

  searchBySearch() {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.searchType = SearchType.Search;
    this.initialData = [];
    this.notData = [];
    this.testData = [];
    this.loadData();
  }

  loadData(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }

    this.esrchSvrc
      .getTourSearchPageRegion(
        this.searchTerm,
        this.searchCategory,
        this.searchRegion,
        null,
        null,
        this.offSet.toString(),
        this.limit.toString()
      )
      .subscribe(
        (data) => {
          let hitCounts = data.hitsCount as number;
          let myData = data.TourismData as Models.TourSiteList[];
          this.initialData = [...this.initialData, ...myData];
          this.notData = [...this.notData, ...myData];
          this.testData = [...this.testData, ...myData];

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
