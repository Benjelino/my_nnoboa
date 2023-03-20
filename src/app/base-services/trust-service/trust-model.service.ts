import { Injectable } from '@angular/core';

import { EmailAddress, PhoneNumber, PostalAddress } from '../common-service/models/common-model.service';

export class Identification {
  // Passport
  // Driver Licence
  // Identity Card
  // National Identity Card
  // Global Location Number - a 13-digit number
  trustTypeId: string;
  trustPointsId?: string;
  idValue: string;
  issuedBy: string;
  issuedByPartyId?: string;
  issuedDate?: number | Date;
  expireDate?: number | Date;
  contactMechId?: string
  contactMechPurposeId?: string

  constructor() {
    this.trustTypeId = null;
    this.trustPointsId = null;
    this.idValue = "";
    this.issuedBy = "";
    this.issuedDate = 0;
    this.expireDate = 0;
    this.issuedByPartyId = "";
    this.contactMechId = ""
    this.contactMechPurposeId = ""
  }
}

export class Communication {
  emailAddress?: EmailAddress[];
  phoneNumber?: PhoneNumber[];
  postalAddress?: PostalAddress[];

  constructor() {
    this.emailAddress = [];
    this.phoneNumber = [];
    this.postalAddress = [];
  }
}

export class Payment {
  // ANCHOR
  // BANKACCOUNT
  // CREDITCARD
  // DEBITCARD
  // MOBILEMONEY
  // PAYMENTSERVICE
  // WALLET
  // INTERNATIONALCARD
  trustTypeId: string;
  trustPointsId?: string;
  pymtAcctId?: string;
  pymtPlatformId?: string;
  branch?: string;
  bankName?: string;
  routingNumber?: string;
  // bank account types are: Checking (BAcctC) and Savings (BAcctS)
  accountType?: string;
  accountNumber?: string;
  accountSecret?: string;
  nameOnAccount?: string;
  network?: string;
  momoNumber?: string;
  cardNumber?: string;
  cvvNumber?: string;

  constructor() {
    this.pymtAcctId = "";
    this.trustTypeId = "";
    this.branch = "";
    this.bankName = "";
    this.routingNumber = "";
    this.accountType = "";
    this.accountNumber = "";
    this.accountSecret = "";
    this.nameOnAccount = "";
    this.network = "";
    this.momoNumber = "";
    this.cardNumber = "";
    this.cvvNumber = "";
  }
}

export class PaymentSetUp {
  
  pymtPlatformId: string;
  trustTypeId?: string;
  network?: string;
  cphone?: string;
  email?: string;
  currencyUomId?: string;
  description?: string;
  paymentMethodId?: string;
  trustPointsId? : string;
 
  constructor() {
    this.pymtPlatformId = "";
    this.trustTypeId = "";
    this.network = "";
    this.cphone = "";
    this.email = "";
    this.currencyUomId = "";
    this.description="";
    this.paymentMethodId = '';
    this.trustPointsId = '';
  }
}

export class Recommendation {
  trustTypeId: string;
}

export class SocialNetwork {
  trustTypeId: string;
}

export class TrustModel {
  partyId: string;
  identityInfo: Identification[];
  commInfo: Communication;
  pymtInfo: Payment[];
  recommendInfo: Recommendation[];
  socnetInfo: SocialNetwork[];

  constructor() {
    this.identityInfo = [];
    this.commInfo = new Communication();
    this.pymtInfo = [];
    this.recommendInfo = [];
    this.socnetInfo = [];
  }
}

export interface ITrustModel {
  partyId: string;
  identityInfo: Identification[];
  commInfo: Communication;
  pymtInfo: Payment[];
  recommendInfo: Recommendation[];
  socnetInfo: SocialNetwork[];
}


@Injectable({
  providedIn: 'root'
})
export class TrustModelService {

  constructor() { }
}
