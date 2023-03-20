import { Injectable } from "@angular/core";
import { EventEmitter } from "@angular/core";

import { Platform } from "@ionic/angular";

import { TranslateService } from "@ngx-translate/core";

import * as AppConstants from "./app-constants/app-constants.service";
import { AppConfigService } from "./app-config/app-config.service";
import { Subject } from "rxjs";

/*
  Author: Stephen Agyepong
*/

export const APPMODE_CHANGED = "appmodeChanged";
export const APPLANG_CHANGED = "appLangChanged";

export const APPMODE = "appMode";
export const APPLANG = "appLang";

export interface IRadioGroupItem {
  label: string;
  checked: string;
  value: string;
}

export enum AppCurrency {
  BTC,
  EUR,
  FUNT,
  GBP,
  GHS,
  NGN,
  UGX,
  USD,
  XLM,
  XOF,
  ZAR,
}

export interface IAppContext {
  appMode: string;
  appLang?: string;
}

export interface IRadioGroupItem {
  label: string;
  checked: string;
  value: string;
}

export enum Permission {
  ALLOWED,
  PENDING,
  DENIED,
  UNKNOWN,
}

export enum AppMode {
  DEMO,
  DEV,
  PROD,
  TEST,
}

export enum Apps {
  OBRA = "OBRA",
  KASAM = "KASAM",
  FUNLGH = "FUNLGH",
  SABGH = "SABGH",
}

export enum ContractActions {
  SUBMIT = "SUBMIT",
  SIGN = "SIGN",
}

export enum AppLanguage {
  EN,
  FR,
  AK,
  DE,
  NL,
}

@Injectable({
  providedIn: "root",
})
export class CommonService {
  appContext: AppContext = new AppContext(AppMode[AppMode.DEV]);

  isMobile: boolean = false;

  cfgdata: any = null;
  appMode: string = AppMode[AppMode.DEV];
  appLang: string = AppLanguage[AppLanguage.EN];
  appCurr: string = AppCurrency[AppCurrency.XLM];

  public commonEvents$: EventEmitter<any>;

  private eventSubject = new Subject<any>();

  constructor(
    private platform: Platform,

    private translateService: TranslateService,
    private appcfg: AppConfigService
  ) {
    let self = this;
    if (this.platform.is("mobile")) {
      this.isMobile = true;
    }

    this.commonEvents$ = new EventEmitter();
  }

  isOfType(type, obj) {
    var clas = type(obj);
    return obj !== undefined && obj !== null && clas === type;
  }

  type(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  }

  createUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  }

  onCommonEvent(callbackObj, evtFunc) {
    this.commonEvents$.subscribe((commonevt) => {
      evtFunc(callbackObj, commonevt);
    });
  }

  getAppMode() {
    return this.appMode; // dev, demo, prod
  }

  setAppMode(mode: string) {
    this.appMode = mode;

    this.commonEvents$.emit({
      memo: APPMODE,
      status: APPMODE_CHANGED,
    });
  }
  setAppModeSelf(self, mode: string) {
    self.appMode = mode;

    self.commonEvents$.emit({
      memo: APPMODE,
      status: APPMODE_CHANGED,
    });
  }

  getAppLanguage() {
    return this.appLang; // en, fr
  }

  setAppLanguage(curlang: string) {
    this.appLang = curlang;

    this.translateService.use(curlang);

    //see https://www.w3.org/International/questions/qa-html-language-declarations

    this.commonEvents$.emit({
      memo: APPLANG,
      status: APPLANG_CHANGED,
    });
  }
  setAppLanguageSelf(self, curlang: string) {
    self.appLang = curlang;
    self.translateService.use(curlang);

    //see https://www.w3.org/International/questions/qa-html-language-declarations

    self.commonEvents$.emit({
      memo: APPLANG,
      status: APPLANG_CHANGED,
    });
  }

  getAppCurrency() {
    return this.appCurr; // XLM, USD, GHS
  }

  setAppCurrency(curr: string) {
    this.appCurr = curr;
  }

  translateString(key: string): string {
    return this.translateService.instant(key);
  }

  translateStringSubscribe(key: string): string {
    this.translateService.get(key).subscribe((value) => {
      return value;
    });

    return "";
  }
}

class AppContext implements IAppContext {
  constructor(public appMode, public appLang?) {}
}
