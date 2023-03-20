import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireMessagingModule } from "@angular/fire/compat/messaging";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { Camera } from "@ionic-native/Camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { BackButtonDisableModule } from "angular-disable-browser-back-button";

import { NgChatModule } from "ng-chat";

import { SwiperModule } from 'swiper/angular';

import { ToastComponent } from "./components/toastComponent";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  ThomePage,
  Tlogin,
  ComponentsAuthPageModule,
} from "./components-auth/components.auth.module";

import { AuthGuardService } from "src/app/auth/auth-service/auth-guard.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ProfileService } from "./profile/services/profile.service";
import { RemoteService } from "./base-services/remote-service/remote.service";
import { DataConfigService } from "./base-services/common-service/config-service";
import { TestingService } from "./base-services/testing-service/testing.service";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [ThomePage, Tlogin],
  imports: [
    IonicStorageModule.forRoot(),
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgChatModule,
    SwiperModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ComponentsAuthPageModule,
    ServiceWorkerModule.register("combined-sw.js", {
      enabled: environment.production,
      registrationStrategy: "registerWhenStable:30000",
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuardService,
    TranslateService,
    AuthenticationService,
    ProfileService,
    RemoteService,
    ToastComponent,
    DataConfigService,
    TestingService,
    Crop,
    Camera,
    File,
    FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InAppBrowser,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
