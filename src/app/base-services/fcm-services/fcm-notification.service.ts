import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable } from "rxjs";

//import * as Models from "src/app/media/services/media-model.service";
import { RemoteService } from "../remote-service/remote.service";

@Injectable({
  providedIn: "root",
})
export class FcmNotificationService {
  constructor(private router: Router, private remoteSvrc: RemoteService) {}

  postFCMNotification(
    mediumId: string,
    title: string,
    content: string
  ): Observable<any> {
    const url = "https://fcm.googleapis.com/fcm/send";

    const header = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization:
        "Key=AAAAD9Osuv0:APA91bElwVqzrUSQq342oAihXXC0i3B8540fnQZiXB9iq2_45jv6nwWMEdbN_dje8GsmrpoS9Hpf3kkAeo_vpjOnpiZrUdLua6xFuFfDWVQiENd3da7317m0vZ5-Nwah68zplPI0aRBc",
    });
    const httpOptions = {
      headers: header,
    };

    const body = {
      notification: {
        title,
        body: content,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon",
      },
      data: {
        mediumId,
      },
      to: "/topics/all",
      priority: "high",
      restricted_package_name: "",
    };

    return this.remoteSvrc.postHttp(url, body, header);
  }
}
