import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import {
  ClientHousingPref,
  ClientHousingPrefList,
} from "./tourism-models.service";
@Injectable({
  providedIn: "root",
})
export class TourismService {
  constructor() {}

  saveHousing(
    formData: FormData,
    apiKey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_HOUSING + "storeHousing";
    return remoteSvrc.postHttpApikeyFormData(url, formData, null, apiKey);
  }

  saveClientHousingPreferences(
    data: ClientHousingPref,
    apiKey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_PROPERTY + "createPropertyQuery";
    let msgBody: any = {
      pqueryId: data.pqueryId,
      appId: data.appId,
      userId: data.userId,
      rentalType: data.rentalType,
      leaseType: data.leaseType,
      propertyType: data.propertyType,
      serviceLocReq: data.serviceLocReq,
      propertyStatusType: data.propertyStatusType,
      periodOfLease: data.periodOfLease,

      currencyUomId: data.currencyUomId,

      amountTo: data.amountTo,
      amountFrom: data.amountFrom,
      noOfRooms: data.noOfRooms,

      createDate: data.createDate,
      endDate: data.endDate,
      startDate: data.startDate,
      flexibilityType: data.flexibilityType,
      statusId: data.statusId,

      countryGeoId: data.countryGeoId,
      stateProvinceGeoId: data.stateProvinceGeoId,
      countyGeoId: data.countyGeoId,
      cityGeoId: data.cityGeoId,
      suburbId: data.suburbId,
      postalCode: data.postalCode,
      furnished: data.furnished,
    };

    return remoteSvrc.postHttpApikey(url, msgBody, null, apiKey);
  }
  //postHttpApikey

  getClientHousingPrefs(
    appId: string,
    userId: string,
    remoteSvrc: RemoteService,
    apikey: string
  ): Observable<ClientHousingPrefList> {
    const url = AppConstants.URL_MOQUI_PROPERTY + "getPropertyQuery";
    const msgBody = {
      userId: userId,
      appId: appId,
    };
    return remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  getHousingEnumData(remoteSvrc: RemoteService): Observable<any> {
    const url = AppConstants.URL_MOQUI_HOUSING_NO_AUTH + "getEnumDataHousing";
    const msgBody = {};
    return remoteSvrc.getHttpApikey(url, null, null, null);
  }

  getHousingByProvider(
    appId: string,
    userId: string,
    offset: string,
    limit: string,
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_HOUSING + "getHousingByProvider";

    const msgBody = {
      offset: offset,
      limit: limit,
      userId: userId,
      appId: appId,
    };

    // return remoteSvrc.getHttpApikey(url, apikey, null, msgBody);
    return remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  getHousingByLocation(
    paramerters: any,
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_HOUSING_NO_AUTH + "getHousingByLocation";

    const msgBody = paramerters;

    return remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  setPropertyStatus(
    appId: string,
    requestId: string,
    pqueryId: string,
    requestStatus: string,
    propertyStatus: string,
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url_p = AppConstants.URL_LIVE_MOQUI_PROPERTY_SR + "setPropertyStatus";

    const msgBody = {
      appId: appId,
      requestId: requestId,
      pqueryId: pqueryId,
      requestStatus: requestStatus,
      propertyStatus: propertyStatus,
    };
    return remoteSvrc.postHttpApikey(url_p, msgBody, {}, apikey);
  }
}
