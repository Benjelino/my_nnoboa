import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { CommonService } from "src/app/base-services/common-service/common.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { ProfileService } from "src/app/profile/services/profile.service";


@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.page.html",
  styleUrls: ["./forgot.page.scss"],
})
export class ForgotPage implements OnInit {
  userForm: UntypedFormGroup;
  errorMessage: string;

  constructor(
    public fb: UntypedFormBuilder,
    private commonSvrc: CommonService,
    private psprof: ProfileService,
    private toast: ToastComponent
  ) {
    this.userForm = fb.group({
      username: ["", Validators.compose([Validators.required])],
      emailAddr: [
        "",
        Validators.compose([
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
          Validators.required,
        ]),
      ],
      mobileNumber: [
        "",
        Validators.compose([
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.required,
        ]),
      ],
      agree: [
        false,
        Validators.compose([Validators.pattern("true"), Validators.required]),
      ],
    });
  }

  validation_messages = {
    username: [{ type: "required", message: "Author is required." }],
    emailAddr: [
      { type: "required", message: "Medium Type Required." },
      { type: "pattern", message: "Enter the correct email address." },
    ],
    mobileNumber: [
      { type: "required", message: "Title Required" },

      {
        type: "minlength",
        message: "Mobile Number  must be at least 10 digits long.",
      },
      {
        type: "maxlength",
        message: "Mobile Number  must be at most 10 digits long.",
      },
    ],
    agree: [{ type: "required", message: "Content Required" }],
  };

  ngOnInit() {}

  getTranslate(ptitle) {
    return this.commonSvrc.translateString(ptitle);
  }

  forgot(value: any) {
    let msgBody = {
      username: this.userForm["value"]["username"],
      emailAddress: this.userForm["value"]["emailAddr"],
      cphone: this.userForm["value"]["mobileNumber"],
    };

    this.psprof.resetPasswordMoqui(msgBody).then(
      (data) => {},
      (err) => {
        this.toast.presentFailedToast("forgot() err: " + JSON.stringify(err));
      }
    );
  }

  formErrors = {
    username: [],
  };

  validationMessages = {
    username: {
      required: "username is required.",
    },
  };

  onValueChanged(data?: any) {
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
