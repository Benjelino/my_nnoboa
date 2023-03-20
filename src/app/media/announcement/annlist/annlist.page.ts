import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";

import { IonInfiniteScroll } from "@ionic/angular";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import * as Models from "src/app/media/services/media-model.service";

import { EsearchService } from "src/app/base-services/remote-service/esearch.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { DcubecmsRemoteService } from "../../services/dcubecms-remote.service";
import { SearchType } from "src/app/qanda/services/models/question.model";

@Component({
  selector: "app-annlist",
  templateUrl: "./annlist.page.html",
  styleUrls: ["./annlist.page.scss"],
})
export class AnnlistPage implements OnInit {
  isLoggedIn = false;
  isLoading = false;
  searching: any = false;
  searchTerm: string = "";
  searchControl: UntypedFormControl;
  public data: Models.MediumList;
  errorOccurred = false;
  initialData = [];
  searchData = [];
  notData = [];
  offSet = 0;
  limit = 5;

  searchType = 1;
  testData = [];
  appId = "";
  public searchForm: UntypedFormGroup;

  userId = "0";

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private remoteSvrc: DcubecmsRemoteService,
    private esrchSvrc: EsearchService,
    private toast: ToastComponent
  ) {
    this.searchForm = new UntypedFormGroup({
      searchControl: new UntypedFormControl(""),
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;
    this.searchForm
      .get("searchControl")
      .valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((subreddit: any) => {
        if (subreddit.length > 0) {
          this.isLoading = false;
          this.errorOccurred = false;
          this.searchTerm = subreddit;
          this.searchBySearch();
        } else {
          this.searchTerm = "";

          this.searchAll();
        }
      });
  }

  filterItems(searchTerm) {
    this.esrchSvrc
      .getSearch(
        searchTerm,
        Models.mediumType.Announcement.toString(),
        null,
        null
      )
      .subscribe(
        (data) => {
          this.searchData = data.hits;
        },
        (err) => {
          this.toast.presentFailedToast("Server Error | " + err);
        }
      );

    return this.searchData.map((item) => {
      return {
        title: item._source.title,
        author: item._source.author,
        content: item._source.content,
        mediumId: item._source.mediumId,
        mtype: item._source.mtype,
        datePosted: item._source.datePosted,
        tag: item._source.tag,
        imageUrl: item._source.imageUrl,
      };
    });
  }

  setFilteredItems(searchItem: string) {
    this.testData = this.filterItems(searchItem);
  }

  register() {
    AuthenticationService.authState.next("register");
  }

  forgot() {
    AuthenticationService.authState.next("forgot");
  }

  login() {
    AuthenticationService.authState.next("login");
  }
  annoucement() {
    this.router.navigate(["/news"]);
  }

  news() {
    this.router.navigate(["/news-list"]);
  }

  onSearchInput() {
    this.searching = true;
  }

  getData() {
    this.remoteSvrc
      .getMediaByType(
        Models.mediumType.Announcement.toString(),
        this.userId,
        null,
        null,this.appId
      )
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.data = data;

          if (data.httpStatus == "200") {
            this.errorOccurred = false;
          } else {
            this.errorOccurred = true;
            return;
          }

          this.initialData = data.list;
          this.notData = data.list;
          this.isLoading = true;
        },
        (err) => {
          this.toast.presentFailedToast("Server Error | " + err);
        }
      );
  }

  ionViewDidEnter() {
    this.initialData = [];
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  searchAll() {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.searchType = SearchType.All;
    this.initialData = [];
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }
  searchBySearch() {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.searchType = SearchType.Search;
    this.initialData = [];
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  loadNews(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }
    if (this.searchType == SearchType.All) {
      this.remoteSvrc
        .getMediaByTypePage(
          Models.mediumType.Announcement.toString(),
          this.userId,
          this.offSet.toString(),
          this.limit.toString(),
          null,
          null,this.appId
        )
        .subscribe(
          (data) => {
            if (data.httpStatus == "200") {
              this.errorOccurred = false;
            } else {
              this.errorOccurred = true;
              return;
            }

            this.isLoading = false;
            this.data = data;
            if (data.httpStatus == "200") {
              this.errorOccurred = false;
            } else {
              this.errorOccurred = true;
              return;
            }
            this.initialData = [...this.initialData, ...data.list];
            this.notData = [...this.notData, ...data.list];
            this.testData = [...this.testData, ...data.list];
            this.isLoading = true;

            if (event) {
              event.target.complete();
            }

            if (this.notData.length >= data.MediaStats.totMediaTypeCount) {
              this.infinite.disabled = true;
            }
          },
          (err) => {
            this.toast.presentFailedToast("Server Error | " + err);
          }
        );
    } else if (this.searchType == SearchType.Search) {
      this.esrchSvrc
        .getSearchPage(
          this.searchTerm,
          Models.mediumType.Announcement.toString(),
          null,
          null,
          this.offSet.toString(),
          this.limit.toString()
        )
        .subscribe(
          (data) => {
            let hitCounts = data.hitsCount as number;
            let myData = data.hits.map((item) => {
              return {
                title: item._source.title,
                author: item._source.author,
                content: item._source.content,
                mediumId: item._source.mediumId,
                mtype: item._source.mtype,
                datePosted: item._source.datePosted,
                tag: item._source.tag,
                imageUrl: item._source.imageUrl,
              };
            });

            this.initialData = [...this.initialData, ...myData];
            this.notData = [...this.notData, ...myData];
            this.testData = [...this.testData, ...myData];

            this.isLoading = true;

            if (event) {
              event.target.complete();
            }

            if (this.notData.length >= hitCounts) {
              this.infinite.disabled = true;
            }
          },
          (err) => {
            this.toast.presentFailedToast("Server Error | " + err);
          }
        );
    }
  }

  loadNewsOld(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }

    this.remoteSvrc
      .getMediaByTypePage(
        Models.mediumType.Announcement.toString(),
        this.userId,
        this.offSet.toString(),
        this.limit.toString(),
        null,
        null,this.appId
      )
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.data = data;

          this.initialData = [...this.initialData, ...data.list];
          this.notData = [...this.notData, ...data.list];
          this.testData = [...this.testData, ...data.list];
          this.isLoading = true;

          if (event) {
            event.target.complete();
          }

          if (this.notData.length >= data.MediaStats.totMediaTypeCount) {
            this.infinite.disabled = true;
          }
        },
        (err) => {
          this.toast.presentFailedToast("Server Error | " + err);
        }
      );
  }
}
