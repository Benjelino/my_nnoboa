import { Component } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { AlertController } from "@ionic/angular";

import { ToastComponent } from "../../components/toastComponent";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

export interface UserOptions {
  username: string;
  password: string;
}

@Component({
  selector: "tlogin",
  templateUrl: "tlogin.html",
})
export class Tlogin {
  //public username: string = 'dcubeappc1';
  //public password: string = 'Sabonay2018@';
  //public username: string = 'dcubeappc2';
  //public password: string = 'moqui';
  public username: string = 'dcubeappp1';
  public password: string = 'moqui';
  //public username: string = 'sophia';
  //public password: string = 'SopB@dc2019$';
  //public username: string = 'stephen';
  //public password: string = 'Kwadwo2021$';
  //public username: string = 'dcubeadmin';
  //public password: string = 'MatDev@dc2019$';
  //public username: string = 'sophia';
  //public password: string = 'moqui';
  //public username: string = "dcubeadmin";
  //public password: string = "moqui";
  //public username: string = "cUser0784";
  //public password: string = "cUser@sab2022&";
  //public username: string = "cUser4121";
  //public password: string = "cUser@sab2022&";
  //public username: string = "";
  //public password: string = "";
  isLoggedIn = false;

  login: UserOptions = { username: this.username, password: this.password };
  submitted = false;

  public error: string;

  //passing an instance of the FormBuilder to the constructor
  constructor(
    private router: Router,
    public toastCtrl: ToastComponent,
    private alertCtrl: AlertController,
    private auth: AuthenticationService
  ) {}

  ionViewDidLoad(): void {
    this.isLoggedIn = this.auth.isAuthenticated();
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.username = this.login.username;
      this.password = this.login.password;
      let msgBody: any = {
        username: this.username,
        password: this.password,
      };

      this.auth.ifLoggedIn(msgBody);
    }
  }

  register() {
    AuthenticationService.authState.next("register");
  }

  forgotpasswd() {
    AuthenticationService.authState.next("forgot");
  }

  showErrorTitle(title, text) {
    /*
    let alert = this.alertCtrl.create({
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
      */
  }

  showError(text) {
    /*
    let alert = this.alertCtrl.create({
      title: 'Login Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
      */
  }

  displayAlert(message): void {
    /*
    let headsUp = this.alertCtrl.create({
      title: 'Login',
      subTitle: message,
      buttons: ['Got It!']
    });
    headsUp.present();
      */
  }
}
