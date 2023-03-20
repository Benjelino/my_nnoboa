import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { NgZone } from "@angular/core";
import * as Models from "src/app/base-services/common-service/models/common-model.service";

import { ToastComponent } from "../../components/toastComponent";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { ContactUsService } from "src/app/base-services/remote-service/contactus.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

@Component({
  selector: "app-contactus",
  templateUrl: "./contactus.page.html",
  styleUrls: ["./contactus.page.scss"],
})
export class ContactusPage implements OnInit {
  isLoggedIn = false;
  isLoading = false;
  contactTypeLoaded = false;
  isSaved = false;

  userForm: UntypedFormGroup;
  public response: Models.ContactItemResponse;
  public contactTypes: Models.ContactTypes;

  userId: string;
  apiKey: string;

  captcha: boolean = false;
  private captchaResponse: string;
  formValid: boolean = false;
  roleCount: number = 1;
  appId = "";

  constructor(
    private zone: NgZone,
    private auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private remoteSvrc: ContactUsService,
    private toast: ToastComponent,
    public fb: UntypedFormBuilder,
    private events: Events
  ) {
    this.userForm = fb.group({
      message: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      phone: [
        "",
        Validators.compose([
          Validators.maxLength(17),
          Validators.minLength(7),
          Validators.pattern("[0-9-+ ]*"),
        ]),
      ],
      contacttype: ["", Validators.compose([Validators.required])],
    });
  }

  formErrors = {
    message: [],
    email: [],
    phone: [],
    contacttype: [],
  };

  validationMessages = {
    message: [
      { type: "required", message: "Message is required." },
      {
        type: "minlength",
        message: "Message must be at least 5 characters long.",
      },
    ],
    email: [
      { type: "required", message: "Email is Required." },
      { type: "pattern", message: "Enter the correct email address." },
    ],
    phone: [
      { type: "required", message: "Medium Type Required." },
      { type: "pattern", message: "Enter the phone number" },
      {
        type: "minlength",
        message: "Phone number should be at least 7 characters",
      },
      {
        type: "mxnlength",
        message: "Phone number should be at most 17 characters",
      },
    ],
    contacttype: [{ type: "required", message: "Contact Type Required." }],
  };

  captchaResolved(response: string): void {
    this.zone.run(() => {
      this.captcha = true;
      this.formValid =
        this.captcha && this.userForm.valid && this.roleCount > 0;
      this.captchaResponse = response;
    });
  }

  ngOnInit() {
    this.onChanges();
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;

    this.remoteSvrc.getContactTypes(this.appId, null, null).subscribe(
      (data) => {
        this.isLoading = false;
        this.contactTypes = data;
        this.isLoading = true;
      },
      (err) => {
        this.toast.presentFailedToast("Server Error | " + JSON.stringify(err));
      }
    );
  }

  onChanges(): void {
    this.userForm.valueChanges.subscribe((data) => {
      this.formValid =
        this.captcha && this.userForm.valid && this.roleCount > 0;
    });
  }

  postContactUs(value: any) {
    this.remoteSvrc.saveContactUs(
      this.appId,
        value.contacttype.ctId,
        value.email,
        value.phone,
        encodeURIComponent(value.message),
        null,
        null
      ).subscribe(
        (data) => {
          this.isSaved = false;
          this.response = data;
          this.isSaved = true;
          this.userForm.reset();

          this.events.publish("contactus:save", {
            user: null,
            time: new Date(),
          });

          this.toast.presentSuccessToast("Mesesage sent Successfully");
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

}
