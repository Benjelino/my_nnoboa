import { Injectable } from '@angular/core';

import { Observable } from "rxjs";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import { RemoteService } from "../../../base-services/remote-service/remote.service";


@Injectable({
  providedIn: 'root'
})
export class EcfundenumdataService {

  constructor(private remoteSvrc: RemoteService) {}


  getEcFundEnumData(appid: string, credentials: {}, apikey: string): Observable<any> {
    const url = AppConstants.URL_MOQUI_ECFUND_REST_NO_AUTH + "getEcFundEnumData";
    const header = this.remoteSvrc.getRequestOptionsArgs(credentials, apikey);

    const httpOptions = {
      headers: header,
    };

    const msgBody = {
      appId: appid,
    };

    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }
}
