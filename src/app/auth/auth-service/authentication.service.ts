import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";

import { BehaviorSubject, Observable } from "rxjs";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";

import { ToastComponent } from "src/app/components/toastComponent";
import {
  IEnv,
  IUserLogin,
  Session,
} from "src/app/base-services/common-service/models/common-model.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";


@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  credentials = new BehaviorSubject({});
  static authState = new BehaviorSubject("home");

  static userLogin: IUserLogin = null as any;
  static env: IEnv = {
    appId: "SABGH",
    serviceId: "SKILAB",
    appMode: "DEV",
    appCurrency: "GHS",
    appLanguage: "en_GH",
    mxlogin: "N",
    mxreg: "N",
    appLocale: {
      appCountry: "Ghana",
      appCountryCode: "GHA",
      appRegion: "Ashanti",
      appRegionCode: "GHA_AS",
      appCounty: "Kumasi Metro",
      appCountyCode: "GHA_AS_K013",
      appCity: "Kumasi",
      appCityCode: "GHA_AS_KSI",
      appCurrency: "Ghanaian cedi",
      appCurrencyCode: "GHS",
      appLanguage: "en_GH",
    },
    wsUrl: "ws://localhost:8080/notws",
  };

  static session: Session = { token: "", xCsrfToken: "", moquiVisitorId: "", visitorCookie: "" };
  /* wss://sabonay.com/notws
     ws://localhost:8080/notws
     ws://10.0.0.126:8080/notws
  */

  constructor(
    private router: Router,
    private platform: Platform,
    private toast: ToastComponent,
    private remoteSvrc: RemoteService
  ) {
    let self = this;
  }

  public getSessionToken(): Session {
    return AuthenticationService.session;
  }

  public setSessionToken(token: string) {
    AuthenticationService.session.token = token;
    //console.log('AuthenticationService::setSessionToken() AuthenticationService.session.token: ' + JSON.stringify(AuthenticationService.session.token));
  }

  public setXCsrfToken(token: string) {
    AuthenticationService.session.xCsrfToken = token;
    //console.log('AuthenticationService::setXCsrfToken() AuthenticationService.session.xCsrfToken: ' + JSON.stringify(AuthenticationService.session.xCsrfToken));
  }

  public setMoquiVisitorId(token: string) {
    AuthenticationService.session.moquiVisitorId = token;
    //console.log('AuthenticationService::setMoquiVisitorId() AuthenticationService.session.moquiVisitorId: ' + JSON.stringify(AuthenticationService.session.moquiVisitorId));
  }
  public setVisitorCookie(token: string) {
    AuthenticationService.session.visitorCookie = token;
    //console.log('AuthenticationService::setVisitorCookie() AuthenticationService.session.visitorCookie: ' + JSON.stringify(AuthenticationService.session.visitorCookie));
  }

  getCredentials(): Observable<any> {
    return this.credentials.asObservable();
  }

  public getUserLogin(): IUserLogin {
    return AuthenticationService.userLogin;
  }

  public getEnv(): IEnv {
    return AuthenticationService.env;
  }

  public static setUserLogin(uliBody: IUserLogin) {
    AuthenticationService.userLogin = uliBody;
    //console.log('AuthenticationService::setUserLogin() this.userLogin: ' + JSON.stringify(AuthenticationService.userLogin));
  }

  loadEnvData() {
    let self = this;
    return new Promise((resolve, reject) => {
      this.remoteSvrc.getHttpApikey("assets/config/appenv.json").subscribe(
        (data) => {
          AuthenticationService.env = data;
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ifLoggedIn(msgBody: any) {
    if (
      null == AuthenticationService.userLogin ||
      "login" == AuthenticationService.authState.value
    ) {
      //console.log('AuthenticationService::ifLoggedIn() calling login() with ' + JSON.stringify(msgBody));
      this.login(msgBody).then((response: any) => {
        //console.log('AuthenticationService::ifLoggedIn() response: ' + JSON.stringify(response));
        this.loadEnvData();
        let regStatusEnumId = response["registrationStatusEnumId"];
        if ("RgCompltd" == regStatusEnumId) {
          AuthenticationService.authState.next("menu");
          //AuthenticationService.authState.next('regconfirm');
        } else {
          let regOtp = response["regOtp"];
          if (null != regOtp) {
            AuthenticationService.authState.next("regconfirm");
          } else {
            AuthenticationService.authState.next("login");
          }
        }
      });
    }
  }

  ifLoggedOut() {
    if (null !== AuthenticationService.userLogin) {
      this.logout().then((response) => {
        AuthenticationService.authState.next("login");
        //window.location.reload();
        localStorage.clear();
      });
      AuthenticationService.authState.next("login");
      //window.location.reload();
      localStorage.clear();
    }
  }

  isAuthenticated() {
    return AuthenticationService.authState.value == "menu";
  }

  public login(msgBody: any) {
    let self = this;
    return new Promise((resolve, reject) => {
      let url_p = AppConstants.URL_MOQUI_DCUBEAUTH + "login";

      msgBody["mxlogin"] = AuthenticationService.env.mxlogin;

      this.remoteSvrc.postHttpNoAuth(url_p, msgBody).subscribe(
        (data) => {
          if (
            undefined != data &&
            null != data &&
            "200" === data["httpStatus"]
          ) {
            AuthenticationService.userLogin = <IUserLogin>data["userLogin"];

            url_p = AppConstants.URL_MOQUI_AUTH_REST + "getApiKey";
            let credentials = {
              username: msgBody.username,
              password: msgBody.password,
            };
            RemoteService.credentials = credentials;
            this.credentials.next(msgBody);
            this.remoteSvrc.getHttpApikey(url_p, credentials)
              .subscribe({
                next: (data) => {
                  if (
                    undefined != data &&
                    null != data &&
                    "200" === data["httpStatus"]
                  ) {
                    AuthenticationService.userLogin.apikey = data["apikey"];

                    this.loadEnvData().then(
                      (data) => {
                        AuthenticationService.env = <IEnv>data;
                      },
                      (err) => {
                        this.toast.presentFailedToast(
                          "Load Env Data err: " + JSON.stringify(err)
                        );
                      }
                    );

                    resolve(AuthenticationService.userLogin);
                  } else {
                    if (undefined !== data["errors"] && null !== data["errors"]) {
                      reject({ errors: data["errors"] });
                    } else {
                      reject({ errors: data["message"] });
                    }
                  }
                },
                error: (err) => {
                  reject(err["_body"]);
                }
              });
          } else {
            if (undefined !== data["errors"] && null !== data["errors"]) {
              reject({ errors: data["errors"] });
            } else {
              reject({ errors: data["message"] });
            }
          }
        },
        (err) => {
          this.toast.presentFailedToast(
            'AuthenticationService::login(4) err["_body"]: ' +
            JSON.stringify(err["_body"])
          );
          reject(err["_body"]);
        }
      );
    });
  }


  public logout() {
    let url_p = AppConstants.URL_MOQUI_AUTH_REST + "logout";

    let self = this;
    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .getHttpApikey(url_p, {}, AuthenticationService.userLogin.apikey)
        .subscribe({
          next: (data) => {
            AuthenticationService.userLogin = null as any;
            resolve(data);
          },
          error: (err) => {
            this.toast.presentFailedToast(
              "AuthenticationService::logout() err: " + JSON.stringify(err)
            );
            AuthenticationService.userLogin = null as any;
            reject(err["_body"]);
          }
        });
    });
  }

}
