import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

import { interval, Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { Observable } from "RxJS/Rx";
import { OverlayEventDetail } from "@ionic/core";

import {
  ChatAdapter,
  ChatParticipantStatus,
  ChatParticipantType,
  IChatController,
  IChatParticipant,
  Message,
  MessageType,
  ParticipantResponse,
} from "ng-chat";

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as Models from "src/app/media/services/media-model.service";
import * as CModels from "src/app/base-services/common-service/models/common-model.service";

import { DcubeAdapter } from "src/app/chat/services/dcube-adapter";
import { DcubeGroupAdapter } from "src/app/chat/services/dcube-groupadapter";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ChatService } from "src/app/chat/services/chat.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { DcubecmsRemoteService } from "src/app/media/services/dcubecms-remote.service";

import { ClientRequestsService } from "src/app/service-request/services/clientrequests-service";
import { IClientRequests } from "src/app/base-services/common-service/models/common-model.service";
import {
  ClientRequests,
  ClientRequestInfo,
  UserChat,
  ProviderInfo,
  RequestInfoProvider,
  ServiceRequestStatus,
} from "src/app/base-services/common-service/models/common-model.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { AlertController, PopoverController } from "@ionic/angular";

import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { RateClientPage } from "src/app/recommendation/rate-client/rate-client.page";
import { RateProviderPage } from "src/app/recommendation/rate-provider/rate-provider.page";
import { RatingService } from "src/app/recommendation/services/rating.service";
import { ReplyRatingComponent } from "src/app/recommendation/reply-rating/reply-rating.component";
import { RatingObj } from "src/app/recommendation/services/rating.model.service";
import { ProviderDashboardPopoverComponent } from "src/app/provider-pages/provider-dashboard-popover/provider-dashboard-popover.component";
import {
  Apps,
  ContractActions,
} from "src/app/base-services/common-service/common.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { ProviderRequestsService } from "src/app/service-request/services/providerrequests-service";
import { ClientBidUpdateComponent } from "../client-bid-update/client-bid-update.component";
import { ContractActionComponent } from "src/app/service-request/contract-action/contract-action.component";

@Component({
  selector: "app-client-dashboard",
  templateUrl: "./client-dashboard.page.html",
  styleUrls: ["./client-dashboard.page.scss"],
})
export class ClientDashboardPage implements OnInit {
  @ViewChild("ngChatInstance", { static: true })
  ngChatInstance: IChatController;

  private id: string;
  public user = "John";
  chatData = new Map<string, any>();
  pollingData = new Map<string, any>();
  chatId = "";
  hideFriendsList = false;
  isLoading = false;
  isLoggedIn = false;
  public data: Models.UserStat;
  contactList: ParticipantResponse[] = null;
  private requestInfo: CModels.RequestInfo = null;

  appId = "";
  userId: string;
  apiKey: string;
  isChat = true;
  recentChats = [];
  adapter: DcubeAdapter;
  groupAdapter: DcubeGroupAdapter;
  myObs: Subscription;
  currentTheme = "dark-theme"; // light or dark
  audioEnabled = false;
  browserNotificationsEnabled = false;
  public title = "Chat";
  public isCollapsed = true;
  userPref: CModels.UserPrefs;
  private listRequests = new Array<ClientRequestInfo>();
  public clientRequests: IClientRequests = new ClientRequests();

  public clientPropertyRequests: CModels.clientPropertyRequest = null;
  public clientPropRequests: CModels.clientPropRequest[] = [];

  public DESCRIPTION_MAX_LENGHT = 400;
  private currentDesription: Array<string> = new Array<string>();
  public defaultPicture: string = "assets/avatar/blank.png";
  private inProgressDescription = "Chat in Progress";
  private inProgressStatus = "SRPCiP";

