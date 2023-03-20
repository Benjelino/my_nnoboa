import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { Utils } from "src/app/base-services/utility-services/utils";

import {
  ChatAdapter,
  IChatGroupAdapter,
  User,
  Group,
  Message,
  ChatParticipantStatus,
  ParticipantResponse,
  ChatParticipantType,
  MessageType,
} from "ng-chat";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";

import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { ChatService } from "./chat.service";
import { Chat, ChatResponse } from "src/app/chat/services/chat-model.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

export class DcubeAdapter extends ChatAdapter implements IChatGroupAdapter {
  public chatList: ParticipantResponse[] = [];
  private chatType = 0;
  appId = "";

  imageUrl = `${AppConstants.URL_MOQUI_DUTILS_NOAUTH}getResource?inline=true&pathname=`;

  constructor(
    private userId: string,
    private apikey: string,
    private remoteSvrc: RemoteService,
    private chatSvrc: ChatService,
    private http?: HttpClient
  ) {
    super();
    this.userId = userId;
    this.apikey = apikey;
    this.appId = AuthenticationService.env.appId;
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return this.getChatList();
  }

  private getChatList(): Observable<ParticipantResponse[]> {
    //let self = this;
    let credentials = {};
    let url_p = AppConstants.URL_MOQUI_MATRIX_REST + "getChats";

    const msgBody = {
      userId: this.userId,
      appId: this.appId,
    };

    return this.remoteSvrc
      .postHttpApikey(url_p, msgBody, credentials, this.apikey)
      .pipe(
        map((resp: ChatResponse) =>
          resp.chats.map((item: Chat) => {
            const model = new ParticipantResponse();
            let user = {
              id: item.id,
              participantType:
                item.participantType == "User"
                  ? ChatParticipantType.User
                  : ChatParticipantType.Group,
              displayName: item.displayName,
              avatar: item.avatar.startsWith("http")
                ? item.avatar
                : this.imageUrl + item.avatar,
              status: ChatParticipantStatus.Online,
            };

            if (user.participantType == ChatParticipantType.Group) {
              let userAsGroup = user as Group;
              let groupUsers: User[] = [];

              for (const el of item.Members) {
                let groupUser = {
                  id: el.userId,
                  participantType: ChatParticipantType.User,
                  displayName: el.displayName,
                  avatar: el.avatar.startsWith("http")
                    ? el.avatar
                    : this.imageUrl + el.avatar,
                  status: ChatParticipantStatus.Online,
                };
                groupUsers.push(groupUser);
              }

              userAsGroup.chattingTo = groupUsers;

              model.participant = userAsGroup;
            } else {
              if (item.status != undefined) {
                user.status =
                  item.status.presence == "online"
                    ? ChatParticipantStatus.Online
                    : ChatParticipantStatus.Offline;
              }

              model.participant = user;
            }

            this.chatList.push(model);
            return model;
          })
        )
      );
  }

  // used for testing authentication issues
  // where Google Chrome behaves strange sometimes because
  // DcubecmsRemoteService and RemoteService use different HttpClients
  private getChatListTest(): Observable<ParticipantResponse[]> {
    let credentials = {};
    let msgBody = { userId: this.userId, appId: this.appId };
    let url = AppConstants.URL_MOQUI_MATRIX_REST + "getChats";
    const header = this.remoteSvrc.getRequestOptionsArgs(
      credentials,
      this.apikey
    );

    const httpOptions = {
      headers: header,
    };

    return this.http.post<ChatResponse>(url, msgBody, httpOptions).pipe(
      map((resp: ChatResponse) =>
        resp.chats.map((item: Chat) => {
          const model = new ParticipantResponse();
          let user = {
            id: item.id,
            participantType: ChatParticipantType.User,
            displayName: item.displayName,
            avatar: item.avatar.startsWith("http")
              ? item.avatar
              : this.imageUrl + item.avatar,
            status: ChatParticipantStatus.Online,
          };
          model.participant = user;
          this.chatList.push(model);
          return model;
        })
      )
    );
  }

  chatHistory: Array<Message> = [];

  getMessageHistory(chatId: any): Observable<Message[]> {
    let self = this;
    let credentials = {};

    for (const el of this.chatList) {
      if (el.participant.id == chatId) {
        if (el.participant.participantType == ChatParticipantType.Group) {
          this.chatType = 1;
        } else {
          this.chatType = 0;
        }
        break;
      }
    }

    if (this.chatType == 1) {
      this.getOrStartConversationGroup(chatId);
    } else {
      this.getOrStartConversation(chatId);
    }

    return of(this.chatHistory).pipe(delay(2000));
  }

  getOrStartConversation(chatId): void {
    let self = this;
    const msgBody = { chatId: chatId, appId: this.appId };

    this.chatSvrc
      .getOrStartConversation(this.remoteSvrc, msgBody, this.apikey)
      .then((resp: any) => {
        if ("200" == resp.httpStatus) {
          let msgList = resp.msgmap.msgList;
          for (let i = 0; i < msgList.length; i++) {
            const msg = new Message();
            const item = msgList[i];
            msg.type = MessageType[<string>item.type];
            msg.fromId = item.fromId;
            msg.toId = item.toId;
            msg.message = item.message;
            msg.dateSent = item.dateSent;
            msg.dateSeen = item.dateSeen;

            self.chatHistory.push(msg);
          }
        }
      });
  }

  getOrStartConversationGroup(chatId): void {
    let self = this;
    const msgBody = { chatId: chatId, appId: this.appId };

    this.chatSvrc
      .getOrStartConversationGroup(this.remoteSvrc, msgBody, this.apikey)
      .then((resp: any) => {
        if ("200" == resp.httpStatus) {
          let msgList = resp.msgmap.msgList;
          for (let i = 0; i < msgList.length; i++) {
            const msg = new Message();
            const item = msgList[i];
            msg.type = MessageType[<string>item.type];
            msg.fromId = item.fromId;
            msg.toId = item.toId;
            msg.message = item.message;
            msg.dateSent = item.dateSent;
            msg.dateSeen = item.dateSeen;

            self.chatHistory.push(msg);
          }
        }
      });
  }

  sendMessage(message: Message): void {
    setTimeout(() => {
      const msgBody = {
        convMsg: message.message,
      };
      msgBody["chatId"] = message.toId;

      for (const el of this.chatList) {
        if (el.participant.id == message.toId) {
          if (el.participant.participantType == ChatParticipantType.Group) {
            this.chatType = 1;
          } else {
            this.chatType = 0;
          }
          break;
        }
      }
      if (this.chatType == 1) {
        this.chatSvrc
          .sendMessageGroup(this.remoteSvrc, msgBody, this.apikey)
          .then((data: any) => {});
      } else {
        this.chatSvrc
          .sendMessage(this.remoteSvrc, msgBody, this.apikey)
          .then((data: any) => {});
      }
    }, 1000);
  }

  groupCreated(group: Group): void {}
}
