import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  City,
  GeoData,
  GeoResults,
  TourismData,
  TourismTypeEnumerations,
} from "src/app/base-services/common-service/models/common-model.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
@Injectable({
  providedIn: "root",
})
export class GeoService {
  countries: any = null;
  currencies: any = null;

  Cities = null;
  StateProvinceRegion = null;

  constructor(
    private remoteSvrc: RemoteService,
    private auth: AuthenticationService
  ) {}

  getLocationGeoDetails(
    locationname: string,
    remoteSvrc: RemoteService
  ): Observable<GeoResults> {
    let url = "https://api.opencagedata.com/geocode/v1/json";
    let api_key = "6b76451f0ab14efb938dd929f7171b94";

    let request_url =
      url +
      "?" +
      "key=" +
      api_key +
      "&q=" +
      encodeURIComponent(locationname) +
      "&pretty=1" +
      "&no_annotations=1";

    // const headers = new HttpHeaders().set("Content-Type", "application/json");
    const msgBody = {
      key: "6b76451f0ab14efb938dd929f7171b94",
      q: locationname,
    };
    return remoteSvrc.getHttpApikey(request_url, msgBody, null, null);
  }

  storeTourism(
    body: TourismData,
    credentials: {},
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_TOUR + "storeTourism";

    const msgBody = {
      tourismType: body.tourismType,
      region: body.region,
      tourismName: body.tourismName,
      tourismLocation: body.tourismLocation,
      phone: body.phone,
      grade: body.grade,
      tourismCost: body.tourismCost,
      capacity: body.capacity,
      tourismId: body.tourismId,
    };

    return remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  storeGeoData(
    body: GeoData,
    credentials: {},
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO + "storeGeoData";

    const msgBody = {
      geoChangedData: body,
    };

    return remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  storeGeoTourData(
    userId: string,
    geoData: GeoData,
    tourData: TourismData,
    credentials: {},
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO + "storeGeoTourData";

    const msgBody = {
      userId: userId,
      geoChangedData: geoData,
      tourData: tourData,
    };

    return remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getTourismTypes(remoteSvrc: RemoteService): Observable<any> {
    const url = AppConstants.URL_MOQUI_TOUR_NO_AUTH + "getTourismEnumData";
    const msgBody = {};
    return remoteSvrc.getHttpApikey(url, msgBody, null, null);
  }

  getTourismDataByUser(
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_TOUR + "getTourismByUser";
    const msgBody = {};
    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  getTourismDataByAdmin(
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_TOUR + "getTourism";
    const msgBody = {};
    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  getTourismDataByAdminPage(
    offset: string,
    limit: string,
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_TOUR + "getTourism";
    const msgBody = {
      offset: offset,
      limit: limit,
    };
    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  getTourismDataByNameLocation(
    name: string,
    location: string,
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_TOUR + "getTourismByNameLocation";
    const msgBody = {
      name: name,
      location: location,
    };
    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  getGeoEnumData(remoteSvrc: RemoteService): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO_NO_AUTH + "getGeoEnumData";
    const msgBody = {};
    return remoteSvrc.getHttpApikey(url, msgBody, null, null);
  }

  getGeoData(apikey: string, remoteSvrc: RemoteService): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO + "getGeoData";
    const msgBody = {};

    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  getGeoDataByPage(
    limit: string,
    offset: string,
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO + "getGeoData";
    const msgBody = {
      offset: offset,
      limit: limit,
    };

    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  getGeoDataByName(
    name: string,
    limit: string,
    offset: string,
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO + "getGeoData";
    const msgBody = {
      offset: offset,
      limit: limit,
      qstr: name,
    };

    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  getGeoDataByUser(apikey: string, remoteSvrc: RemoteService): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO + "getGeoDataByUser";
    const msgBody = {};

    return remoteSvrc.getHttpApikey(url, null, apikey, msgBody);
  }

  storeGeoDistrictCitySuburb(
    body: GeoData,
    credentials: {},
    apikey: string,
    remoteSvrc: RemoteService
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_GEO + "storeGeoDistrictCitySuburb";

    const msgBody = {
      geoChangedData: body,
    };

    return remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getCountryList() {
    let self = this;
    return new Promise((resolve, reject) => {
      if (null !== self.countries) {
        resolve(self.countries);
      }

      const url_p = `${AppConstants.URL_MOQUI_GEO}getCountryList`;

      this.remoteSvrc
        .getHttpApikey(url_p, {}, self.auth.getUserLogin().apikey)
        .subscribe((data: any) => {
          if (data.httpStatus === "200") {
            self.countries = data["Countries"];

            resolve(self.countries);
          }
        });
    });
  }

  getCurrencyList() {
    let self = this;
    return new Promise((resolve, reject) => {
      if (null !== self.currencies) {
        resolve(self.currencies);
      }

      const url_p = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCurrencyList`;

      this.remoteSvrc
        .getHttpApikey(url_p, {}, self.auth.getUserLogin().apikey)
        .subscribe((data: any) => {
          if (data.httpStatus === "200") {
            self.currencies = data.CurrencyCodes;

            resolve(self.currencies);
          }
        });
    });
  }

  getCountryCurrencyList() {
    let self = this;
    return new Promise((resolve, reject) => {
      let msgBody = {};
      const url_p = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCountryCurrencyList`;
      this.remoteSvrc.getHttpApikey(url_p).subscribe((data: any) => {
        if (data["httpStatus"] === "200") {
          self.countries = data["CountryCodes"];

          self.currencies = data["CurrencyCodes"];

          let ccur = {
            CountryCodes: self.countries,
            CurrencyCodes: self.currencies,
            httpStatus: "200",
          };
          resolve(ccur);
        }
      });
    });
  }

  getStateProvinceRegionList(msgBody) {
    let self = this;
    return new Promise((resolve, reject) => {
      const url_p = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getStateProvinceRegionList`;
      /*    this.remoteSvrc
        .postHttpApikey(url_p, msgBody, {}, null) */

      return this.remoteSvrc
        .getHttpApikey(url_p, null, null, msgBody)
        .subscribe((data: any) => {
          if (data.httpStatus === "200") {
            self.StateProvinceRegion = data["StateProvinceRegion"];

            resolve(self.StateProvinceRegion);
          }
        });
    });
  }

  getCitiesList(msgBody) {
    let self = this;
    return new Promise((resolve, reject) => {
      const url_p = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCitiesList`;
      /* this.remoteSvrc
        .postHttpApikey(url_p, msgBody, {}, null) */
      return this.remoteSvrc
        .getHttpApikey(url_p, null, null, msgBody)
        .subscribe((data: any) => {
          if (data.httpStatus === "200") {
            self.Cities = data["Cities"];

            resolve(self.Cities);
          } else {
            reject(data);
          }
        });
    });
  }

  getDistrictList(countryCode: string, regionCode: string): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getDistrictsList`;

    const msgBody = {
      countryCode: countryCode,
      regionCode: regionCode,
    };

    return this.remoteSvrc.getHttpApikey(url, null, null, msgBody);

    // return this.remoteSvrc.postHttpApikey(url, msgBody, {}, null);
  }

  getCitiesByCountryRegionDistrict(
    countryCode: string,
    regionCode: string,
    districtCode: string
  ): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCitiesByCountryRegionDistrict`;

    const msgBody = {
      countryCode: countryCode,
      regionCode: regionCode,
      districtCode: districtCode,
    };

    // return this.remoteSvrc.postHttpApikey(url, msgBody, {}, null);
    return this.remoteSvrc.getHttpApikey(url, null, null, msgBody);
  }

  getCitiesByCountryRegionDistrictPage(
    countryCode: string,
    regionCode: string,
    districtCode: string,
    limit: string,
    offset: string
  ): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCitiesByCountryRegionDistrict`;

    const msgBody = {
      countryCode: countryCode,
      regionCode: regionCode,
      districtCode: districtCode,
      limit: limit,
      offset: offset,
    };

    //return this.remoteSvrc.postHttpApikey(url, msgBody, {}, null);
    return this.remoteSvrc.getHttpApikey(url, null, null, msgBody);
  }

  getCitiesByCountryRegionDistrictName(
    countryCode: string,

    qstr: string,
    limit: string,
    offset: string
  ): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCitiesByCountryRegionDistrict`;

    const msgBody = {
      countryCode: countryCode,
      qstr: qstr,
      limit: limit,
      offset: offset,
    };

    return this.remoteSvrc.getHttpApikey(url, null, null, msgBody);
    //return this.remoteSvrc.postHttpApikey(url, msgBody, {}, null);
  }

  getCitiesByCountryRegionDistrictByCityName(msgBody): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCitiesByCountryRegionDistrict`;

    //return this.remoteSvrc.postHttpApikey(url, msgBody, {}, null);
    return this.remoteSvrc.getHttpApikey(url, null, null, msgBody);
  }

  getCitiesBySuburbs(
    countryCode: string,
    regionCode: string,
    districtCode: string,
    cityCode: string
  ): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCitySuburbs`;

    const msgBody = {
      countryCode: countryCode,
      regionCode: regionCode,
      districtCode: districtCode,
      cityCode: cityCode,
    };
    return this.remoteSvrc.getHttpApikey(url, null, null, msgBody);
    //return this.remoteSvrc.postHttpApikey(url, msgBody, {}, null);
  }

  getCitiesListByPage(
    countryCode: string,
    regionCode: string,
    offset: string,
    limit: string
  ): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO}getCitiesList`;

    const msgBody = {
      offset: offset,
      limit: limit,
      countryCode: countryCode,
      regionCode: regionCode,
    };

    return this.remoteSvrc.postHttpApikey(
      url,
      msgBody,
      {},
      this.auth.getUserLogin().apikey
    );
  }

  getCitiesListByPageCityName(
    countryCode: string,
    regionCode: string,
    district: string,
    qstr: string,
    offset: string,
    limit: string
  ): Observable<any> {
    let url = `${AppConstants.URL_MOQUI_GEO_NO_AUTH}getCityInfo`;

    const msgBody = {
      offset: offset,
      limit: limit,
      countryCode: countryCode,
      regionCode: regionCode,
      district: district,
      qstr: qstr,
    };

    return this.remoteSvrc.getHttpApikey(url, null, null, msgBody);

    /*  return this.remoteSvrc.getHttpApikey(
      url,
      {},
      this.auth.getUserLogin().apikey,
      msgBody,
      {}
    ); */
  }
}