  private currentClientRequest: ClientRequestInfo = null;
  private currentProvider: ProviderInfo = null;
  public clientRequestStatus = CModels.ClientServiceRequestStatusEnum;
  public clientRequestSequence = CModels.ClientServiceRequestSequenceEnum;
  public providerRequestStatus = CModels.ProviderServiceRequestStatusEnum;
  public providerRequestSequence = CModels.ProviderServiceRequestSequenceEnum;
  navigation;

  stars = 0;
  public app = Apps;
  private currentRequest: CModels.ProviderRequest = null;

  public DESCRIPTION_MAX_LENGTH = 35;
  public DESCRIPTION_DISPLAY_LENGTH = 30;
  public descExpanded = false;

  public ppId: string;

  constructor(
    private route: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private router: Router,
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private clientRequestsService: ClientRequestsService,
    private chatSvrc: ChatService,

    private ratingSvrc: RatingService,
    private alertController: AlertController,

    private toastCtrl: ToastComponent,
    private providerRequestsService: ProviderRequestsService,
    private events: Events,
    private cd: ChangeDetectorRef
  ) {
    // this.navigation = this.router.getCurrentNavigation();

    this.appId = AuthenticationService.env.appId;

    let userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;
    this.userPref = this.auth.getUserLogin().userPrefs;
    if (this.userPref != undefined) {
      this.currentTheme =
        this.userPref.theme == "dark" ? "dark-theme" : "light-theme";
      this.browserNotificationsEnabled =
        this.userPref.browserNotificationsEnable == "Y" ? true : false;
      this.audioEnabled = this.userPref.audioEnabled == "Y" ? true : false;
    }
    this.adapter = new DcubeAdapter(userId, this.apiKey, remoteSvrc, chatSvrc);

    /* this.groupAdapter = new DcubeGroupAdapter(
      userId,
      this.apiKey,
      remoteSvrc,
      chatSvrc
    ); */

    // this.clientRequests.clientRequests = this.listRequests;
    // console.log("ClientDashboardPage::constructor() userLogin " + JSON.stringify(this.auth.getUserLogin()));
    // console.log("ClientDashboardPage::constructor() user "+ this.auth.getUserLogin().userId);
    // console.log("ClientDashboardPage::constructor() apikey " + this.auth.getUserLogin().apikey);

    this.events.subscribe("clientrequest:created", (data: any) => {
      this.retrieveClientRequests();
    });
  }

  ngOnDestroy() {
    for (let [key, value] of this.pollingData) {
      if (this.pollingData.get(key) != undefined) {
        this.pollingData.get(key).unsubscribe();
      }
    }
  }

  toggle() {
    this.descExpanded = !this.descExpanded;
  }

  ionViewDidEnter() {
    this.updateFriendList();
  }

  updateFriendList() {
    this.adapter.listFriends().subscribe((data) => {
      this.contactList = data as ParticipantResponse[];

      if (this.contactList.length > 0) {
        this.isCollapsed = false;
        this.isChat = true;
      } else {
        this.isChat = false;
      }
    });
  }
  getPicture(picture: string) {
    if (Utils.isStringEmpty(picture)) {
      return this.defaultPicture;
    } else {
      if (!picture.startsWith("http")) {
        return (
          AppConstants.URL_MOQUI_DUTILS_NOAUTH +
          "getResource?inline=true&pathname=" +
          picture
        );
      } else {
        return picture;
      }
    }
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    //this.user = this.auth.getUserLogin().userFullName;
    this.user = this.auth.getUserLogin().username;

    this.userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;

    this.retrieveClientRequests();
    /* 
    if (
      this.navigation &&
      this.navigation.extras &&
      this.navigation.extras.state
    ) {
      this.clientRequests.clientRequests =
        this.navigation.extras.state["clientRequests"];
      console.log(
        "ClientDashboardPage::ngOnInit() this.clientRequests.clientRequests: " +
          JSON.stringify(this.clientRequests.clientRequests)
      );
    } */
  }

  public messageSeen(event: any) {}

