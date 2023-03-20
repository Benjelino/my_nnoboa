import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";

import * as Models from "src/app/media/services/media-model.service";
import { DcubecmsRemoteService } from "../services/dcubecms-remote.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-new-link",
  templateUrl: "./new-link.page.html",
  styleUrls: ["./new-link.page.scss"],
})
export class NewLinkPage implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private remoteSvrc: DcubecmsRemoteService,
    public fb: UntypedFormBuilder,
    public events: Events,
    private toast: ToastComponent,
    private auth: AuthenticationService
  ) {
    this.userForm = fb.group({
      urlink: [
        "",
        Validators.compose([Validators.required, Validators.pattern(this.reg)]),
      ],
      title: ["", Validators.compose([Validators.required])],
      ltype: ["", Validators.compose([Validators.required])],
      tag: ["", Validators.compose([Validators.minLength(0)])],
      mname: ["", Validators.compose([Validators.required])],
    });

    this.keys = Object.keys(this.linkType).filter((k) => !isNaN(Number(k)));

    this.mapEnumToArray();

    //console.log("linkTypesArray values", JSON.stringify(this.linkTypesArray));
  }

  mapEnumToArray() {
    this.linkTypesArray = [];
    for (var n in this.linkType) {
      if (typeof this.linkType[n] !== "number") {
        this.linkTypesArray.push({ name: this.linkType[n], value: n });
      }
    }
  }

  linkTypesArray = [];
  mediumId = null;
  isLoading = false;
  isSaved = false;
  public medium: Models.Medium;
  label: string;
  userForm: UntypedFormGroup;
  public response: Models.AnnoucementResponse;
  public linkType = Models.linkType;
  public mediaType = Models.mediumType;
  public keys: any;
  userId: string;
  apiKey: string;
  appId = "";
  reg =
    "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";

  formErrors = {
    urlink: [],
    title: [],
    mname: [],
    ltype: [],
  };

  validationMessages = {
    urlink: [{ type: "required", message: "URL is required." }],
    title: [{ type: "required", message: "Title is Required." }],
    mname: [{ type: "required", message: "Media Name is Required" }],
    ltype: [{ type: "required", message: "Link Type is Required" }],
  };

  ngOnInit() {
    this.mediumId = this.activatedRoute.snapshot.paramMap.get("mediumId");
    this.userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;
    this.appId = AuthenticationService.env.appId;
    this.label = "News Info";
    this.remoteSvrc
      .getMedium(this.mediumId, this.userId, null, this.apiKey, this.appId)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.medium = data;
          this.isLoading = true;
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  postLink(value: any) {
    this.remoteSvrc
      .saveLink(
        this.appId,
        encodeURIComponent(value.title),
        value.urlink,
        value.mname,
        value.ltype.value,
        this.mediumId,
        value.tag,
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
          this.toast.presentSuccessToast("Link Added Successfully");
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }
}
