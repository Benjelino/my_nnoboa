import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastComponent } from "src/app/components/toastComponent";

import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IonContent } from "@ionic/angular";

import { Share } from "@capacitor/share";
import { Answer } from "../services/models/answer.model";
import { Question } from "../services/models/question.model";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { QaaForumService } from "../services/qaaforum.service";
import { SubscriptionService } from "src/app/base-services/fcm-services/subscription.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";


@Component({
  selector: "app-questiondetail",
  templateUrl: "./questiondetail.page.html",
  styleUrls: ["./questiondetail.page.scss"],
})
export class QuestiondetailPage implements OnInit {
  @ViewChild("content", { static: true }) content: IonContent;
  userForm: UntypedFormGroup;
  answers: Answer[];
  question: Question;
  answer: Answer;
  isLoggedIn = false;
  isLoading = false;
  questionLoaded = false;
  answerSaved = false;
  answerLoaded = false;
  userId: string;
  apiKey: string;
  questionId: string;
  answerId: string;
  isEditMode = false;
  showForm = false;
  subscribed = false;

  constructor(
    private auth: AuthenticationService,
    private qaService: QaaForumService,
    private toast: ToastComponent,
    public fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private subSvrc: SubscriptionService,
    private events: Events
  ) {
    this.userForm = fb.group({
      answer: ["", Validators.compose([Validators.required])],
    });

    this.questionId = this.route.snapshot.paramMap.get("id");
  }

  validationMessages = {
    answer: [{ type: "required", message: "Slug is required." }],
  };

  async sendShare(message, subject = "Sabonay CMS") {
    const url = "https://www.sabonay.com";

    let shareRet = await Share.share({
      title: subject,
      text: message,
      url: "https://www.ccc.com",
      dialogTitle: "Share with buddies",
    });
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

  getAnswersVoteByUser() {
    this.qaService.getAnswersVotesByUser(this.userId, this.apiKey).subscribe(
      (data) => {},
      (err) => {}
    );
  }

  getQuestionsVoteByUser() {
    this.qaService.getQuestionsVotesByUser(this.userId, this.apiKey).subscribe(
      (data) => {},
      (err) => {}
    );
  }

  getQuestionDetails() {
    this.qaService.getQuestionById(this.questionId, this.apiKey).subscribe(
      (data) => {
        this.questionLoaded = false;
        this.question = data;
      
        this.answers = this.question.Answers;
        this.questionLoaded = true;
      },
      (err) => {
        this.questionLoaded = false;
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;

    }

    this.getQuestionDetails();
  }

  editAnswer(answerId: string) {
    this.openForm();
    this.answerId = answerId;
    this.isEditMode = true;

    const selectedObj = this.answers.find((item) => item.answerId === answerId);

    if (selectedObj != undefined || selectedObj != null) {
      this.userForm.patchValue({
        answer: selectedObj.answer,
      });
    }
  }

  storeAnswer(value: any) {
    if (this.isEditMode == false) {
      this.answerId = "";
    }

    this.answerSaved = false;
    this.qaService
      .storeAnswer(
        this.answerId,
        encodeURIComponent(value.answer),
        this.questionId,
        this.userId,
        this.apiKey
      )
      .subscribe(
        (data) => {
          this.closeForm();
          this.answerSaved = true;
          this.isEditMode = false;

          this.getQuestionDetails();
          this.toast.presentSuccessToast("Answer Saved Successfuly");
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  voteQuestion(questionId: string, vote: string) {
    if (this.isLoggedIn == true) {
      if (this.question.hasVotedQuestion == true) {
        this.toast.presentFailedToast("You have already voted");
      } else {
        this.qaService
          .voteQuestion(questionId, vote, this.userId, this.apiKey)
          .subscribe(
            (data) => {
              this.getQuestionDetails();
            },
            (err) => {
              this.toast.presentFailedToast(
                "Error Occured , Please try again !!!"
              );
            }
          );
      }
    } else {
      this.toast.presentFailedToast("Please log in to vote");
    }
  }

  voteAnswer(answerId: string, vote: string) {
    if (this.isLoggedIn == true) {
      const selectedObj = this.answers.find(
        (item) => item.answerId === answerId
      );
      if (
        selectedObj.AnswerStatistics.totUserAnswerDownVotesCount > 0 ||
        selectedObj.AnswerStatistics.totUserAnswerUpVotesCount > 0
      ) {
        this.toast.presentFailedToast("You have already voted for answer");
      } else {
        this.qaService
          .voteAnswer(answerId, vote, this.userId, this.apiKey)
          .subscribe(
            (data) => {
              this.getQuestionDetails();
            },
            (err) => {
              this.toast.presentFailedToast(
                "Error Occured , Please try again !!!"
              );
            }
          );
      }
    } else {
      this.toast.presentFailedToast("Please log in to vote");
    }
  }

  subscribeToNews() {
    this.subSvrc
      .subscribeToTopic(
        this.questionId,
        this.userId,
        "QAAF",
        "subscribe to question " + this.question.title,
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          if (data.httpStatus == "200") {
            this.toast.presentSuccessToast("Question subscribed Successfully");

            this.subscribed = true;
            this.question.hasSubscribed = true;

            this.events.publish("subscription:update", {
              user: null,
              time: new Date(),
            });
          } else {
            this.toast.presentFailedToast("Question Subscribtion Failed");
          }
        },
        (err) => {}
      );
  }

  unSubscribeToNews() {
    this.subSvrc
      .unsubscribeFromTopic(
        this.questionId,
        this.userId,
        "QAAF",
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          if (data.httpStatus == "200") {
            this.toast.presentSuccessToast(
              "Question Unsubscribed Successfully"
            );

            this.subscribed = false;
            this.question.hasSubscribed = false;
            this.events.publish("subscription:update", {
              user: null,
              time: new Date(),
            });
          } else {
            this.toast.presentFailedToast("Question Unsubscribed Failed");
          }
        },
        (err) => {}
      );
  }

}