  onParticipantChatOpened(event: any) {
    this.chatId = event.id;
  }

  async clientChat(meUserId, otherUserId, requestId, serviceName, providerId) {
    let userExistAlread = false;

    if (!userExistAlread) {
      const msgBody = {
        meUserId: meUserId,
        otherUserId: otherUserId,
        requestId: requestId,
        serviceName: serviceName,
        appId: this.appId,
      };
      this.chatSvrc
        .getOrStartConversation(this.remoteSvrc, msgBody, this.apiKey)
        .then((resp: any) => {
          this.clientRequestsService
            .setRequestStatus(
              this.appId,
              requestId,
              meUserId,
              providerId,
              CModels.ClientServiceRequestStatusEnum.CONST_BID_IN_PROGRESS,
              CModels.ProviderServiceRequestStatusEnum.CONST_CHAT_IN_PROGRESS,
              this.apiKey,
              this.remoteSvrc
            )
            .subscribe((data) => {
              if (data.httpStatus === "200") {
                this.retrieveClientRequests();
              }
            });

          this.updateFriendList();
        });
    } else {
      this.clientRequestsService
        .setRequestStatus(
          this.appId,
          requestId,
          meUserId,
          providerId,
          CModels.ClientServiceRequestStatusEnum.CONST_BID_IN_PROGRESS,
          CModels.ProviderServiceRequestStatusEnum.CONST_CHAT_IN_PROGRESS,
          this.apiKey,
          this.remoteSvrc
        )
        .subscribe((data) => {
          if ((<any>data).httpStatus === "200") {
            let clientRequest = this.getClientRequest(requestId);
            if (clientRequest != null) {
              for (let pr of clientRequest.providers) {
                if (providerId == pr.requestInfoProvider.providerId) {
                  pr.requestInfoProvider.serviceRequestProviderStatus.statusId =
                    this.inProgressStatus;
                  pr.requestInfoProvider.serviceRequestProviderStatus.statusNum =
                    CModels.ProviderServiceRequestSequenceEnum.CONST_CHAT_IN_PROGRESS;
                  pr.requestInfoProvider.serviceRequestProviderStatus.description =
                    this.inProgressDescription;
                  break;
                }
              }
            }
          }
        });
    }
  }

  public onParticipantChatClosed(event: any) {
    this.hideFriendsList = false;

    if (this.pollingData.get(event.id) != undefined) {
      this.pollingData.get(event.id).unsubscribe();
    }
  }

  public onParticipantClicked(event: any): void {
    this.hideFriendsList = true;
    this.getOrStartConversation(event.id, event.participantType);
  }

  public getMessagesObservable(batch: string, chatId: any) {
    const msgBody = {
      chatId: chatId,
      from: batch,
      dir: "f",
    };

    let credentials = {};
    let url_p = AppConstants.URL_MOQUI_MATRIX_REST + "getMessages";

    return this.remoteSvrc
      .postHttpApikey(url_p, msgBody, credentials, this.apiKey)
      .delay(Math.round(Math.random() * 5000));
  }

  getPollData(chatId) {
    if (this.chatData.get(chatId) != undefined) {
      return this.getMessagesObservable(
        this.chatData.get(chatId).nextBatch,
        chatId
      ).concat(
        Observable.timer(5000).switchMap(() => this.getPollData(chatId))
      );
    }
  }

  public getOrStartConversation(chatId, type) {
    let self = this;
    const msgBody = { chatId: chatId, appId: this.appId };
    if (type == 1) {
      this.chatSvrc
        .getOrStartConversationGroup(this.remoteSvrc, msgBody, this.apiKey)
        .then((resp: any) => {
          if ((<any>resp).httpStatus === "200") {
            this.chatData.set(chatId, resp.msgmap);

            this.poll(chatId, type);
          }
        });
    } else {
      this.chatSvrc
        .getOrStartConversation(this.remoteSvrc, msgBody, this.apiKey)
        .then((resp: any) => {
          if ((<any>resp).httpStatus === "200") {
            this.chatData.set(chatId, resp.msgmap);

            this.poll(chatId, type);
          }
        });
    }
  }

