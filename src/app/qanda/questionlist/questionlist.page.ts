import { Component, OnInit, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { NavigationExtras, Router } from "@angular/router";
import { IonContent, IonInfiniteScroll } from "@ionic/angular";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ToastComponent } from "src/app/components/toastComponent";

import * as Models from "src/app/base-services/common-service/models/common-model.service";
import { Question, SearchType } from "../services/models/question.model";
import { Category } from "../services/models/category.model";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { QaaForumService } from "../services/qaaforum.service";
import { SubscriptionService } from "src/app/base-services/fcm-services/subscription.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";

@Component({
  selector: "app-questionlist",
  templateUrl: "./questionlist.page.html",
  styleUrls: ["./questionlist.page.scss"],
})
export class QuestionlistPage implements OnInit {
  @ViewChild("content", { static: true }) content: IonContent;
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  userForm: UntypedFormGroup;
  questions: Question[];

  question: Question;
  categories: Category[];
  isLoggedIn = false;
  isLoading = false;
  questionLoaded = false;
  questionSaved = false;
  userId: string;
  apiKey: string;
  questionId: string;
  isEditMode = false;
  showForm = false;
  categoryLoaded = false;
  searchType = 1;
  currentTag = "";
  currentUser = "";
  currentCategory = "";

  notData: Question[] = [];
  offSet = 0;
  limit = 7;
  testData: Question[] = [];
  errorOccurred = false;
  searching: any = false;
  searchTerm: string = "";
  searchControl: UntypedFormControl;
  public searchForm: UntypedFormGroup;
  showEditor = false;
  subscribedTopic: Models.SubscribedTopics;

