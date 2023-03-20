import { Injectable } from "@angular/core";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { ToastComponent } from "src/app/components/toastComponent";

export interface ChatTopic {
  id: string;
  subject: undefined | string;
}

export interface Chat {
  id: string | number;
  name: string;
  email: null | string | string[];
  phone: null | string | string[];
  photoUrl: undefined | string;
  welcomeMessage: undefined | string;
  image: undefined | null | string;
  configuration: undefined | null | string;
}

export interface SelectItem {
  label?: string;
  value: any;
  styleClass?: string;
  icon?: string;
  title?: string;
}

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private toast: ToastComponent) {}

  getChats(remoteSvrc: RemoteService, msgBody: any, apikey: string) {
    let self = this;
    let credentials = {};
    let url_p = AppConstants.URL_MOQUI_MATRIX_REST + "getChats";

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  getChatsGroup(remoteSvrc: RemoteService, msgBody: any, apikey: string) {
    let self = this;
    let credentials = {};
    let url_p = AppConstants.URL_MOQUI_GRP_MATRIX_REST + "getChats";

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  getOrStartConversation(
    remoteSvrc: RemoteService,
    msgBody: any,
    apikey: string
  ) {
    const credentials = {};
    const url_p = AppConstants.URL_MOQUI_MATRIX_REST + "getOrStartConversation";

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  getOrStartConversationGroup(
    remoteSvrc: RemoteService,
    msgBody: any,
    apikey: string
  ) {
    const credentials = {};
    const url_p =
      AppConstants.URL_MOQUI_GRP_MATRIX_REST + "getOrStartConversation";

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  getMessages(remoteSvrc: RemoteService, msgBody: any, apikey: string) {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_MATRIX_REST + "getMessages";
    let credentials = {};

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  getMessagesGroup(remoteSvrc: RemoteService, msgBody: any, apikey: string) {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_GRP_MATRIX_REST + "getMessages";
    let credentials = {};

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  sendMessage(remoteSvrc: RemoteService, msgBody: any, apikey: string) {
    let self = this;
    let credentials = {};
    let url_p = AppConstants.URL_MOQUI_MATRIX_REST + "sendMessage";

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "ChatService::sendMessage() Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  sendMessageGroup(remoteSvrc: RemoteService, msgBody: any, apikey: string) {
    let self = this;
    let credentials = {};
    let url_p = AppConstants.URL_MOQUI_GRP_MATRIX_REST + "sendMessage";

    return new Promise((resolve, reject) => {
      remoteSvrc.postHttpApikey(url_p, msgBody, credentials, apikey).subscribe(
        (data) => {
          resolve(data);
        },
        (err) => {
          this.toast.presentFailedToast(
            "ChatService::sendMessage() Server Error | " + JSON.stringify(err)
          );
        }
      );
    });
  }

  createChatIdsMatrix(numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
      var columns = [];
      for (var j = 0; j < numcols; ++j) {
        columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
  }

  createChatIdsArray(numrows, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
      arr[i] = initial;
    }
    return arr;
  }
}
