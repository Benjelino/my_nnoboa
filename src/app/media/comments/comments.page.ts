import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Models from "src/app/media/services/media-model.service";

import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";

import { ToastComponent } from "../../components/toastComponent";
import { DcubecmsRemoteService } from "src/app/media/services/dcubecms-remote.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
@Component({
  selector: "app-comments",
  templateUrl: "./comments.page.html",
  styleUrls: ["./comments.page.scss"],
})
export class CommentsPage implements OnInit {
  constructor(
    private auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private remoteSvrc: DcubecmsRemoteService,
    private toast: ToastComponent,
    public fb: UntypedFormBuilder
  ) {
    this.userForm = fb.group({
      name: ["", Validators.compose([Validators.required])],
      subject: ["", Validators.compose([Validators.required])],
      comment: ["", Validators.compose([Validators.required])],
    });
  }

  isLoggedIn = false;
  mediumId = null;
  isLoading = false;
  commentLoaded = false;
  isSaved = false;
  appId = "";
  public medium: Models.Medium;
  public comments: Models.Comments;
  userForm: UntypedFormGroup;
  public response: Models.CommentResponse;
  public username: string;
  public mediaType = Models.mediumType;
  userId: string;
  apiKey: string;

  formErrors = {
    name: [],
    subject: [],
    comment: [],
  };

  validationMessages = {
    name: [{ type: "required", message: "Name is required." }],
    subject: [{ type: "required", message: "Subject is Required." }],
    comment: [{ type: "required", message: "Comment is Required" }],
  };

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;

    if (this.isLoggedIn == true) {
      this.username = this.auth.getUserLogin().username;
      this.userForm.controls.name.setValue(this.username);
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }
    this.mediumId = this.activatedRoute.snapshot.paramMap.get("mediumId");

    this.remoteSvrc
      .getMedium(this.mediumId, this.userId, null, this.apiKey, this.appId)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.medium = data;
          this.isLoading = true;
          this.getComment();
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  postComment(value: any) {
    this.remoteSvrc
      .saveComment(
        this.appId,
        this.mediumId,
        value.name,
        value.subject,
        value.comment,
        this.userId,
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          this.isSaved = false;
          this.response = data;
          this.isSaved = true;

          this.userForm.reset();
          this.getComment();
          this.toast.presentSuccessToast("Comment Saved Successfuly");
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  ionViewDidEnter() {
    if (this.isLoading == true) {
      this.getComment();
    }
  }

  getComment() {
    this.remoteSvrc
      .getCommentsByMedium(
        this.appId,
        this.mediumId,
        this.userId,
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          this.commentLoaded = false;
          this.comments = data;

          this.commentLoaded = true;
        },
        (err) => {
          this.commentLoaded = false;
        }
      );
  }

  onValueChanged() {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = [];
      this.userForm[field] = "";
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field].push(messages[key]);
        }
      }
    }
  }
}
