import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import { RemoteService } from "./remote.service";

@Injectable({
  providedIn: "root",
})
export class ContactUsService {
  
  constructor(private remoteSvrc: RemoteService) {}

  saveContactUs(
    appId: string,
    contactType: string,
    email: string,
    phone: string,
    message: string,
    credentials: {},
    apikey: string
  ): Observable<any> {
    let url = "";
    const httpOptions = {};

    url = AppConstants.URL_MOQUI_DUTILS_REST_NOAUTH + "saveContactUs";

    const postData = {
      appId,
      contactType,
      email,
      phone,
      message,
      contactDate: new Date().getTime(),
    };

    return this.remoteSvrc.postHttpApikey(url, postData, credentials, apikey);
  }

  getContactTypes(appid: string, credentials: {}, apikey: string): Observable<any> {
    const url = AppConstants.URL_MOQUI_DUTILS_REST_NOAUTH + "getContactTypes";
    const header = this.remoteSvrc.getRequestOptionsArgs(credentials, apikey);

    const httpOptions = {
      headers: header,
    };

    const msgBody = {
      appId: appid,
    };
    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  getContactItems(appid: string, credentials: {}, apikey: string): Observable<any> {
    const params = {};
    const url = AppConstants.URL_MOQUI_DUTILS_REST + "getContactUsInfo";
    const header = this.remoteSvrc.getRequestOptionsArgs(credentials, apikey);

    const httpOptions = {
      headers: header,
    };

    const msgBody = {
      appId: appid,
    };

    return this.remoteSvrc.postHttpApikey( url, msgBody, credentials, apikey );
  }

}
