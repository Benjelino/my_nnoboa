import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage";

import { Observable } from "RxJS/Rx";

//import * as Models from "src/app/chat/services/chat-model.service";
import * as CModels from "src/app/base-services/common-service/models/common-model.service";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";

import { ToastComponent } from "src/app/components/toastComponent";
import { IPartyContactProfile } from "src/app/base-services/common-service/models/common-model.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";

export interface IFullname {
  fname;
  mname;
  lname;
}

export interface IUserAccount {
  userId;
  username;
  newPassword;
  newPasswordVerify;
  emailAddress;
  userFullName;
  fullname: IFullname;
  currencyUomId;
  locale;
  timeZone;
}

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private partyContactProfile: IPartyContactProfile = null;

  private userProfileTrust: any = null;
  private enumData: any = {};

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private storage: Storage,
    private toast: ToastComponent
  ) {}

  changePassword(msgBody, apiKey: string) {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_AUTH_REST + "changePassword";

    return new Promise((resolve, reject) => {
      this.remoteSvrc.postHttpApikey(url_p, msgBody, {}, apiKey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "ProfileService::changePassword() err: " + JSON.stringify(err)
          );
          reject(err["_body"]);
        }
      );
    });
  }

  public resetPasswordMoqui(msgBody) {
    let url_p = AppConstants.URL_MOQUI_AUTH_REST + "resetPassword";
    let self = this;

    return new Promise((resolve, reject) => {
      this.remoteSvrc.postHttpNoAuth(url_p, msgBody).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "ProfileService::resetPasswordMoqui() err: " + JSON.stringify(err)
          );
          reject(err["_body"]);
        }
      );
    });
  }

  storePartyContactProfile(
    partyContactProfile_p: IPartyContactProfile,
    formData: FormData
  ) {
    let self = this;
    let credentials = {};

    // save a copy, we dont want to mess with the original
    let partyContactProfile: IPartyContactProfile = JSON.parse(
      JSON.stringify(partyContactProfile_p)
    );

    return new Promise((resolve, reject) => {
      const url = `${AppConstants.URL_MOQUI_PROFILE_REST}storePartyContactProfile`;

      formData.append("userId", partyContactProfile_p.userId);
      formData.append("isContactSame", partyContactProfile_p.isContactSame);
      formData.append(
        "userAccount",
        JSON.stringify(partyContactProfile_p.userAccount)
      );
      formData.append(
        "userProfile",
        JSON.stringify(partyContactProfile_p.userProfile)
      );
      formData.append(
        "contactInfo",
        JSON.stringify(partyContactProfile_p.contactInfo)
      );
      formData.append("party", JSON.stringify(partyContactProfile_p.party));
      formData.append(
        "emailAddress",
        JSON.stringify(partyContactProfile_p.emailAddress)
      );
      formData.append(
        "phoneNumber",
        JSON.stringify(partyContactProfile_p.phoneNumber)
      );
      formData.append(
        "postalAddress",
        JSON.stringify(partyContactProfile_p.postalAddress)
      );
      formData.append(
        "paymentInfo",
        JSON.stringify(partyContactProfile_p.paymentInfo)
      );

      this.remoteSvrc
        .postHttpApikeyFormData(
          url,
          formData,
          credentials,
          this.auth.getUserLogin().apikey
        )
        .subscribe((data: any) => {
          if (data.httpStatus == "200") {
            formData.delete("userId");
            formData.delete("isContactSame");
            formData.delete("userAccount");
            formData.delete("userProfile");
            formData.delete("contactInfo");
            formData.delete("party");
            formData.delete("emailAddress");
            formData.delete("phoneNumber");
            formData.delete("postalAddress");
            formData.delete("paymentInfo");

            resolve(data);
          } else {
            reject({ errors: data["errors"] });
          }
        });
    });
  }

  async getPartyContactProfileAsync() {
    let url_p = AppConstants.URL_MOQUI_PROFILE_REST + "getPartyContactProfile";
    let userId = this.auth.getUserLogin().userId;

    let msgBody: any = {
      userId: userId,
    };

    let credentials = {};

    return await this.remoteSvrc.postHttpApikeyAsync(
      url_p,
      msgBody,
      credentials,
      this.auth.getUserLogin().apikey
    );
  }

  getPartyContactProfile() {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_PROFILE_REST + "getPartyContactProfile";

    return new Promise((resolve, reject) => {
      let userId = this.auth.getUserLogin().userId;

      let msgBody: any = {
        userId: userId,
      };

      let credentials = {};

      this.remoteSvrc
        .postHttpApikey(
          url_p,
          msgBody,
          credentials,
          this.auth.getUserLogin().apikey
        )
        .subscribe(
          (data) => {
            if (
              undefined != data &&
              null != data &&
              "200" === data["httpStatus"]
            ) {
              self.partyContactProfile = <IPartyContactProfile>data;
              resolve(self.partyContactProfile);
            } else {
              if (undefined !== data["errors"] && null !== data["errors"]) {
                reject({ errors: data["errors"] });
              } else {
                reject({ errors: data["message"] });
              }
            }
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getUserProfileTrust() {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_PROFILE_REST + "getPartyContactProfile";
    if (
      undefined != this.partyContactProfile &&
      null != this.partyContactProfile
    ) {
      return this.partyContactProfile;
    }

    let msgBody: any = {
      userId: this.auth.getUserLogin().userId,
    };

    return new Promise((resolve, reject) => {
      if (null !== this.userProfileTrust) {
        resolve(this.userProfileTrust);
      }

      this.remoteSvrc
        .postHttpApikey(url_p, msgBody, {}, this.auth.getUserLogin().apikey)
        .subscribe(
          (data) => {
            if (undefined != data && null != data) {
              if ("200" === data["httpStatus"]) {
                self.partyContactProfile = <IPartyContactProfile>data;
                resolve(self.partyContactProfile);
              }
            }
            reject({ errmsg: data["message"] });
          },
          (err) => {
            this.toast.presentFailedToast(
              "ProfileService::getUserProfileTrust() err: " +
                JSON.stringify(err)
            );
            reject(err);
          }
        );
    });
  }

  getUserEnumData() {
    let self = this;
    return new Promise((resolve, reject) => {
      if (null !== self.enumData) {
        resolve(self.enumData);
      }

      const url = `${AppConstants.URL_MOQUI_DUTILS_REST}getEnumData`;
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

  getUserEnumDataNoAuth() {
    let self = this;
    return new Promise((resolve, reject) => {
      if (null !== self.enumData) {
        resolve(self.enumData);
      }

      let msgBody = {};
      const url = `${AppConstants.URL_MOQUI_DUTILS_REST_NOAUTH}getEnumData`;
      this.remoteSvrc.postHttpNoAuth(url, msgBody).subscribe((data: any) => {
        if (undefined != data && null != data && "200" === data["httpStatus"]) {
          self.enumData = data;
          resolve(self.enumData);
        } else {
          if (undefined !== data["errors"] && null !== data["errors"]) {
            reject({ errors: data["errors"] });
          } else {
            reject({ errors: data["message"] });
          }
        }
      });
    });
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

  currentUser: IUserAccount;

  getCurrentUserFromStorage() {
    this.storage.get(AppConstants.CURRENT_USER).then((value) => {
      this.currentUser = value ? value : {};
    });
  }

  saveUserPref(
    theme: string,
    audioEnabled: string,
    browserNotificationsEnable: string,
    presence: string,
    statusMsg: string,
    credentials: {},
    apikey: string
  ): Observable<CModels.UserPrefResponse> {
    const url = AppConstants.URL_MOQUI_PROFILE_REST + "createUserPreference";

    const msgBody = {
      theme,
      audioEnabled,
      browserNotificationsEnable,
      presence,
      statusMsg,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  updateUserPref(
    theme: string,
    audioEnabled: string,
    browserNotificationsEnable: string,
    presence: string,
    statusMsg: string,
    credentials: {},
    apikey: string
  ): Observable<CModels.UserPrefResponse> {
    const url = AppConstants.URL_MOQUI_PROFILE_REST + "updateUserPreference";

    const msgBody = {
      theme,
      audioEnabled,
      browserNotificationsEnable,
      presence,
      statusMsg,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  storeUserPref(
    theme: string,
    audioEnabled: string,
    browserNotificationsEnable: string,
    presence: string,
    statusMsg: string,
    credentials: {},
    apikey: string
  ): Observable<CModels.UserPrefResponse> {
    const url = AppConstants.URL_MOQUI_PROFILE_REST + "storeUserPreference";

    const msgBody = {
      theme,
      audioEnabled,
      browserNotificationsEnable,
      presence,
      statusMsg,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getUserStatusList(credentials: {}, apikey: string): Observable<any> {
    const url = AppConstants.URL_MOQUI_DUTILS_REST + "getUserStatusList";

    const msgBody = {};

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }
}
