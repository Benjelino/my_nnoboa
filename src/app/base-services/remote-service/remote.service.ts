import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { HttpParams, HttpErrorResponse } from "@angular/common/http";

import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { Utils } from "../utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
// import { take } from "rxjs-compat/operator/take";

export interface ICredential {
  username: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class RemoteService {
  //static credentials = new  BehaviorSubject( {} );
  static credentials: ICredential = null;

  constructor(public http: HttpClient, private toast: ToastComponent) {}

  /* getCredentials() {
    return RemoteService.credentials.pipe( take(1) );
  } */

  /* getCredentialsObservable(): Observable<any> {
    return RemoteService.asObservable();
  } */

  getBasicEncodedCredentials(user, password) {
    let token = user + ":" + password;

    // Base64 Encoding -> btoa
    let encodedCredentials = btoa(token);

    return "Basic " + encodedCredentials;
  }

  getBearerCredentials(secret: string) {
    let _key = "Authorization";
    let _value = "Bearer " + secret;
    let resptoken = { key: _key, value: _value };

    return resptoken;
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this.toast.presentFailedToast(
        "Client-side or network error occurred:" + error.message
      );
    } else {
      this.toast.presentFailedToast(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    return throwError(
      "Something bad happened; please try again later: " + error.message
    );
  }

  getTokenCredentials_Old(user, password, apikey?: string) {
    let resptoken = {};
    if (Utils.stringNotEmpty(apikey)) {
      resptoken = { api_key: apikey };
    } else {
      if (Utils.stringNotEmpty(user) && Utils.stringNotEmpty(password)) {
        let _value = this.getBasicEncodedCredentials(user, password);
        resptoken = { Authorization: _value };
      }
    }

    return resptoken;
  }

  getTokenCredentials(user, password, apikey?: string) {
    let resptoken = {};
    if (Utils.stringNotEmpty(apikey)) {
      let _value = this.getBasicEncodedCredentials(
        RemoteService.credentials.username,
        RemoteService.credentials.password
      );
      resptoken = { Authorization: _value };
    } else {
      if (Utils.stringNotEmpty(user) && Utils.stringNotEmpty(password)) {
        let _value = this.getBasicEncodedCredentials(user, password);
        resptoken = { Authorization: _value };
      }
    }

    return resptoken;
  }

  getTokenCredentialsApiKeyInterceptor(user, password, apikey?: string) {
    let resptoken = {};
    if (Utils.stringNotEmpty(apikey)) {
      resptoken = { api_key: apikey };
    } else {
      if (Utils.stringNotEmpty(user) && Utils.stringNotEmpty(password)) {
        let _value = this.getBasicEncodedCredentials(user, password);
        resptoken = { Authorization: _value };
      }
    }

    return resptoken;
  }

  getRequestOptionsArgs(
    credentials?: {},
    apikey_p?: string,
    contentType?: string
  ): HttpHeaders {
    let _contentType = "application/json";
    if (Utils.stringNotEmpty(contentType)) {
      _contentType = contentType;
    }

    return this.getRequestOptionsArgsCT(_contentType, credentials, apikey_p);
  }

  getRequestOptionsArgsCT(
    contentType: string,
    credentials?: {},
    apikey_p?: string
  ): HttpHeaders {
    let username = "";
    let password = "";

    if (Utils.objectNotEmpty(credentials)) {
      username = credentials["username"];
      password = credentials["password"];
    }

    let hdrs = this.getTokenCredentials(username, password, apikey_p);

    if (Utils.stringNotEmpty(contentType)) {
      hdrs["Content-Type"] = contentType;
    }

    return new HttpHeaders(hdrs);
  }

  getHttp(url: string, header: {}, params?: {}, msgBody?: {}): Observable<any> {
    const httpOptions = {
      headers: header,
    };

    if (Utils.objectNotEmpty(params)) {
      let hparams = new HttpParams();

      for (var key in params) {
        hparams = hparams.append(key, params[key]);
      }

      httpOptions["params"] = hparams;
    }

    if (Utils.objectNotEmpty(msgBody)) {
      httpOptions["observe"] = msgBody;
    }

    return this.http
      .get<any>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  async gettHttpApikeyAsync(
    url: string,
    credentials?: {},
    apikey?: string,
    params?: {},
    msgBody?: {}
  ): Promise<any> {
    const header = this.getRequestOptionsArgs(credentials, apikey);

    const httpOptions = {
      headers: header,
    };

    if (Utils.objectNotEmpty(params)) {
      let hparams = new HttpParams();

      for (var key in params) {
        hparams = hparams.append(key, params[key]);
      }

      httpOptions["params"] = hparams;
    }

    if (Utils.objectNotEmpty(msgBody)) {
      httpOptions["observe"] = msgBody;
    }

    return await this.http
      .get<any>(url, httpOptions)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  getHttpApikey(
    url: string,
    credentials?: {},
    apikey?: string,
    params?: {},
    msgBody?: {}
  ): Observable<any> {
    const header = this.getRequestOptionsArgs(credentials, apikey);

    return this.getHttp(url, header, params, msgBody).pipe(
      catchError(this.handleError)
    );
  }

  getHttpApikeyParams(
    url: string,
    credentials?: {},
    apikey?: string,
    params?: {}
  ): Observable<any> {
    const header = this.getRequestOptionsArgs(credentials, apikey);

    return this.getHttp(url, header, params);
  }

  async postHttpApikeyAsync(
    url: string,
    msgBody: {},
    credentials?: {},
    apikey?: string
  ): Promise<any> {
    const header = this.getRequestOptionsArgs(credentials, apikey);

    const httpOptions = {
      headers: header,
    };

    return await this.http
      .post<any>(url, msgBody, httpOptions)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  postHttp(url: string, msgBody: {}, header: {}): Observable<any> {
    const httpOptions = {
      headers: header,
    };

    return this.http
      .post<any>(url, msgBody, httpOptions)
      .pipe(catchError(this.handleError));
  }

  postHttpNoAuth(
    url: string,
    msgBody: {},
    credentials?: {},
    apikey?: string
  ): Observable<any> {
    const header = this.getRequestOptionsArgs();

    return this.postHttp(url, msgBody, header);
  }

  postHttpApikey(
    url: string,
    msgBody: {},
    credentials?: {},
    apikey?: string
  ): Observable<any> {
    const header = this.getRequestOptionsArgs(credentials, apikey);
    return this.postHttp(url, msgBody, header);
  }

  postHttpFormData(
    url: string,
    msgBody: FormData,
    credentials: {}
  ): Observable<any> {
    /*
        The problem is that you are setting the Content-Type by yourself, let it be blank.
        Google Chrome will do it for you. The multipart Content-Type needs to know the file boundary,
        and when you remove the Content-Type, Google Chrome will do it automagically for you
        */
    const header = this.getRequestOptionsArgsCT(null, credentials, null);

    return this.postHttp(url, msgBody, header);
  }

  postHttpApikeyFormData(
    url: string,
    msgBody: FormData,
    credentials: {},
    apikey: string
  ): Observable<any> {
    /*
        The problem is that you are setting the Content-Type by yourself, let it be blank.
        Google Chrome will do it for you. The multipart Content-Type needs to know the file boundary,
        and when you remove the Content-Type, Google Chrome will do it automagically for you
        */
    const header = this.getRequestOptionsArgsCT(null, credentials, apikey);

    return this.postHttp(url, msgBody, header);
  }

  deleteHttp(
    url: string,
    header: {},
    params?: {},
    msgBody?: {}
  ): Observable<any> {
    const httpOptions = {
      headers: header,
    };

    if (Utils.objectNotEmpty(params)) {
      let hparams = new HttpParams();

      for (let key in params) {
        hparams = hparams.append(key, params[key]);
      }

      httpOptions["params"] = hparams;
    }

    if (Utils.objectNotEmpty(msgBody)) {
      httpOptions["observe"] = msgBody;
    }

    return this.http
      .delete<any>(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteHttpApikey(
    url: string,
    credentials?: {},
    apikey?: string,
    params?: {},
    msgBody?: {}
  ): Observable<any> {
    const header = this.getRequestOptionsArgs(credentials, apikey);

    return this.deleteHttp(url, header, params, msgBody);
  }

  // for printapp

  getApiKey(url: string, credentials: any) {
    const reqOptions: any = this.getRequestOptionsArgs("Get", credentials);

    return this.http.get(url, reqOptions);
  }

  getWithObservable(url: string, apiKey: string) {
    let headers = new HttpHeaders();
    headers = headers
      .append("api_key", apiKey)
      .append("Content-Type", "application/json");
    return this.http.get(url, { headers });
  }

  postWithObservable(url: string, apiKey: string, params: any) {
    let headers = new HttpHeaders();
    headers = headers
      .append("api_key", apiKey)
      .append("Content-Type", "application/json");
    return this.http.post(url, params, { headers });
  }
}