  constructor(
    private auth: AuthenticationService,
    private qaService: QaaForumService,
    private toast: ToastComponent,
    public fb: UntypedFormBuilder,
    private router: Router,
    private subSvrc: SubscriptionService,
    private events: Events
  ) {
    this.events.subscribe("subscription:update", (data: any) => {
      this.searchAll();
    });

    this.searchForm = new UntypedFormGroup({
      searchControl: new UntypedFormControl(""),
    });

    this.userForm = fb.group({
      title: ["", Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
      categoryId: ["", Validators.compose([Validators.required])],
      tags: ["", Validators.compose([Validators.required])],
    });
  }

  validationMessages = {
    title: [{ type: "required", message: "Title is Required." }],
    description: [{ type: "required", message: "Description is Required" }],
    categoryId: [{ type: "required", message: "Category is Required" }],
    tags: [{ type: "required", message: "Tags is Required" }],
  };

  viewDetails(questionId: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        questionId: questionId,
      },
    };
    if (this.isLoggedIn == true) {
      this.router.navigate(["/menu/questiondetail"], navigationExtras);
    } else {
      this.router.navigate(["/questiondetail"], navigationExtras);
    }
  }

  addNew() {
    this.openForm();
    this.isEditMode = false;
    this.userForm.reset();
  }

  openForm() {
    this.showForm = true;

    setTimeout(() => {
      this.content.scrollToBottom(1500);
    }, 550);
  }

  closeForm() {
    this.showForm = false;
    this.userForm.reset();
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();

    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;

      let myUserDetails = this.auth.getUserLogin();

      if (myUserDetails.isShowEditor == "Y") {
        this.showEditor = true;
      } else {
        this.showEditor = false;
      }

      this.qaService.getCategories(this.apiKey).subscribe(
        (data) => {
          this.categoryLoaded = false;
          this.categories = data.Categories;
          this.categoryLoaded = true;
        },
        (err) => {
          this.categoryLoaded = false;
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );
    }

    this.searchForm
      .get("searchControl")
      .valueChanges.pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((subreddit: any) => {
        if (subreddit.length > 0) {
          this.isLoading = false;
          this.searchTerm = subreddit;

          this.searchBySearch(this.searchTerm);
        } else {
          this.searchTerm = "";

          this.searchAll();
        }
      });
  }

  getQuestions() {
    this.qaService.getQuestions(this.apiKey).subscribe(
      (data) => {
        this.questionLoaded = false;
        this.questions = data.Questions as Question[];

        this.questionLoaded = true;
      },
      (err) => {
        this.questionLoaded = false;
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }
  editQuestion(questionId: string) {
    this.openForm();
    this.isEditMode = true;
    this.questionId = questionId;

    const selectedObj = this.questions.find(
      (item) => item.questionId === questionId
    );

    const selectedCat = this.categories.find(
      (item) => item.catId === selectedObj.catId
    );

    if (selectedObj != undefined || selectedObj != null) {
      this.userForm.patchValue({
        tags: selectedObj.tags,
        title: selectedObj.title,
        description: selectedObj.description,
        categoryId: selectedCat,
      });
    }
  }

  storeQuestion(value: any) {
    if (this.isEditMode == false) {
      this.questionId = "";
    }
    const cat: Question = {
      questionId: this.questionId,
      catId: value.categoryId.catId,
      description: encodeURIComponent(value.description),
      slug: this.qaService.slugify(encodeURIComponent(value.title)),
      title: encodeURIComponent(value.title),
      createdDate: new Date(),
      userId: this.userId,
      tags: value.tags,
    };
    this.questionSaved = false;
    this.qaService.storeQuestion(cat, this.apiKey).subscribe(
      (data) => {
        this.userForm.reset();
        this.questionSaved = true;
        this.isEditMode = false;
        this.showForm = false;

        this.getQuestions();
        this.toast.presentSuccessToast("Question Saved Successfuly");
      },
      (err) => {
        this.toast.presentFailedToast("Server Error | " + JSON.stringify(err));
      }
    );
  }

  ionViewDidEnter() {
    this.searchType = SearchType.All;
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  searchAll() {
    this.searchType = SearchType.All;
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  searchByUser(userId: string) {
    this.currentUser = userId;
    this.searchType = SearchType.User;
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  searchByTag(tag: string) {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.currentTag = tag;
    this.searchType = SearchType.Tags;
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  searchBySearch(tag: string) {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.currentTag = tag;
    this.searchType = SearchType.Search;
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  searchByCategory(catId: string) {
    this.infinite.disabled = false;
    this.offSet = 0;
    this.currentCategory = catId;
    this.searchType = SearchType.Categeory;
    this.notData = [];
    this.testData = [];
    this.loadNews();
  }

  loadNews(loadMore = false, event?) {
    if (loadMore) {
      this.offSet += this.limit;
    }

    if (this.searchType == SearchType.All) {
      this.qaService
        .getQuestionsByPage(this.offSet, this.limit, this.apiKey)
        .subscribe(
          (data) => {
            if (data.httpStatus == "200") {
              this.errorOccurred = false;
            } else {
              this.errorOccurred = true;
              return;
            }
            this.isLoading = false;
            this.questions = data.Questions as Question[];

            this.notData = [...this.notData, ...data.Questions];
            this.testData = [...this.testData, ...data.Questions];
            this.isLoading = true;
            if (event) {
              event.target.complete();
            }
            if (this.questions.length > 0) {
              if (
                this.notData.length >=
                this.questions[0].Statistics.totQuestionsCount
              ) {
                this.infinite.disabled = true;
              }
            } else {
              this.infinite.disabled = true;
            }
          },
          (err) => {
            this.toast.presentFailedToast("Server Error | " + err);
          }
        );
    } else if (this.searchType == SearchType.Categeory) {
      this.qaService
        .getQuestionsByCategoryPage(
          this.currentCategory,
          this.offSet,
          this.limit,
          this.apiKey
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
            this.questions = data.Questions as Question[];
            this.notData = [...this.notData, ...data.Questions];
            this.testData = [...this.testData, ...data.Questions];
            this.isLoading = true;
            if (event) {
              event.target.complete();
            }
            if (this.questions.length > 0) {
              if (
                this.notData.length >=
                this.questions[0].Statistics.totQuestionsCount
              ) {
                this.infinite.disabled = true;
              }
            } else {
              this.infinite.disabled = true;
            }
          },
          (err) => {
            this.toast.presentFailedToast("Server Error | " + err);
          }
        );
    } else if (this.searchType == SearchType.User) {
      this.qaService
        .getQuestionsByUserPage(
          this.currentUser,
          this.offSet,
          this.limit,
          this.apiKey
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
            this.questions = data.Questions as Question[];
            this.notData = [...this.notData, ...data.Questions];
            this.testData = [...this.testData, ...data.Questions];
            this.isLoading = true;
            if (event) {
              event.target.complete();
            }
            if (
              this.notData.length >=
              this.questions[0].Statistics.totQuestionsCount
            ) {
              this.infinite.disabled = true;
            }
          },
          (err) => {
            this.toast.presentFailedToast("Server Error | " + err);
          }
        );
    } else if (this.searchType == SearchType.Tags) {
      this.qaService
        .getQuestionsByTag(
          this.currentTag,
          this.offSet,
          this.limit,
          this.apiKey
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
            this.questions = data.Questions as Question[];
            this.notData = [...this.notData, ...data.Questions];
            this.testData = [...this.testData, ...data.Questions];
            this.isLoading = true;
            if (event) {
              event.target.complete();
            }
            if (
              this.notData.length >=
              this.questions[0].Statistics.totQuestionsCount
            ) {
              this.infinite.disabled = true;
            }
          },
          (err) => {
            this.toast.presentFailedToast("Server Error | " + err);
          }
        );
    } else if (this.searchType == SearchType.Search) {
      this.qaService
        .searchQuestions(this.searchTerm, this.offSet, this.limit, this.apiKey)
        .subscribe(
          (data) => {
            if (data.httpStatus == "200") {
              this.errorOccurred = false;
            } else {
              this.errorOccurred = true;
              return;
            }
            let hitCounts = data.hitsCount as number;
            this.isLoading = false;
            this.questions = data.hits as Question[];
            this.notData = [...this.notData, ...data.hits];
            this.testData = [...this.testData, ...data.hits];
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

  subscribeToNews(questionId) {
    this.subSvrc
      .subscribeToTopic(
        questionId,
        this.userId,
        "QAAF",
        "subscribe to question " + questionId,
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          if (data.httpStatus == "200") {
            this.toast.presentSuccessToast("Question Subscribed Successfully");

            for (let i = 0; i < this.testData.length; i++) {
              if (questionId == this.testData[i].questionId) {
                this.testData[i].hasSubscribed = true;
              }
            }
          } else {
            this.toast.presentFailedToast("Question Unsubscribed Failed");
          }
        },
        (err) => {
          this.toast.presentFailedToast("Question Unsubscribed Failed");
        }
      );
  }

  unSubscribeToNews(questionId) {
    this.subSvrc
      .unsubscribeFromTopic(questionId, this.userId, "QAAF", null, this.apiKey)
      .subscribe(
        (data) => {
          if (data.httpStatus == "200") {
            this.toast.presentSuccessToast(
              "Question Unsubscribed Successfully"
            );
            for (let i = 0; i < this.testData.length; i++) {
              if (questionId == this.testData[i].questionId) {
                this.testData[i].hasSubscribed = false;
              }
            }
          } else {
            this.toast.presentFailedToast("Question Unsubscribed Failed");
          }
        },
        (err) => {
          this.toast.presentFailedToast("Question Unsubscribed Failed");
        }
      );
  }

  checkSubscriptionStatus(questionId): boolean {
    let isSubscribed = false;
    /* this.subSvrc.getSubscribeFromTopic(null, this.apiKey).subscribe(
      (data) => {
        this.subscribedTopic = data as Models.SubscribedTopics;

        if (this.subscribedTopic.subscribedTopics.includes(questionId)) {
          isSubscribed = true;
        } else {
          isSubscribed = false;
        }
      },
      (err) => {
        this.toast.presentFailedToast(" Un-Subscribe Failed");
        isSubscribed = false;
      }
    ); */

    return false;
  }
}
