import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from "@angular/forms";



import { ToastComponent } from "src/app/components/toastComponent";
import { ProfileService } from "src/app/profile/services/profile.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { PasswordValidator } from "src/app/components-auth/passwordValidator";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.page.html",
  styleUrls: ["./change-password.page.scss"],
})
export class ChangePasswordPage implements OnInit {
  isLoggedIn = false;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    public formBuilder: UntypedFormBuilder,
    private toast: ToastComponent,
    private psprof: ProfileService
  ) {
    this.matching_passwords_group = new UntypedFormGroup(
      {
        password: new UntypedFormControl(
          "",
          Validators.compose([
            Validators.minLength(5),
            Validators.required,
            Validators.pattern(
              "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
            ),
          ])
        ),
        confirm_password: new UntypedFormControl("", Validators.required),
      },
      (formGroup: UntypedFormGroup) => {
        return PasswordValidator.areNotEqual(formGroup);
      }
    );

    this.changePasswordForm = formBuilder.group({
      /*   username: new FormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ), */
      oldPassword: new UntypedFormControl(
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
      matching_passwords: this.matching_passwords_group,
    });
  }
  changePasswordForm: UntypedFormGroup;
  matching_passwords_group: UntypedFormGroup;

  userId: string;
  apiKey: string;

  validation_messages = {
    username: [
      { type: "required", message: "Username is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
    oldPassword: [
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 6 characters long.",
      },
    ],
    password: [
      // tslint:disable-next-line: max-line-length
      {
        type: "pattern",
        message:
          "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
      },
      { type: "required", message: "Password is required." },
      {
        type: "minlength",
        message: "Password must be at least 5 characters long.",
      },
    ],
    confirm_password: [
      { type: "required", message: "Confirm password is required" },
    ],
    matching_passwords: [{ type: "areNotEqual", message: "Password mismatch" }],
  };

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();

    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }
  }

  save() {
    let msgBody: any = { 
      oldPassword: this.changePasswordForm["value"]["oldPassword"],
      newPassword: this.changePasswordForm.get("matching_passwords.password")
        .value,
      newPasswordVerify: this.changePasswordForm.get(
        "matching_passwords.confirm_password"
      ).value,
    };

   

    this.psprof.changePassword(msgBody, this.apiKey).then(
      (data: any) => {
        if (data.updateSuccessful == "true") {
          this.toast.presentSuccessToast("ChangePassword was successful");
        } else {
          this.toast.presentFailedToast(data.messages);
        }
     
      },
      (err) => {
        this.toast.presentFailedToast("ChangePassword was not successful");
      }
    );
  }

  cancel() {
    this.router.navigate(["/menu/client-dashboard"]);
  }
}
