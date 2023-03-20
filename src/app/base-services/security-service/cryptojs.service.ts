import { Injectable } from '@angular/core';

import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'AA9F34324488652E7BA836768DCE9';

/*
  Author: Stephen Agyepong
  $ npm install crypto-js --save 
*/

@Injectable({
  providedIn: 'root'
})
export class CryptojsService {

 

  constructor() {
      
  }

  public encrypt(plaintext: string): string {
      let ciphertext: Crypto = CryptoJS.AES.encrypt(plaintext, ENCRYPTION_KEY);
      return ciphertext.toString();
  }

  public decrypt(ciphertext: string): string {
      let plaintext = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
      return plaintext.toString(CryptoJS.enc.Utf8);
  }

  public encryptWithKey(plaintext: string, key: string): string {
      let ciphertext: Crypto = CryptoJS.AES.encrypt(plaintext, key);
      return ciphertext.toString();
  }

  public decryptWithKey(ciphertext: string, key: string): string {
      let plaintext = CryptoJS.AES.decrypt(ciphertext, key);
      return plaintext.toString(CryptoJS.enc.Utf8);
  }
}
