import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/auth/auth-service/authentication.service';
import { EcfundenumdataService } from 'src/app/noboa/services/base-services/ecfundenumdata.service';

import * as Models from "src/app/base-services/common-service/models/common-model.service";
import { ToastComponent } from '../../components/toastComponent';
import { Events } from '../../base-services/publish-subscribe/events.service';

@Component({
  selector: 'app-ecprofile',
  templateUrl: './ecprofile.component.html',
  styleUrls: ['./ecprofile.component.scss'],
})
export class EcprofileComponent implements OnInit {

  isLoggedIn = false;
  isLoading = false;
  companyTypeLoaded = false;
  isSaved = false;

  userForm: UntypedFormGroup;
  // public response: Models.ContactItemResponse;
  public companyTypes: Models.CompanyTypes;

  userId: string;
  apiKey: string;

  captcha: boolean = false;
  private captchaResponse: string;
  formValid: boolean = false;
  roleCount: number = 1;
  appId = "";
  file: File;

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: EcfundenumdataService,
    private toast: ToastComponent,
    public fb: UntypedFormBuilder,
    private events: Events
  ) {
    this.userForm = fb.group({
      message: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      companytype: ["", Validators.compose([Validators.required])],
    });
  }

  formErrors = {
    message: [],
    companytype: [],
  };

  validationMessages = {
    message: [
      { type: "required", message: "Message is required." },
      {
        type: "minlength",
        message: "Message must be at least 5 characters long.",
      },
    ],
    companytype: [{ type: "required", message: "Contact Type Required." }],
  };

  ngOnInit() {
    this.onChanges();
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;

    this.remoteSvrc.getEcFundEnumData(this.appId, null, null).subscribe(
      (data) => {
        this.isLoading = false;
        this.companyTypes = data.FundCatTypeEnumerations;
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
        this.userForm.valid && this.roleCount > 0;
    });
  }

  changeListener($event): void {
    this.file = $event.target.files[0];
  }
}
