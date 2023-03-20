import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { RemoteService } from "./remote.service";

@Injectable({
  providedIn: "root",
})
export class EsearchService {
  constructor(
    private remoteSvrc: RemoteService,
    private toast: ToastComponent
  ) {}

  searchSimpleQueryString(
    remoteSvrc: RemoteService,
    msgBody: any,
    apikey: string
  ) {
    let self = this;
    let credentials = {};
    let url_p =
      AppConstants.URL_MOQUI_ES_CMS_NOAUTH + "searchSimpleQueryString";

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "EsearchService::searchSimpleQueryString() err: " +
              JSON.stringify(err)
          );
          reject(err);
        }
      );
    });
  }

  getSearch(
    qstr: string,
    mtype: string,
    credentials: {},
    apikey: string
  ): Observable<any> {
    let url = AppConstants.URL_MOQUI_ES_CMS + "searchSimpleQueryString";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_ES_CMS_NOAUTH + "searchSimpleQueryString";
    }

    const msgBody = {
      mtype,
      qstr,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getSearchPage(
    qstr: string,
    mtype: string,
    credentials: {},
    apikey: string,
    offset: string,
    limit: string
  ): Observable<any> {
    let url = AppConstants.URL_MOQUI_ES_CMS + "searchSimpleQueryString";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_ES_CMS_NOAUTH + "searchSimpleQueryString";
    }

    const msgBody = {
      mtype,
      qstr,
      from: offset,
      size: limit,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getTourSearchPage(
    qstr: string,
    ttype: string,
    credentials: {},
    apikey: string,
    offset: string,
    limit: string
  ): Observable<any> {
    let url = AppConstants.URL_MOQUI_ES_TOUR + "searchSimpleQueryString";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_ES_TOUR_NOAUTH + "searchSimpleQueryString";
    }

    const msgBody = {
      ttype,
      qstr,
      from: offset,
      size: limit,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getTourSearchPageRegion(
    qstr: string,
    tourismType: string,
    region: string,
    credentials: {},
    apikey: string,
    offset: string,
    limit: string
  ): Observable<any> {
    let url = AppConstants.URL_MOQUI_TOUR_NO_AUTH + "getTourismByTypeRegion";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_TOUR_NO_AUTH + "getTourismByTypeRegion";
    }

    const msgBody = {
      qstr,
      tourismType,
      region,
      offset,
      limit,
    };
    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
    //return this.remoteSvrc.getHttpApikey(url, msgBody, credentials, apikey);
  }
}
