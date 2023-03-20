import { Injectable } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import {
  AngularFireMessaging,
  AngularFireMessagingModule,
} from "@angular/fire/compat/messaging";
import { URL_MOQUI_SCOM_REST } from "../common-service/app-constants/app-constants.service";

import { StorageService } from "../storage-service/storage.service";
import { RemoteService } from "../remote-service/remote.service";
import { Platform } from "@ionic/angular";
/* import { Toast } from "@capacitor/toast"; */
import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

@Injectable({
  providedIn: "root",
})
export class FcmService {
  constructor(
    private auth: AuthenticationService,
    private platform: Platform,
    private remoteService: RemoteService,
    private afMessaging: AngularFireMessaging,
    private toast: ToastComponent
  ) {}

  /**
   * request user permission on web and listen to push notification
   */
  setupNotification() {
    const user = this.auth.getUserLogin();
    if (this.platform.is("desktop")) {
      this.requestPermission(user);
    }
  }

  /**
   * request permission to send push notification to user
   * @param user
   */
  requestPermission(user) {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        this.storePushNotificationToken(user.userId, token, "get");
        this.listen();
      },
      (error) => {
        this.toast.presentFailedToast(
          "Error on registration: " + JSON.stringify(error)
        );
      }
    );
  }

  /**
   * listen to incoming notification on foreground
   */
  listen() {
    this.afMessaging.messages.subscribe((message) => {
      const messageBody = (message as any).notification.body;
      this.showToastMessage(messageBody);
    });
  }

  /**
   * store notification token to backend
   * @param userId
   * @param token
   * @param state
   */
  storePushNotificationToken(userId, token, state) {
    const self = this;
    const credentials = {};
    const notificationUrl = `${URL_MOQUI_SCOM_REST}storePushNotificationToken`;

    const appId = this.auth.getEnv().appId;
    const msgBody = {
      appId,
      userId,
      token,
      state,
    };

    this.remoteService
      .postHttpApikey(
        notificationUrl,
        msgBody,
        credentials,
        this.auth.getUserLogin().apikey
      )
      .subscribe((data: any) => {
        if (data.httpStatus === "200") {
          console.log(
            "FcmService::storePushNotificationToken() data: " +
              JSON.stringify(data)
          );
        }
      });
  }

  /**
   * display a toast notification when app is in foreground
   * @param message
   */
  async showToastMessage(message: string) {
    /* await Toast.show({
      text: message,
      position: "top",
      duration: "long",
    }); */
  }
}
