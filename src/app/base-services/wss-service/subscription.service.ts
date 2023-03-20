import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { RemoteService } from "../remote-service/remote.service";
import * as AppConstants from "../common-service/app-constants/app-constants.service";
import * as Models from "../common-service/models/common-model.service";

@Injectable({
  providedIn: "root",
})
export class SubscriptionService {
  constructor(private remoteSvrc: RemoteService) {}

  subscribeToTopic(
    topic: string,
    userId: string,
    appId: string,
    description: string,
    credentials: {},
    apikey: string
  ): Observable<any> {
    let url = AppConstants.URL_MOQUI_SCOM_REST + "subscribeToTopic";

    const msgBody = {
      topic,
      userId,
      appId,
      description,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  unsubscribeFromTopic(
    topic: string,
    userId: string,
    appId: string,
    credentials: {},
    apikey: string
  ): Observable<any> {
    let url = AppConstants.URL_MOQUI_SCOM_REST + "unsubscribeFromTopic";

    const msgBody = {
      topic,
      userId,
      appId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getSubscribeFromTopic(
    credentials: {},
    apikey: string
  ): Observable<Models.SubscribedTopics> {
    let url = AppConstants.URL_MOQUI_DUTILS_REST + "getUserSubscribedTopics";

    return this.remoteSvrc.getHttpApikey(url, credentials, apikey);
  }

}
