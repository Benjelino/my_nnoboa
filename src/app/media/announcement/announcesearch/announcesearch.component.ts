import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { IonInfiniteScroll, ModalController } from "@ionic/angular";

import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as Models from "src/app/media/services/media-model.service";
import { EsearchService } from "src/app/base-services/remote-service/esearch.service";
import { DcubecmsRemoteService } from "../../services/dcubecms-remote.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
import { EventlistComponent } from "src/app/events/eventlist/eventlist.component";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { SearchType } from "src/app/qanda/services/models/question.model";
import { ApplinksPage } from "../../applinks/applinks.page";
import { MedialinklistComponent } from "../../medialinklist/medialinklist.component";
import { TributeComponent } from "../../tributes/tribute/tribute.component";
import { TributelistComponent } from "../../tributes/tributelist/tributelist.component";

@Component({
  selector: "app-announcesearch",
  templateUrl: "./announcesearch.component.html",
  styleUrls: ["./announcesearch.component.scss"],
})
export class AnnouncesearchComponent implements OnInit {
  public searchForm: UntypedFormGroup;
  searchControl: UntypedFormControl;
  searchType = 1;

  isLoggedIn = false;
  isLoading = false;
  searching: any = false;
  searchTerm: string = "";

  public mediaType = Models.mediumType;

  public data: Models.MediumList;
  errorOccurred = false;
  initialData = [];
  searchData = [];
  notData = [];
  offSet = 0;
  limit = 5;
  appId;
  testData = [];
  isAnnouncement = false;
  userId = "0";
  @Input()
  mtype: Models.mediumType = Models.mediumType.Announcement;

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private remoteSvrc: DcubecmsRemoteService,
    private esrchSvrc: EsearchService,
    private toast: ToastComponent,
    public modalController: ModalController
  ) {
    this.searchForm = new UntypedFormGroup({
      searchControl: new UntypedFormControl(""),
    });
  }

  ngAfterViewInit() {
    this.searchAll();
  }

  getPicture(picture: string) {
    //console.log("getPicture() picture ", picture);
    if (Utils.isStringEmpty(picture)) {
      //console.log("getPicture(1) url prefix ", AppConstants.URL_MOQUI_DUTILS_NOAUTH);
      return (
        AppConstants.URL_MOQUI_DUTILS_NOAUTH +
        "getResource?inline=true&pathname=dbresource://dcube-utils/sabonay_logo.png"
      );
    } else {
      if (!picture.startsWith("http")) {
        //console.log("getPicture(2) url prefix ", AppConstants.URL_MOQUI_DUTILS_NOAUTH);
        return (
          AppConstants.URL_MOQUI_DUTILS_NOAUTH +
          "getResource?inline=true&pathname=" +
          picture
        );
      } else {
        return picture;
      }
    }
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;

    if (this.mtype == Models.mediumType.Announcement) {
      this.isAnnouncement = true;
    } else {
      this.isAnnouncement = false;
    }

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
      .getSearch(searchTerm, this.mtype.toString(), null, null)
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
        this.mtype.toString(),
        this.userId,
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

  async openEventsModal(eventList: any) {
    if (eventList.length > 0) {
      const modal = await this.modalController.create({
        component: EventlistComponent,
        componentProps: {
          eventList: eventList,
        },
      });
      return await modal.present();
    }
  }

  async openLinkssModal(linkList: any) {
    if (linkList.length > 0) {
      const modal = await this.modalController.create({
        component: MedialinklistComponent,
        componentProps: {
          linkList: linkList,
        },
      });
      return await modal.present();
    }
  }

  async openTributeModal(tributeList: any) {
    if (tributeList.length > 0) {
      const modal = await this.modalController.create({
        component: TributelistComponent,
        componentProps: {
          tributeList: tributeList,
        },
      });
      return await modal.present();
    }
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
          this.mtype.toString(),
          this.userId,
          this.offSet.toString(),
          this.limit.toString(),
          null,
          null,
          this.appId
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
            //this.toast.presentFailedToast("Server Error | " + err);
            this.isLoading = true;

            if (event) {
              event.target.complete();
            }

            this.infinite.disabled = true;
          }
        );
    } else if (this.searchType == SearchType.Search) {
      this.esrchSvrc
        .getSearchPage(
          this.searchTerm,
          this.mtype.toString(),
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
            //this.toast.presentFailedToast("Server Error | " + err);
            this.isLoading = true;

            if (event) {
              event.target.complete();
            }

            this.infinite.disabled = true;
          }
        );
    }
  }
}
