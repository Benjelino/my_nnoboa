import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { IonicSelectableComponent } from "ionic-selectable";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import {
  IAppLocale,
  IPartyContactProfile,
} from "src/app/base-services/common-service/models/common-model.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ProfileService } from "src/app/profile/services/profile.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { GeoService } from "../services/geo.service";

const DEFAULT_COUNTRY_CODE = "GHA";

const DEFAULT_CURRENCY = "Ghanaian cedi";
const DEFAULT_CURRENCY_CODE = "GHS";

@Component({
  selector: "app-currency",
  templateUrl: "./currency.component.html",
  styleUrls: ["./currency.component.scss"],
})
export class CurrencyComponent implements OnInit {
  @Output()
  private formReady: EventEmitter<UntypedFormGroup> = new EventEmitter<UntypedFormGroup>();
  rForm: UntypedFormGroup = new UntypedFormGroup({});

  appLocale: IAppLocale = AuthenticationService.env.appLocale;

  selectedCurrency: string = DEFAULT_CURRENCY;
  selectedCurrencyCode: string = DEFAULT_CURRENCY_CODE;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastCtrl: ToastComponent,
    private psprof: ProfileService,
    private geoSvrc: GeoService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.formReady.emit(this.rForm);

    if (Utils.isStringEmpty(this.appLocale)) {
      this.selectedCurrency = DEFAULT_CURRENCY;
      this.selectedCurrencyCode = DEFAULT_CURRENCY_CODE;
    } else {
      if (Utils.isStringEmpty(this.appLocale.appCurrencyCode)) {
        this.selectedCurrency = DEFAULT_CURRENCY;
        this.selectedCurrencyCode = DEFAULT_CURRENCY_CODE;
      } else {
        this.selectedCurrency = this.appLocale.appCurrency;
        this.selectedCurrencyCode = this.appLocale.appCurrencyCode;
      }
    }

    this.getCountryCurrencyList();
  }

  buildForm() {
    this.rForm = this.formBuilder.group({
      currencyCode: "",
    });
  }
  /* 
  ionChangeCurrency(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.selectedCurrencyCode = event.value.uomId;
    this.selectedCurrency = event.value.description;
  } */

  getCountryCurrencyList() {
    let self = this;

    this.geoSvrc.getCountryCurrencyList().then(
      (data) => {
        if (data["httpStatus"] === "200") {
          self.currencies = data["CurrencyCodes"];
        }
      },
      (err) => {
        this.toastCtrl.presentFailedToast(
          "ProfileFormPage::getCountryCurrencyList() err: " +
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

  setFormData() {
    this.currency = {
      description: this.selectedCurrency,
      uomId: this.selectedCurrencyCode,
    };

    if (Utils.isStringEmpty(this.appLocale)) {
      this.getCountryCurrencyList();

      this.rForm.patchValue({
        selectedCurrencyCode: this.currency,
      });
    } else {
      if (Utils.isStringEmpty(this.appLocale.appCurrencyCode)) {
        this.getCountryCurrencyList();
      }

      if (Utils.isStringEmpty(this.appLocale.appCurrencyCode)) {
        this.rForm.patchValue({
          selectedCurrencyCode: this.currency,
        });
      } else {
        this.rForm.patchValue({
          selectedCurrencyCode: this.selectedCurrencyCode,
        });
      }
    }
  }
}
