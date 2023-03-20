import { Injectable } from "@angular/core";

import { Storage } from "@ionic/storage";
import { ToastComponent } from "src/app/components/toastComponent";

import {
  SecurityServiceModule,
  CryptojsService,
} from "../security-service/security-service.module";

/*
  Author: Stephen Agyepong
*/

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor(
    private storage: Storage,
    private cryptoSrvc: CryptojsService,
    private toast: ToastComponent
  ) {}

  saveDataEncrypt(key: string, data: any) {
    let encryptedData = this.cryptoSrvc.encrypt(data);
    this.storage.set(key, encryptedData);
  }

  getEncryptedData(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(key).then(
        (val) => {
          let decryptedData = this.cryptoSrvc.decrypt(val);
          resolve(decryptedData);
        },
        (onerr) => {
            this.toast.presentFailedToast("getEncryptedData() error: " + JSON.stringify(onerr));
          reject(onerr);
        }
      );
    });
  }

  saveDataEncryptWithKey(key: string, data: string, encryptkey: string) {
    let encryptedData = this.cryptoSrvc.encryptWithKey(data, encryptkey);
    this.storage.set(key, encryptedData);
  }

  getEncryptedDataWithKey(key: string, encryptkey: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(key).then(
        (val) => {
          let decryptedData = this.cryptoSrvc.decryptWithKey(val, encryptkey);
          resolve(decryptedData);
        },
        (onerr) => {
          reject(onerr);
        }
      );
    });
  }

  saveData(key: string, data: any) {
    this.storage.set(key, data);
  }

  getData(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(key).then(
        (val) => {
          resolve(val);
        },
        (onerr) => {
            this.toast.presentFailedToast("getData() error: " + JSON.stringify(onerr));
          reject(onerr);
        }
      );
    });
  }

  removeData(key: string) {
    return new Promise((resolve, reject) => {
      this.storage.remove(key).then(
        (val) => {
          resolve(true);
        },
        (onerr) => {
            this.toast.presentFailedToast("removeData() error: " + JSON.stringify(onerr));
          reject(onerr);
        }
      );
    });
  }

  clearData() {
    return new Promise((resolve, reject) => {
      this.storage.clear().then(
        (val) => {
          resolve(true);
        },
        (onerr) => {
            this.toast.presentFailedToast("clearData() error: " + JSON.stringify(onerr));
          reject(onerr);
        }
      );
    });
  }
}
