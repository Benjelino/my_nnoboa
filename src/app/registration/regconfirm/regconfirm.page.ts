import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AlertController } from "@ionic/angular";

import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

import { RemoteService } from "src/app/base-services/remote-service/remote-service.module";
import { CommonService } from "src/app/base-services/common-service/common-service.module";
import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";

import { Utils } from 'src/app/base-services/utility-services/utils';


@Component({
  selector: 'app-regconfirm',
  templateUrl: './regconfirm.page.html',
  styleUrls: ['./regconfirm.page.scss'],
})
export class RegconfirmPage implements OnInit {
  userId: string = "";
  isLoggedIn = false;
  regData: any = null;
  confirmOtp : boolean = false;
  confirmEmail : boolean = false;
  receivedOtp : string = '';

  credentials = null;


  constructor(private router: Router,
    private alertCtrl: AlertController,
    private auth: AuthenticationService,
    private commonSvrc: CommonService,
    private remoteSvrc: RemoteService) { 
    if ( null != auth ) {
      let authObj = auth.getUserLogin();
      //console.log("RegconfirmPage::constructor() authObj: " + JSON.stringify(authObj));
      if ( null != authObj ) {
        let regOtp = authObj.regOtp;
        if ( (null != regOtp) && ("Y" == regOtp)  ) {
          this.confirmOtp = true;
        } else {
          this.confirmEmail = true;
        }
      }
    }
      
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    
    this.userId = this.auth.getUserLogin().userId;
  }

  getTranslate(ptitle) {
    return this.commonSvrc.translateString(ptitle);
  }


  requestEmailConfirmation() {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_DCUBEAUTH + "requestEmailConfirmation";
    let titleSuccess = "Successfully sent registration code.";

    let u_id = this.auth.getUserLogin().userId;
    if ( Utils.stringNotEmpty(u_id) ) {
      let msgBody: any = {
        u_id: u_id
      };

      this.remoteSvrc.postHttpNoAuth(url_p, msgBody).subscribe(
        (data) => {
          // if no errors
          if (
            undefined != data &&
            null != data &&
            "200" === data["httpStatus"]
          ) {
            self.showAlert(
              titleSuccess,
              "Please check your email and confirm registration."
            );
            AuthenticationService.authState.next('login');
          } else {
            if (undefined !== data["errors"] && null !== data["errors"]) {
              self.showAlert(
                "Request for registration code Failed errors",
                JSON.stringify(data["errors"])
              );
            } else {
              self.showAlert(
                "Request for registration code Failed message",
                JSON.stringify(data["message"])
              );
            }
          }
        },
        (err) => {}
      );
    } else {
      this.showAlert( "Email Confirmation Request Failed", "You may need to login to request a new OTP" );
      AuthenticationService.authState.next('login');
    }
    
  }

 
  requestOtpConfirmation() {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_DCUBEAUTH + "requestOTPConfirmation";
    let titleSuccess = "Successfully sent registration code.";
  
    let ou_id = this.auth.getUserLogin().userId;
    if ( Utils.stringNotEmpty(ou_id) ) {
      let msgBody: any = {
        ou_id: ou_id
      };

      this.remoteSvrc.postHttpNoAuth(url_p, msgBody).subscribe(
        (data) => {
          // if no errors
          if (
            undefined != data &&
            null != data &&
            "200" === data["httpStatus"]
          ) {
            console.log("requestOtpConfirmation() data: " + JSON.stringify(data));
            this.showAlert( "OTP Request Successful", "Please enter OTP sent to your phone or request a new one to confirm." );
          } else {
            if (undefined !== data["errors"] && null !== data["errors"]) {
              this.showAlert(
                "Request for OTP Failed",
                JSON.stringify(data["errors"])
              );
            } else {
              this.showAlert(
                "Request for OTP Failed",
                JSON.stringify(data["message"])
              );
            }
          }
        },
        (err) => {} 
      );
    } else {
      this.showAlert( "OTP Request Failed", "You may need to login to request a new OTP" );
      AuthenticationService.authState.next('login');
    }

  }

  confirmOTPRegistration() {
    let self = this;
    let url_p = AppConstants.URL_MOQUI_AUTH_REST + "confirmOTPRegistration";

    let ou_id = this.auth.getUserLogin().userId;
    if ( Utils.stringNotEmpty(this.receivedOtp) && Utils.stringNotEmpty(ou_id) ) {
      let msgBody: any = {
        ou_id: ou_id,
        data: this.receivedOtp
      };
      console.log("confirmOTPRegistration() msgBody: " + JSON.stringify(msgBody));

      this.remoteSvrc.postHttpNoAuth(url_p, msgBody).subscribe(
        (data) => {
          if (
            undefined != data &&
            null != data &&
            "200" === data["httpStatus"]
          ) {
            AuthenticationService.authState.next('login');
          } else {
            this.showAlert( "Registration not Confirmed", data["statusMsg"] );
          }
        },
        (err) => {
          this.showAlert( "OTP Confirmation Failed", JSON.stringify(err) );
        }
      );
    } else {
      if ( Utils.isStringEmpty(this.receivedOtp) ) {
        this.showAlert( "OTP Confirmation Failed", "OTP is required for confirmation" );
      } else {
        this.showAlert( "OTP Confirmation Failed", "You may need to login to confirm registration" );
        AuthenticationService.authState.next('login');
      }
    }
  }

  async showAlert(title, text): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: title,
      message: text,
      buttons: ["OK"],
    });

    await alert.present();
  }

}
