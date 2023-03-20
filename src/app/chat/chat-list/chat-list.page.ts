import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { PopoverController } from "@ionic/angular";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ChatService } from "../services/chat.service";
import { ChatPopoverComponent } from "../chat-popover/chat-popover.module";

@Component({
  selector: "app-chat-list",
  templateUrl: "./chat-list.page.html",
  styleUrls: ["./chat-list.page.scss"],
})
export class ChatListPage implements OnInit {
  recentChats: [];
  appId = "";

  constructor(
    private router: Router,
    private chatService: ChatService,
    private remoteSvrc: RemoteService,
    private auth: AuthenticationService,
    private popoverController: PopoverController
  ) {
    this.appId = AuthenticationService.env.appId;
  }

  ngOnInit() {
    this.getChats();
  }

  openPreviousChat(chat: any) {
    const data: NavigationExtras = { state: { chat } };
    this.router.navigateByUrl("menu/chat", data);
  }

  showPopup() {
    this.router.navigateByUrl("menu/chat-contacts");
  }

  async settingsPopover(ev: any) {
    const siteInfo = { id: 1, name: "edupala" };
    const popover = await this.popoverController.create({
      component: ChatPopoverComponent,
      event: ev,
      cssClass: "popover_setting",
      componentProps: {
        site: siteInfo,
        foo: "hello",
        bar: "world",
        userId: this.auth.getUserLogin().userId,
        apikey: this.auth.getUserLogin().apikey,
        recentChats: this.recentChats,
      },
      translucent: false,
    });
    popover.onDidDismiss().then((result) => {});

    return await popover.present();
  }

  getChats() {
    const body = {
      userId: this.auth.getUserLogin().userId,
      appId:this.appId
    };
    const apiKey = this.auth.getUserLogin().apikey;
    this.chatService
      .getChats(this.remoteSvrc, body, apiKey)
      .then((res: any) => {
        this.recentChats = res.chats;
      });
  }

  logout() {
    this.auth.ifLoggedOut();
  }
}