  private poll(chatId, type) {
    if (this.chatData.get(chatId) != undefined) {
      this.pollingData.set(
        chatId,
        Observable.interval(5000)
          .pipe(
            startWith(1000),
            switchMap(() =>
              this.getMessages(
                this.chatData.get(chatId).nextBatch,
                chatId,
                type
              )
            )
          )
          .subscribe((res: any) => {
            // this.chatData.get(chatId).nextBatch = res.msgmap.end;

            this.chatData.set(chatId, res.msgmap);

            let user = this.adapter.chatList.find(
              (x) => x.participant.id == chatId
            );

            let msgList = res.msgmap.msgList;
            for (let i = 0; i < msgList.length; i++) {
              const msg = new Message();
              const item = msgList[i];

              if (res.fromId != item.fromId) {
                msg.type = MessageType.Text;
                msg.fromId = item.fromId;
                msg.toId = item.toId;
                msg.message = item.message;
                msg.dateSent = item.dateSent;
                msg.dateSeen = item.dateSeen;

                this.adapter.onMessageReceived(user.participant, msg);
              }
            }
          })
      );
    }
  }

  ionViewWillLeave() {
    if (this.pollingData.get(this.chatId) != undefined) {
      this.pollingData.get(this.chatId).unsubscribe();
    }
  }

  public getMessages(batch: string, chatId: any, type: any) {
    const body = {
      chatId: chatId,
      from: batch,
      dir: "f",
    };

    if (type == 1) {
      return this.chatSvrc.getMessagesGroup(this.remoteSvrc, body, this.apiKey);
    } else {
      return this.chatSvrc.getMessages(this.remoteSvrc, body, this.apiKey);
    }
  }

  isFlagSet(statusNumber: number, flag: number): boolean {
    let compose = statusNumber & flag;
    let value = flag === compose ? true : false;
    return value;
  }

  isStatusLessThan(
    statusNumber: number,
    flag: number,
    equal: boolean
  ): boolean {
    let value: boolean;
    if (equal) {
      value = statusNumber <= flag ? true : false;
    } else {
      value = statusNumber < flag ? true : false;
    }
    return value;
  }

  isStatusGreaterEqual(
    statusNumber: number,
    flag: number,
    equal: boolean
  ): boolean {
    let value: boolean;
    if (equal) {
      value = statusNumber >= flag ? true : false;
    } else {
      value = statusNumber > flag ? true : false;
    }
    //console.log(" isStatusGreaterEqual: status "+ statusNumber + "flag " + " result "+ value);
    return value;
  }

  isLongMessage(request: ClientRequestInfo, provider: ProviderInfo): boolean {
    let msgSize = 0;
    if (provider.requestInfoProvider.bidInfo.bidComment != null) {
      msgSize = +provider.requestInfoProvider.bidInfo.bidComment.length;
    }
    msgSize = +request.requestInfo.serviceDescription?.length;
    if (msgSize > this.DESCRIPTION_MAX_LENGHT) {
      return true;
    }
    return false;
  }

  getProviderLastMessage(
    request: ClientRequestInfo,
    provider: ProviderInfo
  ): Array<string> {
    let message = new Array<string>();
    if (provider.requestInfoProvider.bidInfo.bidComment != null) {
      message[0] = provider.requestInfoProvider.bidInfo.bidComment;
      message[1] = request.requestInfo.serviceDescription;
    } else {
      message[0] = request.requestInfo.serviceDescription;
    }
    //let statusNum = provider.requestInfoProvider.serviceRequestProviderStatus.statusNum;
    //   if(statusNum != null && statusNum !=0 ){
    //
    //   }
    return message;
  }

