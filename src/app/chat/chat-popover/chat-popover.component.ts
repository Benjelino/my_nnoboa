import { Component, Input, OnInit } from "@angular/core";

import { NavigationExtras, Router } from "@angular/router";

import { Events } from "src/app/base-services/publish-subscribe/events.service";

@Component({
  selector: "app-chat-popover",
  templateUrl: "./chat-popover.component.html",
  styleUrls: ["./chat-popover.component.scss"],
})
export class ChatPopoverComponent implements OnInit {
  recentChats: any;
  @Input()
  public onClick = () => {};

  constructor(
    private router: Router,
    private events: Events
  ) {}

  ngOnInit() {}

  openPreviousChat(chat: any) {
    
    const data: NavigationExtras = { state: { chat } };
    this.router.navigateByUrl("menu/chat", data);
    this.events.publish("chat:contactselected", {
      chat: chat,
      time: new Date(),
    });
    this.afterClick();
  }

  afterClick() {
    this.onClick();
  }
}
