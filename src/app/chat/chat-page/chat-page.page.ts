import { Component, ElementRef, OnInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { IonContent, IonList, PopoverController } from "@ionic/angular";

import { timer, interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ChatService } from "../services/chat.service";
import { ChatPopoverComponent } from "../chat-popover/chat-popover.module";

@Component({
  selector: "app-chat-page",
  templateUrl: "./chat-page.page.html",
  styleUrls: ["./chat-page.page.scss"],
})
export class ChatPage implements OnInit {
  @ViewChild("contentchat", { static: true }) contentchat: IonContent;
  @ViewChild(IonList, { static: true, read: ElementRef }) ChatList: ElementRef;

  private mutationObserver: MutationObserver;

  appId = "";
  msgList: any;
  message: string;
  data: any;
  Me = "Me";
  Other = "Other";
  props: any;
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  recentChats: [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private remoteSvrc: RemoteService,

    private auth: AuthenticationService,
    private chatSvrc: ChatService,
    private popoverController: PopoverController,
    private events: Events
  ) {
    this.events.subscribe("chat:contactselected", (data: any) => {
      this.props = data.chat;
      this.getOrStartConversation(
        this.props.meUserId,
        this.props.otherUserId,
        this.props.id
      );
    });

    this.appId = AuthenticationService.env.appId;
  }

  chatListPage() {
    this.router.navigate(["/menu/chat-list"]);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      const params = this.router.getCurrentNavigation().extras.state;
      if (!params) {
        return;
      }

      this.props = params.chat;
      this.getOrStartConversation(
        this.props.meUserId,
        this.props.otherUserId,
        this.props.id
      );
    });

    this.getChats();
  }

  getChats() {
    const body = {
      userId: this.auth.getUserLogin().userId,
      appId: this.appId,
    };
    const apiKey = this.auth.getUserLogin().apikey;
    this.chatSvrc.getChats(this.remoteSvrc, body, apiKey).then((res: any) => {
      this.recentChats = res.chats;
    });
  }

  async settingsPopover(ev: any): Promise<void> {
    const siteInfo = { id: 1, name: "edupala" };
    const popover = await this.popoverController.create({
      component: ChatPopoverComponent,
      event: ev,
      cssClass: "popover_setting",
      componentProps: {
        recentChats: this.recentChats,
        onClick: () => {
          popover.dismiss();
        },
      },
      translucent: false,
    });
    popover.onDidDismiss().then((result) => {});

    return await popover.present();
  }

  sendMsg() {
    if (this.message === "") {
      return;
    }

    const meMsg = {
      message: this.message,
      whichUser: "Me",
    };

    const msgBody = {
      convMsg: this.message,
    };

    if (Utils.stringNotEmpty(this.props.id)) {
      msgBody["chatId"] = this.props.id;
    } else {
      msgBody["meUserId"] = this.props.meUserId;
      msgBody["otherUserId"] = this.props.otherUserId;
    }

    const apiKey = this.auth.getUserLogin().apikey;

    this.chatSvrc
      .sendMessage(this.remoteSvrc, msgBody, apiKey)
      .then((data: any) => {
        this.message = "";
      });
  }

  computeAgeDifference(age: string) {
    const diff = Date.now() - parseInt(age, 10);
    const date = new Date(diff);
    const day = new Date().getDate() - date.getDate();
    const sameMonth = new Date().getMonth() === date.getMonth();
    const sameYear = new Date().getFullYear() === date.getFullYear();

    if (sameYear && sameMonth && day === 0) {
      return "Today";
    } else if (sameYear && sameMonth && day === 1) {
      return "Yesterday";
    } else if (sameYear && sameMonth && day >= 2 && day <= 5) {
      return this.days[date.getDay()];
    } else {
      return (
        date.getUTCFullYear().toString() +
        "/" +
        (date.getUTCMonth() + 1).toString() +
        "/" +
        (date.getUTCDay() + 1).toString()
      );
    }
  }

  trackListFn(index: number, item: any) {}

  trackByFn(index, item) {
    return item ? item.id : index;
  }

  itemHeightFn(item, index) {
    return 75;
  }

  private getOrStartConversation(meUserId, otherUserId, chatId) {
    const msgBody = { chatId: chatId, appId: this.appId };
    const apiKey = this.auth.getUserLogin().apikey;
    this.chatSvrc
      .getOrStartConversation(this.remoteSvrc, msgBody, apiKey)
      .then((res: any) => {
        console.log("chat response ", JSON.stringify(res.msgmap.nextBatch));
        this.data = res.msgmap;

        this.poll();
      });
  }

  public intervallTimer = interval(5000);
  private subscription;

  private poll() {
    if (this.data != undefined) {
      this.subscription = this.intervallTimer
        .pipe(
          startWith(1000),
          switchMap(() => this.getMessages(this.data.nextBatch))
        )
        .subscribe((res: any) => {
          this.data.nextBatch = res.msgmap.nextBatch;
          this.data.msgList = [...this.data.msgList, ...res.msgmap.msgList];
        });
    }
  }

  private getMessages(batch: string) {
    const body = {
      chatId: this.props.id,
      from: batch,
      dir: "f",
    };

    console.log("Get messages body", JSON.stringify(body));

    const apiKey = this.auth.getUserLogin().apikey;
    return this.chatSvrc.getMessages(this.remoteSvrc, body, apiKey);
  }

  logout() {
    this.auth.ifLoggedOut();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  public ngAfterViewInit(): void {
    this.mutationObserver = new MutationObserver(
      (mutations: MutationRecord[]): void => {
        this.contentchat.scrollToBottom();
      }
    );
    this.mutationObserver.observe(this.ChatList.nativeElement, {
      childList: true,
    });
  }
}
