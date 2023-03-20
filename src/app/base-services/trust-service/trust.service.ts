import { Injectable } from "@angular/core";

import {
  TrustModel,
  ITrustModel,
  Identification,
  Communication,
  Payment,
  Recommendation,
  SocialNetwork,
  PaymentSetUp,
} from "./trust-model.service";
import {
  URL_MOQUI_AUTH_REST,
  URL_MOQUI_PAY_REST,
} from "../common-service/app-constants/app-constants.service";
import {
  RemoteServiceModule,
  RemoteService,
} from "../remote-service/remote-service.module";

import { Utils } from "../utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
import { ProfileService } from "src/app/profile/services/profile.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

@Injectable({
  providedIn: "root",
})
export class TrustService {
  private trustModel: TrustModel = new TrustModel();
  private identityInfo: Identification[];
  private commInfo: Communication;
  private pymtInfo: Payment[];
  private recommendInfo: Recommendation[];
  private socnetInfo: SocialNetwork[];

  constructor(
    private remoteSvrc: RemoteService,
    private auth: AuthenticationService,
    private psprof: ProfileService,
    private toast: ToastComponent
  ) {
    let self = this;
    if (this.auth.isAuthenticated()) {
      this.getTrustModel();
    }
  }

  /**this comes from back end.
   * if party already exist populate its data, if not use the default
   */
  createTrustModel() {
    this.trustModel = new TrustModel();
    this.getTrustData();
  }

  setIdentityInfo(idInfo: Identification[]) {
    this.trustModel.identityInfo = idInfo;
  }

  setCommunicationInfo(commInfo: Communication) {
    this.trustModel.commInfo = {
      emailAddress: commInfo.emailAddress,
      phoneNumber: commInfo.phoneNumber,
      postalAddress: commInfo.postalAddress,
    };
  }

  creditCustomer(msgBody) {
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

  saveTrustModel() {
    const url = `${URL_MOQUI_AUTH_REST}storeTrustData`;
    this.trustModel.partyId = this.auth.getUserLogin().userId;
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    this.remoteSvrc
      .postHttpApikey(url, this.trustModel, credentials, apikey)
      .subscribe(
        (data) => {},
        (err) => {
          this.toast.presentFailedToast(
            "TrustService::sendMessage() Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  getTrustModel() {
    let self = this;
    let url = `${URL_MOQUI_AUTH_REST}getTrustData`;

    let msgBody: any = {
      partyId: this.auth.getUserLogin().userId,
    };

    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      if (this.trustModel) {
        resolve(this.trustModel);
        return;
      }

      this.remoteSvrc
        .getHttpApikey(url, credentials, apikey, null, msgBody)
        .subscribe(
          (data) => {
            if ("200" === data["httpStatus"]) {
              self.trustModel = <ITrustModel>data;
              resolve(self.trustModel);
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

  getUserProfile() {
    const url = URL_MOQUI_AUTH_REST + "getUserProfile";
    let msgBody = { userId: this.auth.getUserLogin().userId };

    const apikey = this.auth.getUserLogin().apikey;
    let credentials = {};

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .getHttpApikey(url, credentials, apikey, null, msgBody)
        .subscribe(
          (data) => {
            resolve(data);
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

  getTrustData() {
    let self = this;
    const url = URL_MOQUI_AUTH_REST + "getTrustData";
    let msgBody = { partyId: this.auth.getUserLogin().userId };
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    this.remoteSvrc
      .getHttpApikey(url, credentials, apikey, null, msgBody)
      .subscribe(
        (data) => {
          self.trustModel.partyId = data.userId;
          self.trustModel.commInfo = data.CommunicationValues;
          self.trustModel.identityInfo = data.IdentificationValues;
          self.trustModel.pymtInfo = data.PaymentValues;
          self.trustModel.recommendInfo = data.Recommendations;
          self.trustModel.socnetInfo = data.SocialNetworkings;
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  reloadTrustData() {
    const url = URL_MOQUI_AUTH_REST + "getTrustData";
    let msgBody = { partyId: this.auth.getUserLogin().userId };
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    this.remoteSvrc
      .getHttpApikey(url, credentials, apikey, null, msgBody)
      .subscribe(
        (data) => {
          if (data.httpStatus === "200") {
            this.trustModel = <ITrustModel>data;
          }
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  deleteContactOne(msgBody: any) {
    const url = `${URL_MOQUI_AUTH_REST}deleteContactOne`;
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

  deleteIdOne(msgBody: any) {
    const url = `${URL_MOQUI_AUTH_REST}deleteIdentificationOne`;
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

  setTrustModel(trustModel: TrustModel) {
    this.trustModel = trustModel;
  }

  getIdentification() {
    let self = this;
    let url = `${URL_MOQUI_AUTH_REST}getIdentification`;

    let msgBody: any = {
      partyId: this.auth.getUserLogin().userId,
    };
    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      if (this.identityInfo) {
        resolve(this.identityInfo);
        return;
      }

      this.remoteSvrc
        .getHttpApikey(url, credentials, apikey, null, msgBody)
        .subscribe(
          (data) => {
            if ("200" === data["httpStatus"]) {
              self.identityInfo = data.identityInfo;
              resolve(self.identityInfo);
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

  getCommunication() {
    let self = this;
    let url = `${URL_MOQUI_AUTH_REST}getCommunication`;

    let msgBody: any = {
      partyId: this.auth.getUserLogin().userId,
    };

    const apikey = this.auth.getUserLogin().apikey;
    const credentials = {};

    return new Promise((resolve, reject) => {
      if (this.commInfo) {
        resolve(this.commInfo);
        return;
      }

      this.remoteSvrc
        .getHttpApikey(url, credentials, apikey, null, msgBody)
        .subscribe(
          (data) => {
            if ("200" === data["httpStatus"]) {
              self.commInfo = data.commInfo;
              resolve(self.commInfo);
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

  PaymentMethods;
  PaymentPlatforms;
  PaymentTrustTypeEnumerations;
  PaymentAccounts;
  PreferredPaymentAccounts;

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

  saveIdentification(idInfo: Identification[]) {
    const url = `${URL_MOQUI_AUTH_REST}storeIdentification`;
    const msgBody = {
      identityInfo: idInfo,
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

  reloadIdData() {
    const url = URL_MOQUI_AUTH_REST + "getIdentification";
    let msgBody = { partyId: this.auth.getUserLogin().userId };
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

  saveCommunication(comInfo: Communication) {
    const url = `${URL_MOQUI_AUTH_REST}storeCommunication`;
    const msgBody = {
      commInfo: comInfo,
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

  reloadComData() {
    const url = URL_MOQUI_AUTH_REST + "getCommunication";
    let msgBody = { partyId: this.auth.getUserLogin().userId };
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

  reloadPayData() {
    const url = URL_MOQUI_AUTH_REST + "getPayment";
    let msgBody = { partyId: this.auth.getUserLogin().userId };
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
}
