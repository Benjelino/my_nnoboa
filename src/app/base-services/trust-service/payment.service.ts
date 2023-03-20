import { Injectable } from "@angular/core";

import {
  URL_MOQUI_AUTH_REST,
  URL_MOQUI_PAY_REST,
} from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";

/* import {
  TrustModel,
  ITrustModel,
  Payment,
  PaymentSetUp,
} from "../../services/trust-service/trust-model.service";
import { Utils } from "../../services/utility-services/utils"; */
import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { RemoteService } from "../remote-service/remote.service";
import { Utils } from "../utility-services/utils";
import { Payment, PaymentSetUp, TrustModel } from "./trust-model.service";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private trustModel: TrustModel = new TrustModel();
  private pymtInfo: Payment[];
  private enumData: any = {};

  currencies: any = null;

  constructor(
    private remoteSvrc: RemoteService,
    private auth: AuthenticationService,
    private toast: ToastComponent
  ) {}

  PaymentMethods;
  PaymentPlatforms;
  PaymentTrustTypeEnumerations;
  PaymentAccounts;
  PreferredPaymentAccounts;

  setPaymentInfo(paymentInfo: Payment[]) {
    this.trustModel.pymtInfo = [];
    paymentInfo.forEach((payment) => {
      this.trustModel.pymtInfo.push({
        trustTypeId: payment.trustTypeId,
        bankName: payment.bankName,
        branch: payment.branch,
        accountNumber: payment.accountNumber,
        accountType: payment.accountType,
        routingNumber: payment.routingNumber,
        accountSecret: payment.accountSecret,
        nameOnAccount: payment.nameOnAccount,
        network: payment.network,
        momoNumber: payment.momoNumber,
        cardNumber: payment.cardNumber,
        cvvNumber: payment.cvvNumber,
      });
    });
  }

  getPaymentInfo(countryCode3?: string) {
    let self = this;
    let url = `${URL_MOQUI_PAY_REST}getPaymentInfo`;

    if (Utils.isStringEmpty(countryCode3)) {
      countryCode3 = "GHA";
    }

    let msgBody: any = {
      countryCode3: countryCode3,
    };

    return new Promise((resolve, reject) => {
      if (this.pymtInfo) {
        resolve(this.pymtInfo);
        return;
      }

      const apikey = this.auth.getUserLogin().apikey;
      const credentials = {};

      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            if ("200" === data["httpStatus"]) {
              self.PaymentPlatforms = data.PaymentPlatforms;
              self.PaymentMethods = data.PaymentMethods;
              self.PaymentTrustTypeEnumerations =
                data.PaymentTrustTypeEnumerations;
              resolve(self.PaymentPlatforms);
            }
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject(err);
          }
        );
    });
  }

  getUserStoredPaymentInfo(customerId: string) {
    let self = this;
    let url = `${URL_MOQUI_PAY_REST}getPartyPaymentAccount`;

    let msgBody: any = {
      customerId: customerId,
    };

    return new Promise((resolve, reject) => {
      const apikey = this.auth.getUserLogin().apikey;
      const credentials = {};

      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            if ("200" === data["httpStatus"]) {
              self.PaymentAccounts = data.PaymentAccounts;

              resolve(self.PaymentAccounts);
            }
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject(err);
          }
        );
    });
  }

  setUserPreferredPayment(msgBody) {
    const url = `${URL_MOQUI_PAY_REST}setPreferredPaymentMethod`;
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject({ errors: err });
          }
        );
    });
  }

  getPreferredUserStoredPaymentInfo(customerId: string) {
    let self = this;
    let url = `${URL_MOQUI_PAY_REST}getPartyPaymentAccount`;

    let msgBody: any = {
      customerId: customerId,
    };

    return new Promise((resolve, reject) => {
      const apikey = this.auth.getUserLogin().apikey;
      const credentials = {};

      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            if ("200" === data["httpStatus"]) {
              self.PreferredPaymentAccounts = data.Preferred;

              resolve(self.PreferredPaymentAccounts);
            }
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject(err);
          }
        );
    });
  }

  savePayment(payInfo: Payment[]) {
    const url = `${URL_MOQUI_AUTH_REST}storePayment`;
    const msgBody = {
      pymtInfo: payInfo,
      partyId: this.auth.getUserLogin().userId,
    };
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey).subscribe(
      (data) => {},
      (err) => {
        this.toast.presentFailedToast(
          "TrustService::sendMessage() Server Error | " + JSON.stringify(err)
        );
      }
    );
  }

  savePaymentSetUp(payInfo: PaymentSetUp) {
    const url = `${URL_MOQUI_PAY_REST}storePartyPaymentAccount`;
    const msgBody = {
      pymtPlatformId: payInfo.pymtPlatformId,
      ownerPartyId: this.auth.getUserLogin().userId,
      currencyUomId: payInfo.currencyUomId,
      description: payInfo.description,
      trustTypeId: payInfo.trustTypeId,
      cphone: payInfo.cphone,
      netwrok: payInfo.network,
      paymentMethodId: payInfo.paymentMethodId,
      trustPointsId: payInfo.trustPointsId,
    };

    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};
    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            this.toast.presentFailedToast(
              "TrustService::sendMessage() Server Error | " +
                JSON.stringify(err)
            );
            reject(err);
          }
        );
    });
  }

  savePaymentSetUp_Other(msgBody) {
    const url = `${URL_MOQUI_PAY_REST}storePartyPaymentAccount`;
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            if ("200" === data["httpStatus"]) {
              resolve(data);
            }
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject({ errors: err });
          }
        );
    });
  }

  creditCustomer(msgBody) {
    const url = `${URL_MOQUI_PAY_REST}creditCustomer`;
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject({ errors: err });
          }
        );
    });
  }

  debitCustomer(msgBody) {
    const url = `${URL_MOQUI_PAY_REST}debitCustomer`;
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject({ errors: err });
          }
        );
    });
  }

  transferFunds(msgBody) {
    const url = `${URL_MOQUI_PAY_REST}transferFunds`;
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .postHttpApikey(url, msgBody, credentials, apikey)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            this.toast.presentFailedToast(
              "Server Error | " + JSON.stringify(err)
            );
            reject({ errors: err });
          }
        );
    });
  }

  deletePaymentOne(msgBody: any) {
    const url = `${URL_MOQUI_AUTH_REST}deletePaymentOne`;
    msgBody.partyId = this.auth.getUserLogin().userId;
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    this.remoteSvrc
      .deleteHttpApikey(url, credentials, apikey, null, msgBody)
      .subscribe(
        (data) => {},
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  deleteStoredPayment(payMethodId: string, customerId: string) {
    const url = `${URL_MOQUI_PAY_REST}deletePartyPaymentAccount`;

    const msgBody: any = {
      paymentMethodId: payMethodId,
      customerId: customerId,
    };
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey).subscribe(
      (data) => {},
      (err) => {
        this.toast.presentFailedToast("Server Error | " + JSON.stringify(err));
      }
    );
  }

  getEnumDataPayment() {
    let self = this;
    return new Promise((resolve, reject) => {
      const url = `${AppConstants.URL_MOQUI_DUTILS_REST}getEnumDataPayment`;
      this.remoteSvrc
        .postHttpApikey(
          url,
          { countryCode: self.auth.getUserLogin().countryCode },
          {},
          self.auth.getUserLogin().apikey
        )
        .subscribe((res: any) => {
          self.enumData = res;

          resolve(self.enumData);
        });
    });
  }

  getCurrencyList() {
    let self = this;
    return new Promise((resolve, reject) => {
      if (null !== self.currencies) {
        resolve(self.currencies);
      }

      const url_p = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCountryCurrencyList`;

      this.remoteSvrc.getHttpApikey(url_p, {}, null).subscribe((data: any) => {
        if (data.httpStatus === "200") {
          self.currencies = data.CurrencyCodes;

          resolve(self.currencies);
        }
      });
    });
  }
}
