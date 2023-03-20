import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as Models from "src/app/media/services/media-model.service";

import { RemoteService } from "src/app/base-services/remote-service/remote.service";

@Injectable({
  providedIn: "root",
})
export class DcubecmsRemoteService {
  constructor(private remoteSvrc: RemoteService) {}

  saveAnnoucement(
    appId: string,
    author: string,
    title: string,
    content: string,
    tag: string,
    userId,
    credentials: {},
    apikey: string
  ): Observable<Models.AnnoucementResponse> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveAnnouncement";

    const msgBody = {
      appId,
      author,
      content,
      title,
      tag,
      datePosted: new Date().getTime(),
      userId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  // adding link functions

  saveLink(
    appId: string,
    title: string,
    urlink: string,
    mname: string,
    ltype: string,
    mediumId: string,
    tag: string,
    userId: string,
    credentials: {},
    apikey: string
  ): Observable<Models.AnnoucementResponse> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveLink";

    const msgBody = {
      appId,
      title,
      urlink,
      mname,
      ltype,
      mediumId,
      tag,
      userId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getLinks(
    appId: string,
    userId: string,
    credentials: {},
    apikey: string
  ): Observable<Models.LinkList> {
    let url = AppConstants.URL_MOQUI_DCUBECMS_REST + "getLinks";

    let params = new HttpParams();
    params = params.append("userId", userId);
    params = params.append("appId", appId);
    const header = this.remoteSvrc.getRequestOptionsArgs(credentials, apikey);

    if (credentials != null || apikey != null) {
      url = AppConstants.URL_MOQUI_DCUBECMS_REST + "getLinks";
    } else {
      url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getLinks";
    }

    return this.remoteSvrc.getHttp(url, header, params);
  }

  getLinksByMedium(
    mediumId: string,
    userId: string,
    credentials: {},
    apikey: string,
    appId: string
  ): Observable<Models.LinkList> {
    let url = AppConstants.URL_MOQUI_DCUBECMS_REST + "getLinkByMedium";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getLinkByMedium";
    }

    const msgBody = {
      userId: userId,
      mediumId: mediumId,
      appId: appId,
    };
    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
    // return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getLinksByAppType(
    apikey: string,
    appId: string,
    ltype: string
  ): Observable<Models.LinkList> {
    let url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getLinksByType";

    const msgBody = {
      ltype: ltype,
      appId: appId,
    };

    //return this.remoteSvrc.postHttpApikey(url, msgBody, null, apikey);

    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  saveMedium(
    appId: string,
    author: string,
    title: string,
    content: string,
    tag: string,
    mtype: number,
    userId: string,
    credentials: {},
    apikey: string
  ): Observable<Models.AnnoucementResponse> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveMedium";

    const header = this.remoteSvrc.getRequestOptionsArgs(credentials, apikey);

    const msgBody = {
      appId,
      author,
      content,
      title,
      tag,
      datePosted: new Date().getTime(),
      mtype,
      userId,
    };

    return this.remoteSvrc.postHttp(url, msgBody, header);
  }

  saveMediumFormData(
    data: FormData,
    credentials: {},
    apikey: string
  ): Observable<Models.AnnoucementResponse> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveMedium";

    const header = this.remoteSvrc.getRequestOptionsArgs(credentials, apikey);

    return this.remoteSvrc.postHttp(url, data, header);
  }

  getMediaByType(
    mtype: string,
    userId: string,
    credentials: {},
    apikey: string,
    appId: string
  ): Observable<Models.MediumList> {
    let url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getMediaByType";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getMediaByType";
    }

    const msgBody = {
      userId: userId,
      mtype: mtype,
      appId: appId,
    };

    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
    //return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getMediaByTypePage(
    mtype: string,
    userId: string,
    offset: string,
    limit: string,
    credentials: {},
    apikey: string,
    appId: string
  ): Observable<Models.MediumList> {
    let url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getMediaByType";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getMediaByType";
    }

    const msgBody = {
      offset: offset,
      limit: limit,
      userId: userId,
      mtype: mtype,
      appId: appId,
    };
    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
    //return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getMedium(
    mediumId: string,
    userId: string,
    credentials: {},
    apikey: string,
    appId: string
  ): Observable<Models.Medium> {
    let url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getMedium";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getMedium";
    }

    const msgBody = {
      mediumId: mediumId,
      appId: appId,
    };
    if (userId != null) {
      msgBody["userId"] = userId;
    }

    // return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);

    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  getUserStats(
    userId: string,
    credentials: {},
    apikey: string,
    appId: string
  ): Observable<Models.UserStat> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "getUserStatistics";

    const msgBody = {
      userId,
      appId: appId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  getResource(pathname: string): Observable<any> {
    const url = AppConstants.URL_MOQUI_DUTILS_NOAUTH + "getResource";
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const msgBody = {
      pathname: pathname,
      inline: true,
    };
    return this.remoteSvrc.getHttpApikey(url, msgBody, null, null);
  }

  getCommentsByMedium(
    appId: string,
    mediumId: string,
    userId: string,
    credentials: {},
    apikey: string
  ): Observable<Models.Comments> {
    let url = AppConstants.URL_MOQUI_DCUBECMS_REST + "getComment";

    if (credentials == null && apikey == null) {
      url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getComment";
    }

    const msgBody = {
      appId: appId,
      mediumId: mediumId,
    };
    if (userId != null) {
      msgBody["userId"] = userId;
    }

    //return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);

    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  saveComment(
    appId: string,
    mediumId: string,
    name: string,
    subject: string,
    comment: string,
    userId: string,
    credentials: {},
    apikey: string
  ): Observable<Models.CommentResponse> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveComment";

    const msgBody = {
      appId,
      mediumId,
      name,
      subject,
      comment,
      userId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  saveLike(
    appId: string,
    mediumId: string,
    liked: string,
    userId: string,
    credentials: {},
    apikey: string
  ): Observable<Models.LikeResponse> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveLike";

    const msgBody = {
      appId,
      mediumId,
      liked,
      userId,
    };

    return this.remoteSvrc.postHttpApikey(url, msgBody, credentials, apikey);
  }

  saveTribute(
    formData: FormData,
    credentials: {},
    apiKey: string
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveTribute";

    return this.remoteSvrc.postHttpApikeyFormData(url, formData, null, apiKey);
  }

  getTribute(
    appId: string,
    tributeId: string,
    apikey: string
  ): Observable<any> {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST_NOAUTH + "getTribute";

    const msgBody = {
      appId: appId,
      tributeId: tributeId,
    };
    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  /*   getFuneralTopProviders(
    appId: string,
    credentials: {},
    apikey: string
  ): Observable<SModels.TopProviders> {
    const url = AppConstants.URL_MOQUI_SR_REST + "getTopProviders";
    const header = this.remoteSvrc.getRequestOptionsArgs(credentials, apikey);

    const httpOptions = {
      headers: header,
    };

    const msgBody = {
      appId: appId,
    };

    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  }

  getFuneralServices(
    appId: string,
    credentials: {},
    apikey: string
  ): Observable<SModels.FuneralService> {
    const url = AppConstants.URL_MOQUI_SR_REST + "getServicesList";

    const msgBody = {
      appId: appId,
    };
    return this.remoteSvrc.getHttpApikey(url, {}, apikey, msgBody, {});
  } */
}
