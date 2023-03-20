import { Component, OnInit } from "@angular/core";
import { Router, RouterEvent } from "@angular/router";

import { MenuController } from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { IMenuItem, MenuService } from 'src/app/auth/auth-service/menu.service';

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
})
export class MenuPage implements OnInit {
  //activePath = "";

  pages: IMenuItem[] = [];
  pagesAllowList: IMenuItem[] = [
    // {
    //   title: "Dashboard",
    //   url: "/menu/client-dashboard",
    //   icon: "speedometer",
    // },

    {
      title: "Home",
      url: "/menu/home",
      icon: "home",
    },

    {
      title: "User Tools",
      children: [
        {
          title: "Change Password",
          url: "/menu/change-password",
          icon: "send",
        },
        {
          title: "Profile",
          url: "/menu/profile",
          icon: "people-circle",
        },
      ],
    },

    {
      title: "Messaging",
      children: [
        {
          title: "Contact Us",
          url: "/menu/contactus",
          icon: "chatbubbles-outline",
        },

        {
          title: "Contact Messages",
          url: "/menu/contactusinfo",
          icon: "call-outline",
          allowList: ['ADMIN', 'DACUSTCARE'],
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private menuSrvc: MenuService,
    private menu: MenuController
  ) {
    this.pages = this.menuSrvc.getAllowMenuList( this.pagesAllowList );
  }

  ngOnInit() { }

  closeMenu() {
    this.menu.close();
  }

  logout() {
    this.auth.ifLoggedOut();
  }
  
}
