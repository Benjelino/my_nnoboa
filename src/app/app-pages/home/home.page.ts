import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import { IonInfiniteScroll, ModalController } from "@ionic/angular";


import * as Models from "src/app/base-services/common-service/models/common-model.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { PrivacyPolicyPage } from "src/app/components/privacy-policy/privacy-policy.page";
import { TermsOfServicePage } from "src/app/components/terms-of-service/terms-of-service.page";
import { AboutComponent } from "../about/about.component";
import { IHomeSlide } from 'src/app/noboa/services/models/ihomeslide';


@Component({
  selector: "app-noboa",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  isLoggedIn = false;
  isLoading = false;

  public appIds: Models.AppId;
  appId = "";

  option = {
    slidesPerView: 1.5,
    zoom: false,
    grabCursor: true,
    loop: true,
    spaceBetween: 5,
    autoplay: true,
    breakpoints: {
      // when window width is >= 480px
      720: {
        slidesPerView: 2,
        spaceBetween: 5
      },
      // when window width is >= 640px
      960: {
        slidesPerView: 2.5,
        spaceBetween: 5
      }
    }
  };
  
  companiesSlider: IHomeSlide[] = [
    {
      title:'Invest in Technology',
      imgSrc: '../assets/images/tech.jpg',
    },
    {
      title:'Invest in Agriculture',
      imgSrc: '../assets/images/Agriculture.jpg',
    },
    {
      title:'Invest in a FinTech',
      imgSrc: '../assets/images/fintech.jpg',
    },
    {
      title:'Invest in Local Businesses',
      imgSrc: '../assets/images/localbusiness.jpg',
    },
    {
      title:'Invest in Sustainability Programs',
      imgSrc: '../assets/images/sustainability.jpg',
    },
    {
      title:'Invest in Health Care',
      imgSrc: '../assets/images/healthcare.jpg',
    },
  ];

  public searchForm: FormGroup;
  currentYear = 0;
  userId: string = "";
  //segmentModel = "announce";
  geoModel: Models.GeoModel = null;

  rForm: FormGroup = new FormGroup({});

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private toast: ToastComponent,
    private remSvrc: RemoteService,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.appId = AuthenticationService.env.appId;
    this.setView();
  }

  setView() {
    this.appId = AuthenticationService.env.appId;
    console.log("appId", this.appId);
  }
  ionViewDidEnter() {
    // this.setView();
  }
  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.buildForm();
  }

  buildForm() {
    this.rForm = this.formBuilder.group({
      city: [null, Validators.required],
      comments: "",
    });
  }

  addFormControl(name: string, formGroup: FormGroup): void {
    this.rForm.addControl(name, formGroup);
  }

  async showAboutModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AboutComponent,
    });
    return await modal.present();
  }

  async showTermsModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: TermsOfServicePage,
    });
    return await modal.present();
  }

  async showPrivacyModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
    });
    return await modal.present();
  }
  viewCompanies(){
   this.router.navigate(['/companies'])
  }

  
}
