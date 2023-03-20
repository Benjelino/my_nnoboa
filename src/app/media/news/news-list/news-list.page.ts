import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";

import { IonInfiniteScroll } from "@ionic/angular";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";

//import { EsearchService } from "../../services/remote-service/remote-service.module";
import * as Models from "src/app/media/services/media-model.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { DcubecmsRemoteService } from "../../services/dcubecms-remote.service";
import { EsearchService } from "src/app/base-services/remote-service/remote-service.module";
import { ToastComponent } from "src/app/components/toastComponent";
import { SearchType } from "src/app/qanda/services/models/question.model";

@Component({
  selector: "app-news-list",
  templateUrl: "./news-list.page.html",
  styleUrls: ["./news-list.page.scss"],
})
export class NewsListPage implements OnInit {
  isLoading = false;
  isLoggedIn = false;
  searching: any = false;
  searchTerm: string = "";
  searchControl: UntypedFormControl;
  public searchForm: UntypedFormGroup;
  public data: Models.MediumList;

  initialData = [];
  notData = [];
  offSet = 0;
  limit = 5;
  testData = [];
  appId = "";
  searchType = 1;
  errorOccurred = false;
  userId = null;
  apiKey = "";

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

    this.isLoggedIn = this.auth.isAuthenticated();
  }

  ngOnInit() {
    this.appId = AuthenticationService.env.appId;
    this.searchForm
      .get("searchControl")
      .valueChanges.pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((subreddit: any) => {
        if (subreddit.length > 0) {
          this.searchTerm = subreddit;
          this.isLoading = false;

          this.searchBySearch();
        } else {
          this.searchTerm = "";

          this.searchAll();
        }
      });
  }

  register() {
    AuthenticationService.authState.next("register");
  }

  postNews() {
    this.router.navigate(["/news"]);
  }

  filterItems(searchTerm) {
    if (this.initialData) {
      return this.initialData
        .map((item) => {
          return {
            title: item.title,
            author: item.author,
            content: item.content,
            mediumId: item.mediumId,
            mtype: item.mtype,
            datePosted: item.datePosted,
            tag: item.tag,
            imageUrl: item.imageUrl,
          };
        })
        .filter((item) => {
          return (
            item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            item.author.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          );
        });
    }
  }

  setFilteredItems(searchItem: string) {
    this.testData = this.filterItems(searchItem);
  }
  onSearchInput() {
    this.searching = true;
  }

  getData() {
    this.remoteSvrc
      .getMediaByType(
        Models.mediumType.News.toString(),
        this.userId,
        null,
        null,
        this.appId
      )
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.data = data;
          this.initialData = data.list;
          this.notData = data.list;
          this.isLoading = true;
        },
        (err) => {}
      );
  }

  ionViewDidEnter() {
    this.searchType = SearchType.All;
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
          Models.mediumType.News.toString(),
          this.userId,
          this.offSet.toString(),
          this.limit.toString(),
          null,
          null,
          this.appId
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
          Models.mediumType.News.toString(),
          null,
          null,
          this.offSet.toString(),
          this.limit.toString()
        )
        .subscribe(
          (data) => {
            if (data.httpStatus == "200") {
              this.errorOccurred = false;
            } else {
              this.errorOccurred = true;
              return;
            }

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
}
