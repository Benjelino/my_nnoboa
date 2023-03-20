import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TourismModelsService {
  constructor() {}
}

export enum RentalType {
  Hourly = "rent by the hour",
  Daily = "rent by the day",
  Weekly = "rent by the week",
  Monthly = "rent by the month",
  Annualy = "rent by the year",
}

export enum LeaseType {
  Sell = "sell the property",
  Buy = "buy the property",
  Rent = "rent the property",
  Share = "share the property",
}

export enum PropertyType {
  Hous = "house",
  Apt = "apartment",
  StRm = "store room",
  Cntr = "container",
  Kiok = "kiosk",
  Condo = "condo",
  OfSp = "Office Space",
}

export enum PropertyStatusType {
  Active = "property is actively on the market",
  OnHld = "property is on hold",
  Inactive = "property is pending sale or lease",
  Close = "property sale or lease has been closed or finalized",
}

export interface Housing {
  housingId?: string;
  appId: string;
  rentalType: string;
  leaseType: string;
  propertyType: string;
  contactMechId: string;
  propertyStatusType?: string;
  amount: number;
  amountTo: number;
  amountFrom: number;
  noOfRooms: number;
  periodOfLease: number;
  measure?: string;
  currencyUomId?: string;
  dRentalType?: string;
  dPropertyStatusType?: string;
  dLeaseType?: string;
  dPropertyType?: string;
  ImageUrls?: ImageUrl[];
  postalAddress: HouseAddress;
  currency?: string;
  furnished: string;
}

export interface HouseEnums {
  enumId: string;
  enumTypeId?: string;
  description: string;
  lastUpdatedStamp?: Date;
}

export interface ImageUrl {
  appId: string;
  imageUrl: string;
  housingId: string;
  userId: string;
}

export interface HouseAddress {
  appId: string;
  postalCode?: string;
  address1?: string;
  suburbId?: string;
  cityGeoId?: string;
  countyGeoId?: string;
  stateProvinceGeoId: string;
  countryCode: string;
  address2?: string;
  directions?: string;
  latitude?: string;
  longitude?: string;
  unitNumber?: string;

  district?: string;
  suburb?: string;
  region?: string;
  country?: string;
  city?: string;

  contactMechId?: string;
}

export interface ClientHousingPref {
  pqueryId?: string;
  appId: string;
  userId: string;
  rentalType: string;
  leaseType: string;
  propertyType: string;
  serviceLocReq?: string;
  propertyStatusType?: string;
  periodOfLease: number;

  currencyUomId?: string;

  amountTo: number;
  amountFrom: number;
  noOfRooms: number;

  createDate?: Date;
  endDate?: Date;
  startDate?: Date;
  flexibilityType?: string;
  statusId?: string;

  countryGeoId?: string;
  stateProvinceGeoId?: string;
  countyGeoId?: string;
  cityGeoId?: string;
  suburbId?: string;
  postalCode?: string;
  serviceDescription?: string;
  serviceName?: string;
  dPropertyType?: string;
  dRentalType?: string;
  dPropertyStatusType?: string;
  currency?: string;
  country?: string;
  city?: string;
  district?: string;
  region?: string;
  suburb?: string;
  furnished: string;
}

export interface ClientHousingPrefList {
  message: string;
  userId: string;
  PropertyQueryDetails: ClientHousingPref[];
  appId: string;
  httpStatus: string;
}
