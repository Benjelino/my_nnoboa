import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IAppLocale, IPartyContactProfile, PartyContactProfile } from "src/app/base-services/common-service/models/common-model.service";

import { URL_MOQUI_DUTILS_NOAUTH } from "src/app/base-services/common-service/app-constants/app-constants.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ProfileService } from "../services/profile.service";

const DEFAULT_COUNTRY = "Ghana";
const DEFAULT_COUNTRY_CODE = "GHA";


@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",

  styleUrls: [
    "./styles/user-profile.page.scss",
    "./styles/user-profile.shell.scss",
    "./styles/user-profile.ios.scss",
    "./styles/user-profile.md.scss",
  ],
})
export class ProfilePage implements OnInit {
  partyContactProfile: IPartyContactProfile = new PartyContactProfile();
  appLocale: IAppLocale = AuthenticationService.env.appLocale;

  isPerson = true;
  avatar: any;
  logo: any;
  resourceUrl = `${URL_MOQUI_DUTILS_NOAUTH}getResource?inline=true&pathname=`;

  imageUrl=URL_MOQUI_DUTILS_NOAUTH + "getResource?inline=true&pathname=dbresource://dcube-utils/sabonay_logo.png"

  selectedCountry: string = DEFAULT_COUNTRY;
  countryCode: string = DEFAULT_COUNTRY_CODE;

  constructor(private router: Router, 
    private psprof: ProfileService,private toast: ToastComponent) {
    let self = this;

    if (undefined != this.appLocale) {
      this.selectedCountry = this.appLocale.appCountry;
      this.countryCode = this.appLocale.appCountryCode;
    } else {
      this.selectedCountry = DEFAULT_COUNTRY;
      this.countryCode = DEFAULT_COUNTRY_CODE;
    }

    this.psprof.getPartyContactProfile().then(
      (data) => {
        self.partyContactProfile = <IPartyContactProfile>data;
        //console.log("ProfilePage::constructor() self.partyContactProfile: " + JSON.stringify(self.partyContactProfile));
        if (!self.partyContactProfile.userProfile.countryCode) {
          self.partyContactProfile.userProfile.countryCode = self.countryCode;
        }

        if (
          self.partyContactProfile.party.isPerson != undefined &&
          self.partyContactProfile.party.isPerson == "N"
        ) {
          self.isPerson = false;
        } else {
          self.isPerson = true;
        }

        if (self.partyContactProfile.userProfile.userLogo != undefined) {
          if (
            !self.partyContactProfile.userProfile.userLogo.startsWith("http")
          ) {
            self.logo =
            self.resourceUrl + this.partyContactProfile.userProfile.userLogo;
          } else {
            self.logo = this.partyContactProfile.userProfile.userLogo;
          }
        }

        if (self.partyContactProfile.userProfile.photoUrl != undefined) {
          if (
            !self.partyContactProfile.userProfile.photoUrl.startsWith("http")
          ) {
            self.avatar =
            self.resourceUrl + self.partyContactProfile.userProfile.photoUrl;
          } else {
            self.avatar = self.partyContactProfile.userProfile.photoUrl;
          }
        }
      },
      (err) => {
        this.toast.presentFailedToast("ProfilePage::constructor() err: " + JSON.stringify(err));
      }
    );
  }

  ngOnInit() {}

  gotoEdit() {
    this.router.navigate(["/menu/profile-form"], {
      state: { partyContactProfile: this.partyContactProfile }
      });
  }

}