  setDescription(request: ClientRequestInfo, provider: ProviderInfo) {
    let message = new Array<string>();
    if (provider.requestInfoProvider.bidInfo.bidComment != null) {
      message[0] = provider.requestInfoProvider.bidInfo.bidComment;
      message[1] = request.requestInfo.serviceDescription;
    } else {
      message[0] = request.requestInfo.serviceDescription;
    }
    this.currentDesription = message;
  }

  async initAwardDialogBox(request: ClientRequestInfo, provider: ProviderInfo) {
    this.currentClientRequest = request;
    this.currentProvider = provider;

    const alert = await this.alertController.create({
      header: "Award Contract",
      message:
        "Are you sure you want to award this request : " +
        this.currentClientRequest.requestInfo.requestId +
        " to provider " +
        this.currentProvider.basicProfile.fullName,
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: () => {
            this.submitAward();
          },
        },
      ],
    });
    await alert.present();
  }

  async rateProvider(event, ratedId, requestId, ppId) {
    // this.currentClientRequest = request;
    const popover = await this.popoverCtrl.create({
      component: RateProviderPage,
      componentProps: {
        ratedId: ratedId,
        requestId: requestId,
        ppId: ppId,
        isPopOver: true,
      },
      cssClass: "bottom-sheet-popover",
      event: event,
      translucent: true,
    });
    return popover.present();
  }

  async viewRequesRating(event, requestId, providerId, ppId) {
    let msgBody = {
      appId: this.appId,
      userId: this.userId,
      requestId: requestId,
    };

    this.ratingSvrc.getUserRating(msgBody).subscribe((data) => {
      if (data.httpStatus === "200") {
        let userRating = data.UserRatings[0];
        if (userRating == null) {
          userRating = {
            ratedId: providerId,
            requestId: requestId,
            appId: this.appId,
            stars: 0,
            userId: this.userId,
            ppId: ppId,
          };
        }
        userRating.ppId = ppId;
        userRating.ratedId = providerId;
        userRating.userId = this.userId;

        this.showReplyRatingPopover(event, userRating);
      }
    });
  }

  async showReplyRatingPopover(event: any, userRating: RatingObj) {
    const popover = await this.popoverCtrl.create({
      component: ReplyRatingComponent,
      componentProps: {
        UserRating: userRating,
        isPopOver: true,
        UserType: CModels.UserType.CLIENT,
      },
      cssClass: "bottom-sheet-popover",
      event: event,
      translucent: true,
    });
    return popover.present();
  }

  async signContractDialogBox(
    request: ClientRequestInfo,
    provider: ProviderInfo
  ) {
    this.currentClientRequest = request;
    this.currentProvider = provider;

    /*  const alert = await this.alertController.create({
      header: "Sign Contract",
      message: "Are you sure you want to sign this contract ?",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: () => {
            this.signContract();
          },
        },
      ],
    });
    await alert.present(); */

    const popover = await this.popoverCtrl.create({
      component: ContractActionComponent,
      componentProps: {
        appId: this.appId,
        requestId: provider.requestInfoProvider.requestId,
        pqueryId: request.requestInfo.pqueryId,
        ppId: request.requestInfo.ppId,
        clientId: request.requestInfo.clientId,
        providerId: provider.requestInfoProvider.providerId,
        contractAction: ContractActions.SIGN,
        isPopOver: true,
      },
      cssClass: "bottom-sheet-popover",
      event: event,
      translucent: true,
    });

    popover.onDidDismiss().then((detail: OverlayEventDetail) => {
      /*  if (detail !== null && detail.data !== null) {
        let submit = detail.data.submit;
      
        if (undefined != submit && submit == "true") {
         
          this.retrieveClientRequests();
        }
      } */
    });

    return await popover.present();
  }

  async signContractDialogBox_Property(
    request: CModels.ProviderRequest,
    requestInfo: any
  ) {
    this.currentRequest = request;

    const popover = await this.popoverCtrl.create({
      component: ContractActionComponent,
      componentProps: {
        requestId: requestInfo.requestId,
        ppId: requestInfo.ppId,
        clientId: requestInfo.clientId,
        appId: this.appId,
        pqueryId: requestInfo.pqueryId,
        providerId: requestInfo.providerId,
        title: "Sign Contract",
        contractAction: ContractActions.SIGN,
      },
      cssClass: "bottom-sheet-popover",

      translucent: true,
    });

    popover.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null && detail.data !== null) {
        let submit = detail.data.submit;
      }
    });

    return await popover.present();
  }

  async workInProgressDialogBox(
    request: ClientRequestInfo,
    provider: ProviderInfo
  ) {
    this.currentClientRequest = request;
    this.currentProvider = provider;

    const alert = await this.alertController.create({
      header: "Update Status",
      message: "Are you sure you want to update status to work in Progress ?",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: () => {
            this.updateClientRequestStatus(
              CModels.ClientServiceRequestStatusEnum.CONST_WORK_IN_PROGRESS
            );
          },
        },
      ],
    });
    await alert.present();
  }

  async completedDialogBox(request: ClientRequestInfo, provider: ProviderInfo) {
    this.currentClientRequest = request;
    this.currentProvider = provider;

    const alert = await this.alertController.create({
      header: "Update Status",
      message: "Are you sure you want to update status to Completed ?",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: () => {
            this.updateClientRequestStatus(
              CModels.ClientServiceRequestStatusEnum.CONST_REQUEST_COMPLETED
            );

            this.updateProviderRequestStatus(
              CModels.ProviderServiceRequestStatusEnum.CONST_REQUEST_COMPLETED
            );
          },
        },
      ],
    });
    await alert.present();
  }

  updateClientRequestStatus(statusId: string) {
    this.clientRequestsService
      .setClientRequestStatus(
        this.appId,
        this.currentClientRequest.requestInfo.requestId,
        this.currentClientRequest.requestInfo.clientId,
        this.currentProvider.requestInfoProvider.providerId,
        statusId,
        this.auth.getUserLogin().apikey,
        this.remoteSvrc
      )
      .subscribe((data) => {
        if ((<any>data).httpStatus === "200") {
          this.retrieveClientRequests();
        }
      });
  }

  updateProviderRequestStatus(statusId: string) {
    this.clientRequestsService
      .setProviderRequestStatus(
        this.appId,
        this.currentClientRequest.requestInfo.requestId,
        this.currentClientRequest.requestInfo.clientId,
        this.currentProvider.requestInfoProvider.providerId,
        statusId,
        this.auth.getUserLogin().apikey,
        this.remoteSvrc
      )
      .subscribe((data) => {
        if ((<any>data).httpStatus === "200") {
          //this.retrieveClientRequests();
        }
      });
  }

  updateClientPropertyRequestStatus(statusId: string, clientId: string) {
    this.clientRequestsService
      .setClientPropertyRequestStatus(
        this.appId,
        this.requestInfo.requestId,
        this.requestInfo.providerId,
        statusId,
        clientId,
        this.requestInfo.pqueryId,
        this.auth.getUserLogin().apikey,
        this.remoteSvrc
      )
      .subscribe((data) => {
        if ((<any>data).httpStatus === "200") {
          this.retrieveClientRequests();
        }
      });
  }

  async completedPropertyDialogBox(
    request: CModels.RequestInfo,
    clientId: string
  ) {
    this.requestInfo = request;

    const alert = await this.alertController.create({
      header: "Update Status",
      message: "Are you sure you want to update status to Completed ?",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: () => {
            this.updateClientPropertyRequestStatus(
              CModels.ClientServiceRequestStatusEnum.CONST_REQUEST_COMPLETED,
              clientId
            );
          },
        },
      ],
    });
    await alert.present();
  }

  /* signContract_Property() {
    this.clientRequestsService
      .signContract_Property(
        this.appId,
        this.currentRequest.requestInfo.ppId,
        this.currentRequest.requestInfo.requestId,
        this.currentRequest.PropertyQueryInfo.pqueryId,
        new Date(),
        this.auth.getUserLogin().userFullName,
        this.auth.getUserLogin().apikey,
        this.remoteSvrc
      )
      .subscribe((data) => {
        if ((<any>data).httpStatus === "200") {
          this.retrieveClientRequests();
        }
      });
  } */

  submitAward() {
    this.clientRequestsService
      .awardBid(
        this.remoteSvrc,
        this.appId,
        this.currentProvider.requestInfoProvider.providerId,
        this.currentClientRequest.requestInfo.requestId,
        this.auth.getUserLogin().apikey
      )
      .then((data) => {
        if ((<any>data).httpStatus === "200") {
          this.retrieveClientRequests();
        }
      })
      .catch((err) => {});
  }

  retrieveClientRequests() {
    this.clientRequestsService
      .getServiceClientRequests(
        this.remoteSvrc,
        this.auth.getUserLogin(),
        this.appId
      )
      .then((data) => {
        if (this.appId == this.app.OBRA) {
          this.clientPropRequests = data["clientRequests"];

          console.log(
            "clientPropertyRequests -Gilbert" +
              JSON.stringify(this.clientPropRequests)
          );
        } else {
          this.clientRequests = <IClientRequests>data;
        }
      })
      .catch((err) => {
        console.log(
          "ClientDashboardPage::constructor() err " + JSON.stringify(err)
        );
      });
  }

  getClientRequest(requestId: string): ClientRequestInfo {
    if (null != this.clientRequests.clientRequests) {
      for (let clientRequest of this.clientRequests.clientRequests) {
        if (requestId == clientRequest.requestInfo.requestId) {
          return clientRequest;
        }
      }
    }
    return null;
  }

  ratingChange(stars) {
    this.stars = stars;
  }

  showBid(
    event,
    provider: CModels.ProviderRequest,
    request: CModels.clientPropRequest
  ) {
    this.currentRequest = provider;
    this.currentRequest.requestInfo = request.requestInfo;
    this.presentPopover(event, provider);
  }

  async presentPopover(
    ev,
    requestdetail: CModels.ProviderRequest
  ): Promise<void> {
    let self = this;
    let statusNum =
      requestdetail.requestInfoProvider.serviceRequestProviderStatus.statusNum;

    // let clientStatusNum = request.requestInfo.serviceRequestStatus.statusNum;

    let title = "Bid on Request";
    if (
      statusNum >= this.providerRequestSequence.CONST_CHAT_IN_PROGRESS &&
      statusNum < this.providerRequestSequence.CONST_REQUEST_AWARDED
    ) {
      title = "Sign Contract";
    } else {
      if (
        statusNum >= this.providerRequestSequence.CONST_BID_IN_PROGRESS &&
        statusNum < this.providerRequestSequence.CONST_SUBMIT_BID
      ) {
        title = "Rebid on Request";
      }
    }
    const popover = await this.popoverCtrl.create({
      component: ClientBidUpdateComponent,

      componentProps: {
        pqueryId: requestdetail.requestInfo.pqueryId,
        requestId: requestdetail.requestInfo.requestId,
        ppId: requestdetail.requestInfo.ppId,
        clientId: requestdetail.requestInfo.clientId,
        providerId: requestdetail.requestInfo.providerId,
        title: title,
        request: requestdetail,
      },
      cssClass: "bottom-sheet-popover",
      event: ev,
      translucent: true,
    });

    popover.onDidDismiss().then((detail: OverlayEventDetail) => {
      //this.cd.detectChanges();
    });

    return await popover.present();
  }

  postBid() {
    //save bid
    this.currentRequest.requestInfo.userId = this.userId;
    this.currentRequest.requestInfo.appId = this.appId;
  }
}
