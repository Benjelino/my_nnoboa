import { Injectable } from "@angular/core";


import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import {
  IPartyContactProfile,
} from "../common-service/models/common-model.service";
import { RemoteService } from "../remote-service/remote-service.module";

import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";


export interface IDebugData {
  appId: string;
  userId?: string;
  dataId?: string;
  data: string;
  data2?: string;
  data3?: string;
  debugDate?: Date;
}


@Injectable({
  providedIn: "root",
})
export class TestingService {
  private partyContactProfile: IPartyContactProfile = null;

  // set testing globally
  static testing: boolean = false;
  

  constructor(
    private remoteSvrc: RemoteService,
    private auth: AuthenticationService,
    private toast: ToastComponent
  ) { }

  
  loadRegistrationData(filename: string) {
    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .getHttpApikey(filename)
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            this.toast.presentFailedToast(
              "TestingService::loadRegistrationData() err: " +
              JSON.stringify(err)
            );
            reject(err);
          }
        );
    });
  }

  loadPartyContactProfileData() {
    let self = this;

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .getHttpApikey("assets/testdata/stephen_profile.json")
        .subscribe(
          (data) => {
            self.partyContactProfile = <IPartyContactProfile>data;
            resolve(self.partyContactProfile);
          },
          (err) => {
            this.toast.presentFailedToast(
              "TestingService::loadPartyContactProfileData() err: " +
              JSON.stringify(err)
            );
            reject(err);
          }
        );
    });
  }

  loadSubscriptionContactData(filename) {
    let self = this;

    return new Promise((resolve, reject) => {
      this.remoteSvrc.getHttpApikey(filename).subscribe(
        (data) => {
          self.partyContactProfile = <IPartyContactProfile>data;
          resolve(self.partyContactProfile);
        },
        (err) => {
          this.toast.presentFailedToast(
            "TestingService::loadSubscriptionContactData() err: " +
            JSON.stringify(err)
          );
          reject(err);
        }
      );
    });
  }

  loadRequestData(filename) {
    return new Promise((resolve, reject) => {
      this.remoteSvrc.getHttpApikey(filename).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "TestingService::loadRegistrationData() err: " +
            JSON.stringify(err)
          );
          reject(err);
        }
      );
    });
  }


  async storeDebuggingDataAsync(msgBody: IDebugData) {
    let url_p = AppConstants.URL_MOQUI_DEBUG_REST + "storeDebuggingData";
    
    let credentials = {};

    return await this.remoteSvrc.postHttpApikeyAsync(
      url_p,
      msgBody,
      credentials,
      this.auth.getUserLogin().apikey
    );
  }

}
