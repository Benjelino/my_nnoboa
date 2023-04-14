import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import {
  PushNotificationSchema,
  Token,
  ActionPerformed,
  PushNotifications,
} from "@capacitor/push-notifications";
import { FCM } from "@capacitor-community/fcm";

import { ReactiveFormConfig } from "@rxweb/reactive-form-validators";

import { TranslateService } from "@ngx-translate/core";

import { ToastComponent } from "./components/toastComponent";
import { AppConfigService } from "./base-services/common-service/app-config/app-config.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { StorageService } from "./base-services/storage-service/storage.service";
import { FcmService } from "./base-services/fcm-services/fcm.service";
import { RemoteService } from "./base-services/remote-service/remote.service";
import { Utils } from "./base-services/utility-services/utils";
import { URL_MOQUI_SCOM_REST } from "./base-services/common-service/app-constants/app-constants.service";
import { IEnv } from "./base-services/common-service/models/common-model.service";

const fcm = FCM;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private _translate: TranslateService,
    private appcfg: AppConfigService,
    private auth: AuthenticationService,
    private storage: StorageService,
    private fcm: FcmService,
    private remoteSvrc: RemoteService,
    private toast: ToastComponent
  ) {
    this.initializeApp();
  }
  remoteToken: string;

  ngOnInit() {
    ReactiveFormConfig.set({
      internationalization: {
        dateFormat: "dmy",
        seperator: "/",
      },
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this._initTranslate();
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.appcfg.load().then((cfgdata) => {
        AuthenticationService.env = <IEnv>cfgdata;
      });

      AuthenticationService.authState.subscribe((state) => {
        switch (state) {
          case "menu":
            let user = this.auth.getUserLogin();

            if (
              this.platform.is("ios") ||
              (this.platform.is("android") &&
                !((this.platform.is("desktop") || this.platform.is("mobileweb"))))
            ) {
              this.registerPush(user);
            }

            // setup fcm web/desktop push notification
            if (this.platform.is("desktop") || this.platform.is("mobileweb")) {
              this.fcm.setupNotification();
            }

            this.router.navigate(["/menu/client-dashboard"]);
            break;
          case "register":
            this.router.navigate(["/register"]);
            break;
          case "regconfirm":
            this.router.navigate(["/regconfirm"]);
            break;
          case "login":
            this.router.navigate(["/login"]);
            break;
          case "forgot":
            this.router.navigate(["/forgot"]);
            break;
          case "contactus":
            this.router.navigate(["/contactus"]);
            break;
          case "companies":
            this.router.navigate(["/companies"]);
            break;
          default:
            this.router.navigate(["/home"]);
            break;
        }
      });
    });
  }

  private _initTranslate() {
    // Set the default language for translation strings, and the current language.
    this._translate.setDefaultLang("en");

    if (this._translate.getBrowserLang() !== undefined) {
      this._translate.use(this._translate.getBrowserLang());
    } else {
      this._translate.use("en"); // Set your language here
    }
  }

  getFcmToken(user) {
    // get FCM token
    fcm.getToken().then((token) => {
      let userId = user.userId;

      this.storePushNotificationToken(userId, token, "get");

      this.storage.saveData("fcmtoken", token);
    });
  }

  unsubscribeFrom(topic) {
    fcm
      .unsubscribeFrom({ topic: topic })
      .then((r) => alert(`unsubscribed from topic ${topic}`))
      .catch((err) => this.toast.presentFailedToast(err));
    if (this.platform.is("android")) fcm.deleteInstance();
  }

  private registerPush(user) {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive == "granted") {
        PushNotifications.register();
      } else {
      }
    });

    PushNotifications.addListener("registration", (token: Token) => {
      fcm
        .getToken()
        .then((result) => {
          this.remoteToken = result.token;

          let userId = user.userId;

          this.storePushNotificationToken(userId, this.remoteToken, "get");
          this.storage.saveData("fcmtoken", this.remoteToken);

          let subscribedTopics = this.auth.getUserLogin().subscribedTopics;
          console.log("subscribedTopicsG", subscribedTopics);

          if (
            Utils.stringNotEmpty(subscribedTopics)
          ) {

            let topicsArr = subscribedTopics.split(",");
            for (let i = 0; i < topicsArr.length; i++) {
              fcm.subscribeTo({ topic: topicsArr[i] });
              console.log("still did subscribe to topic", topicsArr[i]);
            }
          }
        })
        .catch((err) => this.toast.presentFailedToast(err));
    });

    PushNotifications.addListener("registrationError", (error: any) => { });

    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification: PushNotificationSchema) => { }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        this.router.navigate(["/news-detail/", data.mediumId]);
      }
    );
  }

  storePushNotificationToken(userId, token, state) {
    let self = this;
    let credentials = {};
    const url_p = `${URL_MOQUI_SCOM_REST}storePushNotificationToken`;

    let appId = this.auth.getEnv().appId;
    let msgBody = {
      appId: appId,
      userId: userId,
      token: token,
      state: state,
    };

    this.remoteSvrc
      .postHttpApikey(
        url_p,
        msgBody,
        credentials,
        this.auth.getUserLogin().apikey
      )
      .subscribe((data: any) => {
        if (data.httpStatus === "200") {
        }
      });
  }
}
