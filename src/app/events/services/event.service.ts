import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import { Event } from "src/app/media/services/media-model.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";

@Injectable({
  providedIn: "root",
})
export class EventService {
  constructor(private remoteSvrc: RemoteService) {}

  storeEvent(event: Event, credentials: {}, apikey: string): Observable<any> {
    let url = "";
    const httpOptions = {};

    url = AppConstants.URL_MOQUI_EVENT_REST + "storeEvent";

    const postData = {
      userId: event.userId,
      locationName: event.locationName,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      mediumId: event.mediumId,
      locationGPS: event.locationGPS,
    };

    return this.remoteSvrc.postHttpApikey(url, postData, credentials, apikey);
  }

  getEvents(credentials: {}, apikey: string): Observable<any> {
    const url = AppConstants.URL_MOQUI_EVENT_REST + "getEvent";
    return this.remoteSvrc.postHttpApikey(url, {}, credentials, apikey);
  }

  getEvent(eventId: string, credentials: {}, apikey: string): Observable<any> {
    const url = AppConstants.URL_MOQUI_EVENT_REST + "getEvent";

    const msgBody = {
      eventId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getEventsByMediumId(
    mediumId: string,
    credentials: {},
    apikey: string,
    appId: string
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_EVENT_REST + "getEventsByMediumId";

    const msgBody = {
      mediumId,
      appId: appId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }
}
