import { Component, OnInit } from "@angular/core";
import { NgZone } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";

import { TermsOfServicePage } from "../../components/terms-of-service/terms-of-service.page";
import { PrivacyPolicyPage } from "../../components/privacy-policy/privacy-policy.page";

import { ToastComponent } from "src/app/components/toastComponent";
import { CommonService } from "src/app/base-services/common-service/common.service";
import { ProfileService } from "src/app/profile/services/profile.service";
import { TestingService } from "src/app/base-services/testing-service/testing.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { PasswordValidator } from "src/app/components-auth/passwordValidator";
import {
  IAppLocale,
  IUserLogin,
  UserLogin,
} from "src/app/base-services/common-service/models/common-model.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { GeoService } from "src/app/geo/services/geo.service";
import { ValidateUrl } from "src/app/registration/keywordValidator";

const DEFAULT_CURRENCY = "Ghanaian cedi";
const DEFAULT_CURRENCY_CODE = "GHS";

const DEFAULT_COUNTRY = "Ghana";
const DEFAULT_COUNTRY_CODE = "GHA";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  userId: string = "";
  userForm: UntypedFormGroup;
  matching_passwords_group: UntypedFormGroup;
  userGroupId: string[];
  latitude: number;
  longitude: number;
  ipaddress: string;

  appId = "SABGH";
  appLocale: IAppLocale = AuthenticationService.env.appLocale;
  selectedCurrency: string = DEFAULT_CURRENCY;
  selectedCurrencyCode: string = DEFAULT_CURRENCY_CODE;
  selectedCountry: string = DEFAULT_COUNTRY;
  countryCode: string = DEFAULT_COUNTRY_CODE;

  errorMessage: string;

  credentials = null;
  duration = 30000;
  task;

  captcha: boolean = false;
  private captchaResponse: string;
  formValid: boolean = false;

  DACLIENT: boolean;
  DASERVICEPROVIDER: boolean;
  DSAGENT: boolean = false;
  roleCount: number = 0;

  // for testing
  testing: boolean = TestingService.testing;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    private toastCtrl: ToastComponent,
    private zone: NgZone,
    public fb: UntypedFormBuilder,
    private commonSvrc: CommonService,
    private psprof: ProfileService,
    private testingSvrc: TestingService,
    private remoteSvrc: RemoteService,
    private toast: ToastComponent,
    private geoSvrc: GeoService
  ) {
    this.appId = AuthenticationService.env.appId;

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

    this.userForm = fb.group({
      userId: "",
      filename: "",
      username: [
        "",
        Validators.compose([
          Validators.minLength(6),
          Validators.required,
          ValidateUrl,
        ]),
      ],
      matching_passwords: this.matching_passwords_group,
      email: [
        "",
        Validators.compose([
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
          null,
        ]),
      ],
      cphone: [
        "",
        Validators.compose([
          Validators.maxLength(17),
          Validators.minLength(7),
          Validators.pattern("[0-9-+ ]*"),
          Validators.required,
        ]),
      ],
      countryCode: [""],
      selectedCurrencyCode: [""],
      agree: [
        false,
        Validators.compose([Validators.pattern("true"), Validators.required]),
      ],
    });
  }

  validation_messages = {
    username: [
      { type: "required", message: "Username is required." },
      {
        type: "minlength",
        message: "Username must be at least 5 characters long.",
      },
      {
        type: "reservedName",
        message: "Name has been reserved",
      },
    ],
    email: [
      { type: "required", message: "Email Required." },
      { type: "pattern", message: "Enter the correct email address." },
    ],
    cphone: [
      { type: "required", message: "Mobile Phone Required." },
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
    countryCode: [
      { type: "required", message: "Country Code Required." },
      {
        type: "minlength",
        message: "Country Code should be 3 characters",
      },
    ],
    selectedCurrencyCode: [
      { type: "required", message: "Currency Code Required." },
      { type: "pattern", message: "Currency Code should be 3 characters" },
    ],
    agree: [{ type: "required", message: "Agree Checkbox Required" }],
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
    if (undefined != this.appLocale) {
      this.selectedCurrency = this.appLocale.appCurrency;
      this.selectedCurrencyCode = this.appLocale.appCurrencyCode;
      this.selectedCountry = this.appLocale.appCountry;
      this.countryCode = this.appLocale.appCountryCode;
    } else {
      this.selectedCurrency = DEFAULT_CURRENCY;
      this.selectedCurrencyCode = DEFAULT_CURRENCY_CODE;
      this.selectedCountry = DEFAULT_COUNTRY;
      this.countryCode = DEFAULT_COUNTRY_CODE;
    }

    this.setFormData();

    this.onChanges();
  }

  getTranslate(ptitle) {
    return this.commonSvrc.translateString(ptitle);
  }

  onChanges(): void {
    this.userForm.valueChanges.subscribe((data) => {
      this.formValid =
        this.captcha && this.userForm.valid && this.roleCount > 0;
    });
  }

  onValueChanged(event) {}

  cbClientChanged(ev) {
    this.DACLIENT = ev["detail"]["checked"];
    this.DACLIENT ? this.roleCount++ : this.roleCount--;
    this.formValid = this.captcha && this.userForm.valid && this.roleCount > 0;
  }

  cbServiceChanged(ev) {
    this.DASERVICEPROVIDER = ev["detail"]["checked"];
    this.DASERVICEPROVIDER ? this.roleCount++ : this.roleCount--;
    this.formValid = this.captcha && this.userForm.valid && this.roleCount > 0;
  }

  captchaResolved(response: string): void {
    this.zone.run(() => {
      this.captcha = true;
      this.formValid =
        this.captcha && this.userForm.valid && this.roleCount > 0;
      this.captchaResponse = response;
    });
  }

  gotoLogin() {
    if (null != this.credentials) {
      this.router.navigateByUrl("/login", {
        state: {
          credentials: this.credentials,
        },
      });
    }
  }

  getCountryCurrencyList(countryCode) {
    let self = this;
    this.countryCode = countryCode;

    this.geoSvrc.getCountryCurrencyList().then(
      (data) => {
        if (data["httpStatus"] === "200") {
          self.countries = data["CountryCodes"];
          self.currencies = data["CurrencyCodes"];
        }
      },
      (err) => {
        this.toastCtrl.presentFailedToast(
          "ServiceRequestPage::getCountryCurrencyList() err: " +
            JSON.stringify(err)
        );
      }
    );
  }

  currencies: any = [];
  currency: any = {
    description: DEFAULT_CURRENCY,
    uomId: DEFAULT_CURRENCY_CODE,
  };

  countries: any = [];
  country: any = {
    geoName: DEFAULT_COUNTRY,
    geoId: DEFAULT_COUNTRY_CODE,
  };

  async storeBaseRegistration() {
    let self = this;
    let msg = "processing registration ...";
    let titleSuccess = "Registration Successful";
    const loading = await this.loadingCtrl.create({
      message: msg,
      duration: this.duration,
    });
    await loading.present();

    let url_p = AppConstants.URL_MOQUI_AUTH_REST + "storeBaseRegistration";

    let mxreg = "N";
    let mxreg_a = AuthenticationService.env.mxreg;
    if (undefined != mxreg_a && null != mxreg_a) {
      mxreg = mxreg_a;
    }

    let username = this.userForm["value"]["username"];

    let cphone = this.userForm["value"]["cphone"];
    let emailAddress = this.userForm["value"]["email"];
    let password = this.userForm.get("matching_passwords.password").value;

    this.credentials = { username: username, password: password };

    let userGroupArray: string[] = [];

    if (this.DACLIENT) {
      userGroupArray.push("DACLIENT");
    }
    if (this.DASERVICEPROVIDER) {
      userGroupArray.push("DASERVICEPROVIDER");
    }

    let country = null;
    let currency = null;
    if (undefined != this.appLocale) {
      country = this.userForm.value.countryCode;
      currency = this.userForm.value.selectedCurrencyCode;
    } else {
      country = this.userForm.value.countryCode.geoId;
      currency = this.userForm.value.selectedCurrencyCode.uomId;
    }

    let fromDate = new Date().getTime();
    let msgBody: any = {
      appId: this.appId,
      username: username,
      newPassword: password,
      newPasswordVerify: this.userForm.get(
        "matching_passwords.confirm_password"
      ).value,
      emailAddress: emailAddress,
      cphone: cphone,
      countryCode: country,
      currencyUomId: currency,
      fromDate: fromDate,
      userGroupArray: userGroupArray,
      mxreg: mxreg,
    };

    let userId = this.userForm["value"]["userId"];
    if (this.testing && null != userId && undefined != userId && "" != userId) {
      msgBody["userId"] = userId;
    }

    console.log("storeBaseRegistration() msgBody", JSON.stringify(msgBody));

    this.remoteSvrc.postHttpNoAuth(url_p, msgBody).subscribe(
      (data) => {
        self.loadingCtrl.dismiss();

        if (undefined != data && null != data && "200" === data["httpStatus"]) {
          self.regData = data;

          let uliBody: IUserLogin = new UserLogin();
          uliBody.userId = data["userId"];
          uliBody.regOtp = data["regOtp"];
          AuthenticationService.setUserLogin(uliBody);
          console.log("storeBaseRegistration() uliBody: " + uliBody);

          // registration was successful, user needs to confirm email/mobile number
          AuthenticationService.authState.next("regconfirm");

          self.showAlert(
            titleSuccess,
            msgBody.username +
              " is now registered. Please check and confirm registration code sent to you."
          );
        } else {
          if (undefined !== data["errors"] && null !== data["errors"]) {
            this.showAlert(
              "Registration Failed errors",
              JSON.stringify(data["errors"])
            );
          } else {
            this.showAlert(
              "Registration Failed message",
              JSON.stringify(data["message"])
            );
          }
        }
      },
      (err) => {
        this.loadingCtrl.dismiss();
        this.showAlert("Registration Failed", JSON.stringify(err["errors"]));
      }
    );
  }

  async showAlert(title, text): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: title,
      message: text,
      buttons: ["OK"],
    });

    await alert.present();
  }

  setFormData() {
    console.log(
      "RegisterPage::setFormData() this.regData",
      JSON.stringify(this.regData)
    );
    if (this.regData) {
      this.selectedCurrency = this.regData.selectedCurrency;
      this.selectedCurrencyCode = this.regData.selectedCurrencyCode;
      this.selectedCountry = this.regData.selectedCountry;
      this.countryCode = this.regData.countryCode;

      let uga = this.regData.userGroupArray;
      if (uga.includes("DACLIENT")) {
        this.DACLIENT = true;
      }
      if (uga.includes("DASERVICEPROVIDER")) {
        this.DASERVICEPROVIDER = true;
      }

      this.matching_passwords_group.patchValue({
        password: this.regData.newPassword,
        confirm_password: this.regData.newPasswordVerify,
      });
      this.userForm.patchValue({
        username: this.regData.username,
        matching_passwords: this.matching_passwords_group,
        email: this.regData.emailAddress,
        cphone: this.regData.cphone,
      });
    }

    this.currency = {
      description: this.selectedCurrency,
      uomId: this.selectedCurrencyCode,
    };

    this.country = {
      geoName: this.selectedCountry,
      geoId: this.countryCode,
    };

    if (undefined != this.appLocale) {
      // we already have the codes, do nothing
    } else {
      this.getCountryCurrencyList(this.countryCode);
    }

    if (undefined != this.appLocale) {
      this.userForm.patchValue({
        selectedCurrencyCode: this.selectedCurrencyCode,
        countryCode: this.countryCode,
      });
    } else {
      this.userForm.patchValue({
        selectedCurrencyCode: this.currency,
        countryCode: this.country,
      });
    }
  }

  async showTermsModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: TermsOfServicePage,
    });
    return await modal.present();
  }

  async showPrivacyModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
    });
    return await modal.present();
  }

  regData: any = null;

  loadRegistrationData(userForm) {
    let self = this;
    let value = userForm["value"];
    let filename_p = value.filename;
    console.log("loadRegistrationData() filename_p", filename_p);

    // let filename = 'assets/testdata/dcubeappc1_registration.json';
    let filename = "assets/testdata/stephen_registration.json";
    if (Utils.stringNotEmpty(filename_p)) {
      filename = filename_p;
    }
    console.log("RegisterPage::loadRegistrationData() filename: " + filename);

    this.testingSvrc.loadRegistrationData(filename).then(
      (data) => {
        self.regData = data;
        self.setFormData();
        let userId = data["userId"];
        if (this.testing && Utils.stringNotEmpty(userId)) {
          this.userForm.patchValue({
            userId: userId,
          });
        }
      },
      (err) => {
        this.toast.presentFailedToast(
          "RegisterPage::loadRegistrationData() err: " + JSON.stringify(err)
        );
      }
    );
  }
}
