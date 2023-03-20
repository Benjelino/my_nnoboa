import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";

import { IonInfiniteScroll } from "@ionic/angular";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import * as Models from "src/app/media/services/media-model.service";
import * as CModels from "src/app/base-services/common-service/models/common-model.service";

import { EsearchService } from "src/app/base-services/remote-service/esearch.service";

import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { DcubecmsRemoteService } from "../../services/dcubecms-remote.service";
import { SubscriptionService } from "src/app/base-services/fcm-services/subscription.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { SearchType } from "src/app/qanda/services/models/question.model";

@Component({
  selector: "app-ann-list-user",
  templateUrl: "./ann-list-user.page.html",
  styleUrls: ["./ann-list-user.page.scss"],
})
export class AnnListUserPage implements OnInit {
  isLoggedIn = false;
  isLoading = false;
  searching: any = false;
  searchTerm: string = "";
  searchControl: UntypedFormControl;
  public searchForm: UntypedFormGroup;
  public data: Models.MediumList;

  initialData = [];
  notData = [];
  offSet = 0;
  limit = 5;
  errorOccurred = false;
  searchType = 1;
  testData = [];
  subscribed = false;
  userId: string;
  apiKey: string;
  appId = "";
  subscribedTopic: CModels.SubscribedTopics;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private remoteSvrc: DcubecmsRemoteService,
    private esrchSvrc: EsearchService,
    private subSvrc: SubscriptionService,
    private toast: ToastComponent,
    private events: Events
  ) {
    this.events.subscribe("annoucement:update", (data: any) => {
      this.searchAll();
    });
    this.searchForm = new UntypedFormGroup({
      searchControl: new UntypedFormControl(""),
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;
    this.userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;

    this.checkSubscriptionStatus();

    this.searchForm
      .get("searchControl")
      .valueChanges.pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((subreddit: any) => {
        if (subreddit.length > 0) {
          this.isLoading = false;
          this.searchTerm = subreddit;
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

  login() {
    AuthenticationService.authState.next("login");
  }
  annoucement() {
    this.router.navigate(["/news"]);
  }

  news() {
    this.router.navigate(["/news-list"]);
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
        Models.mediumType.Announcement.toString(),
        this.userId,
        null,
        this.apiKey,
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
    this.checkSubscriptionStatus();
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
          this.apiKey,
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
          Models.mediumType.Announcement.toString(),
          null,
          this.apiKey,
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
        this.apiKey,
        this.appId
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

  subscribeToNews() {
    this.subSvrc
      .subscribeToTopic(
        "cmsAnnounce",
        this.userId,
        "LCCMS",
        "subscribe to cmsAnnounce topic",
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          if (data.httpStatus == "200") {
            this.subscribed = true;
            this.toast.presentSuccessToast(" Subscribe Successfully");
          } else {
            this.toast.presentFailedToast(" Subscribe Failed");
          }
        },
        (err) => {
          this.toast.presentFailedToast(" Subscribe Failed");
        }
      );
  }

  unSubscribeToNews() {
    this.subSvrc
      .unsubscribeFromTopic(
        "cmsAnnounce",
        this.userId,
        "LCCMS",
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          if (data.httpStatus == "200") {
            this.subscribed = false;
            this.toast.presentSuccessToast(" Un-Subscribe Successfully");
          } else {
            this.toast.presentFailedToast(" Un-Subscribe Failed");
          }
        },
        (err) => {
          this.toast.presentFailedToast(" Un-Subscribe Failed");
        }
      );
  }

  checkSubscriptionStatus() {
    this.subSvrc.getSubscribeFromTopic(null, this.apiKey).subscribe(
      (data) => {
        this.subscribedTopic = data as CModels.SubscribedTopics;

        if (this.subscribedTopic.subscribedTopics.includes("cmsAnnounce")) {
          this.subscribed = true;
        } else {
          this.subscribed = false;
        }
      },
      (err) => {
        this.toast.presentFailedToast(" Un-Subscribe Failed");
      }
    );
  }
}
