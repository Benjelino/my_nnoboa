import { Injectable } from "@angular/core";

export interface SelectItem {
  label: string;
  value: string;
}

export enum prefContactMethod {
  PHONE,
  EMAIL,
}

export enum AppId {
  FUNLGH = "FUNLGH",
  SABGH = "SABGH",
  KASAM = "KASAM",
}

export enum UserType {
  PROVIDER = "PROVIDER",
  CLIENT = "CLIENT",
}

// 3 digit country code
// 3 digit currency code
export interface IAppLocale {
  appCurrency: string;
  appCurrencyCode: string;
  appCountry: string;
  appCountryCode: string;
  appRegion: string;
  appRegionCode: string;
  appCounty?: string;
  appCountyCode?: string;
  appCity: string;
  appCityCode: string;
  appLanguage: string;
}

export class Env {
  appId: string;
  appLocale?: IAppLocale;
  appMode: string;
  appCurrency: string;
  appLanguage: string;
  mxlogin: string;
  mxreg: string;
  serviceId: string;
  wsUrl: string;
}
export interface IEnv {
  appId: string;
  appLocale?: IAppLocale;
  appMode: string;
  appCurrency: string;
  appLanguage: string;
  mxlogin: string;
  mxreg: string;
  serviceId: string;
  wsUrl?: string;
}

export enum YesNo {
  Yes = "Y",
  No = "N",
}

export enum Theme {
  Dark = "dark",
  Light = "light",
}

export enum Presence {
  Online = "online",
  Offline = "offline",
}

export class Suburb {
  public geoId: string;
  public geoName: string;
  public country?: string;
  public countryId?: string;
  public region?: string;
  public regionId?: string;
  public district?: string;
  public districtId?: string;
  public city?: string;
  public cityId?: string;
}

export class City {
  public geoId?: string;
  public geoName: string;
  public country?: string;
  public countryId?: string;
  public region?: string;
  public regionId?: string;
  public district?: string;
  public districtId?: string;
  public suburbCount?: number;
}

export class District {
  public geoId: string;
  public geoName: string;
  public country?: string;
  public countryId?: string;
  public region?: string;
  public regionId?: string;
}

export class Region {
  public geoId: string;
  public geoName: string;
}

export class PartyProfile {
  public website: string;
  public emailAddress: string;
  public organizationName: string;
  public cCount: number;
  public userFullName: string;
  public partyId: string;
  public userName: string;
  public userId: string;
}
export class GeoDataByName {
  UserProfile: PartyProfile;
  GeoData: GeoData[];
}
export class TourismData {
  public tourismType: string;
  public region: string;
  public tourismName: string;
  public tourismLocation?: string;
  public phone: string;
  public grade: string;
  public tourismCost: string;
  public capacity: number;
  public status?: string;
  public tourismId?: string;
  public userId?: string;
  public GeoData?: GeoData;
  public directions?: string;
}

export class GeoData {
  public country: string;
  public countryId: string;
  public geoDataId: string;
  public regionId: string;
  public region: string;
  public status?: string;
  public userId: string;
  public geoComment?: string;
  public district?: string;
  public districtId?: string;

  public city?: string;
  public cityId?: string;

  public suburb?: string;
  public suburbId?: string;
  public TourData?: TourismData;
}

export class TourismTypeEnumerations {
  public enumId: string;
  public enumTypeId: string;
  public description: string;
  public lastUpdatedStamp: Date;
}

export class GeoStatusEnumerations {
  public enumId: string;
  public enumTypeId: string;
  public description: string;
  public lastUpdatedStamp: Date;
}

export class Country {
  public geoId: string;
  public geoName: string;
}

export class GeoModel {
  public country?: Country;
  public district?: District;
  public region?: Region;
  public city?: City;
  public suburb?: Suburb;
  public address1?: string;
  public address2?: string;
  public unitNumber?: string;
  public postalCode?: string;
  public latitude?: string;
  public longitude?: string;
  public geoPointId?: string;
  public geoName?: string;
  public geoId?: string;
  public userId?: string;
  public directions?: string;
}

export interface GeoStatus {
  code: number;
  message: string;
}

export interface GeoGeometry {
  lat: number;
  lng: number;
}

export interface GeoResult {
  geometry: GeoGeometry;
}

export interface GeoResults {
  results: GeoResult[];
  status: GeoStatus;
}

export class PartyContactProfile {
  userId: string;
  isContactSame: string;
  userAccount: UserAccount;
  userProfile: UserProfile;
  contactInfo: ContactInfo;
  party: Party;
  emailAddress: EmailAddress;
  phoneNumber: PhoneNumber;
  postalAddress: PostalAddress;
  paymentInfo: PaymentInfo;

  constructor() {
    this.userId = "";
    this.isContactSame = "Y";
    this.userAccount = new UserAccount();
    this.userProfile = new UserProfile();
    this.contactInfo = new ContactInfo();
    this.party = new Party();
    this.emailAddress = new EmailAddress();
    this.phoneNumber = new PhoneNumber();
    this.postalAddress = new PostalAddress();
    this.paymentInfo = new PaymentInfo();
  }
}
export interface IPartyContactProfile {
  userId: string;
  isContactSame: string;
  userAccount: UserAccount;
  userProfile: UserProfile;
  contactInfo: ContactInfo;
  party: Party;
  emailAddress: EmailAddress;
  phoneNumber: PhoneNumber;
  postalAddress: PostalAddress;
  paymentInfo: PaymentInfo;
}

// RegistrationStatus: RgU, RgInP, RgCompltd
// MemberType: MtFree, MtPro, MtUlt, MtAgt
// AgentType: AtNa, At60C, AtDapp
export class UserProfile {
  userId: string;
  agentTypeEnumId: string;
  memberTypeEnumId: string;
  registrationStatusEnumId: string;
  trustPoints: number;
  userLogo: string;
  photoUrl: string;
  userSlogan: string;
  welcomeMsg: string;
  image: string;
  countryCode: string;
  contactPartyId: string;
  prefContactMethod: string;
  prefContactMechId: string;
  emailContactMechId: string;
  emailTrustPointsId: string;
  cphoneContactMechId: string;
  cphoneTrustPointsId: string;
  postalAddrContactMechId: string;
  postalAddrTrustPointsId: string;
  lastaccesspage: string;
  registerDate: string;
  ipaddress: string;
}
export interface IUserProfile {
  userId: string;
  agentTypeEnumId: string;
  memberTypeEnumId: string;
  registrationStatusEnumId: string;
  trustPoints: number;
  slogan: string;
  logo: string;
  countryCode: string;
  contactPartyId: string;
  prefContactMethod: string;
  prefContactMechId: string;
  emailContactMechId: string;
  emailTrustPointsId: string;
  cphoneContactMechId: string;
  cphoneTrustPointsId: string;
  postalAddrContactMechId: string;
  postalAddrTrustPointsId: string;
  lastaccesspage: string;
  registerDate: string;
  ipaddress: string;
}

export class BasicProfile {
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName?: string;
  nickName?: string;
  organizationName?: string;
  partyTypeEnumId?: string;
  externalId?: string;
  userId: string;
  registrationDate: Date;
  requests?: number;
  completed?: number;
  reviews?: number;
  rating?: number;
  userLocation: PostalAddress;
}
export interface IBasicProfile {
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName?: string;
  nickName?: string;
  organizationName?: string;
  partyTypeEnumId?: string;
  externalId?: string;
  userId: string;
  registrationDate: Date;
  requests?: number;
  completed?: number;
  reviews?: number;
  rating?: number;
  userLocation: PostalAddress;
}

export class Party {
  partyId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  organizationName: string;
  isPerson: string;
}
export interface IParty {
  partyId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  organizationName: string;
  isPerson: string;
}

// cityGeoId is preferred over city
// county also represents district
// countyGeoId also represents districtId
// stateProvince also represents region
// stateProvinceGeoId also represents regionId
// commercial = (Y/N) is this a commercial/business building?
// directions whatever information will help the user find the address, eg landmark, street intersection, etc
// direction should replace landmark
// contactMechId should replace addrId
// remove addrId, addrName, locationCode and landmark after integration
export class PostalAddress {
  addrId?: string;
  addrName?: string;
  locationCode?: string;
  landmark?: string;
  county?: string;
  country?: string;

  appId: string;
  contactMechId?: string;
  contactMechPurposeId?: string;
  trustTypeId: string;
  trustPointsId?: string;
  fromDate?: Date;
  commercial?: string;
  address1?: string;
  address2?: string;
  unitNumber?: string;
  directions?: string;
  suburbId?: string;
  city: string;
  cityGeoId: string;
  countyGeoId?: string;
  stateProvince?: string;
  stateProvinceGeoId: string;
  countryCode: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  geoPointId?: string;
  pobox?: string;
}
export interface IPostalAddress {
  addrId?: string;
  addrName?: string;
  locationCode?: string;
  landmark?: string;

  contactMechId?: string;
  contactMechPurposeId?: string;
  trustTypeId: string;
  trustPointsId?: string;
  fromDate?: Date;
  commercial?: string;
  address1: string;
  address2: string;
  unitNumber: string;
  directions?: string;
  city: string;
  cityGeoId: string;
  county?: string;
  countyGeoId?: string;
  stateProvince?: string;
  stateProvinceGeoId: string;
  country?: string;
  countryCode: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  geoPointId?: string;
  pobox: string;
}

// trustTypeId: EMAIL, COEMAIL
export class EmailAddress {
  emailAddress: string;
  trustTypeId: string;
  contactMechId?: string;
  contactMechPurposeId?: string;
  trustPointsId?: string;
  fromDate?: Date;
}
export interface IEmailAddress {
  emailAddress: string;
  trustTypeId: string;
  contactMechId: string;
  contactMechPurposeId: string;
  trustPointsId: string;
  fromDate?: Date;
}

// trustTypeId: CELLPHONE, PHONE
export class PhoneNumber {
  phone: string;
  trustTypeId: string;
  contactMechId?: string;
  contactMechPurposeId?: string;
  trustPointsId?: string;
  networkOperator?: string;
  fromDate?: Date;
}
export interface IPhoneNumber {
  phone: string;
  trustTypeId: string;
  contactMechId?: string;
  contactMechPurposeId?: string;
  trustPointsId?: string;
  networkOperator?: string;
  fromDate?: Date;
}

export class ContactInfo {
  contactPartyId: string;
  contactFirstName: string;
  contactMiddleName: string;
  contactLastName: string;
}
export interface IContactInfo {
  contactPartyId: string;
  contactFirstName: string;
  contactMiddleName: string;
  contactLastName: string;
}

// user groups: DACLIENT, DAGOODSPROVIDER, DASERVICEPROVIDER, DAPROFSERVPROVIDER
//              DAAGENT
export class UserGroupMember {
  userGroupId: string;
  userGroupName: string;
  userId: string;
  fromDate: string;
  thruDate: string;
}
export interface IUserGroupMember {
  userGroupId: string;
  userGroupName: string;
  userId: string;
  fromDate: string;
  thruDate: string;
}

export class UserLogin {
  userId: string;
  username: string;
  apikey: string;
  sessionToken: string;
  fcmToken: string;
  subscribedTopics: string;
  externalUserId: string;
  userFullName: string;
  countryCode: string;
  currencyUomId: string;
  userGroupArray: string[];
  httpStatus: string;
  isShowEditor: string;
  isTodoNotify: string;
  userPrefs: UserPrefs;
  regOtp: string;
}
export interface IUserLogin {
  userId: string;
  username: string;
  apikey: string;
  sessionToken: string;
  fcmToken: string;
  subscribedTopics: string;
  externalUserId: string;
  userFullName: string;
  countryCode: string;
  currencyUomId: string;
  userGroupArray: string[];
  httpStatus: string;
  isShowEditor: string;
  isTodoNotify: string;
  userPrefs: UserPrefs;
  regOtp: string;
}

export class Session {
  token: string;
  xCsrfToken: string;
  moquiVisitorId: string;
  visitorCookie: string;
}
export interface ISession {
  token: string;
  xCsrfToken: string;
  moquiVisitorId: string;
  visitorCookie: string;
}

export class UserPrefs {
  browserNotificationsEnable: string;
  statusMsg: string;
  theme: string;
  audioEnabled: string;
  presence: string;
}

export class UserAccount {
  userId: string;
  externalUserId: string;
  username: string;
  userFullName: string;
  oldPassword: string;
  newPassword: string;
  newPasswordVerify: string;
  emailAddress: number;
  cphone: string;
  currency?: string;
  currencyUomId: string;
  locale: string;
  timeZone: string;
  fromDate: string;
}
export interface IUserAccount {
  userId: string;
  externalUserId: string;
  username: string;
  userFullName: string;
  oldPassword: string;
  newPassword: string;
  newPasswordVerify: string;
  emailAddress: number;
  cphone: string;
  currencyUomId: string;
  locale: string;
  timeZone: string;
  fromDate: string;
}

// C60MemberPolicy: 60. 120, 240
export class LineageBenefit {
  userId: string;
  uplineId: string;
  downlineId: string;
  c60MemberPolicyEnumId: string;
  uplinePhone: string;
  countryCode: string;
  currencyUomId: string;
  amount: number;
  processDate: string;
  statusCode: string;
  benefitCode: string;
  benefitDate: Date;
}
export interface ILineageBenefit {
  userId: string;
  uplineId: string;
  downlineId: string;
  c60MemberPolicyEnumId: string;
  uplinePhone: string;
  countryCode: string;
  currencyUomId: string;
  amount: number;
  processDate: string;
  statusCode: string;
  benefitCode: string;
  benefitDate: Date;
}

export class BasicUserInfo {
  registrationDate: Date;
  reviews: number;
  requests: number;
  completed: number;
  rating: number;
}

export interface UserPrefResponse {
  errorCode: string;
  message: string;
  httpStatus: string;
  errors: string;
}

export interface TourSiteList {
  TourismData: TourSites[];
  hitsCount: number;
  filteredHitsCount: number;
}

export interface ContactItem {
  cuId: number;
  contactType: string;
  AppId: string;
  email: string;
  phone: string;
  message: string;
  contactDate: Date;
  description: string;
}

export interface ContactItemResponse {
  cuId: number;
  httpStatus: number;
  message: string;
}

export interface ContactItems {
  ContactItems: ContactItem[];
}

export interface ContactType {
  ctId: string;
  AppId: string;
  description: string;
}

export interface SubscribedTopics {
  subscribedTopics: string[];
  httpStatus: string;
  message: string;
}

export interface ContactTypes {
  Contacts: ContactType[];
}

export interface TourSites {
  tourismCost: string;
  tourismId: string;
  phone: string;
  grade: string;
  tourismName: string;
  tourismLocation: string;
  tourismType: string;
  capacity?: string;
  region: string;
}

////////// Payment
export class AuthorizeDotNetConfig {
  clientKey: string;
  apiLoginId: string;
  configURL: string;
}

export class PaymentInfo {
  partyId: string;
  adn: AuthorizeDotNetConfig;
}

////////// Chat

export class UserChat {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  welcomeMessage: string;
  image: string;
  configuration: string;
}

export class ChatResponse {
  chats: Chat[];
  httpStatus: string;
  message: string;
}
export class Chat {
  clientChat: UserChat;
  registrationDate: Date;
  reviews: number;
  requests: number;
  completed: number;
  rating: number;
  chatId: string;
  displayName: string;
  participantType: string;
  fullName: string;
  topic: string;
  id: string;
  meUserI: string;
  userId: string;
  otherUserId: string;
  status: ChatStatus;
  avatar: string;
  Members: ChatMember[];
}

export class ChatStatus {
  httpStatusCode: string;
  last_active_ago: Date;
  presence: string;
}

export class ChatStatusType {
  enumId: string;
  lastUpdatedStamp: Date;
  enumTypeId: string;
  description: string;
}

export class ChatStatusTypeList {
  OnlineStatusType: ChatStatusType[];
  httpStatus: string;
  message: string;
}

export class ChatMember {
  avatar: string;
  displayName: string;
  fullName: string;
  userId: string;
}

////////// Service Request

export interface IServiceRequestStatus {
  statusId: string;
  statusNum: number;
  description: string;
}
export class ServiceRequestStatus {
  statusId: string;
  statusNum: number;
  description: string;
}

export interface IServicePeriod {
  enumId: string;
  description: string;
}
export class ServicePeriod {
  enumId: string;
  description: string;
}

export interface IActivationStatus {
  requestId: string;
  requestStatus?: string;
  providerId: string;
  providerStatus?: string;
}
export class ActivationStatus {
  requestId: string;
  requestStatus?: string;
  providerId: string;
  providerStatus?: string;
}

export class BidInfo {
  bidAmount: number;
  bidRate: string; // Flat or Hourly
  numberHrs: number;
  servicePeriod: ServicePeriod;
  startDate: Date;
  endDate: Date;
  contractExpireDate: Date;
  bidComment?: string;
  nameSign: string;
}
export interface IBidInfo {
  bidAmount: number;
  bidRate: string; // Flat or Hourly
  numberHrs: number;
  servicePeriod: ServicePeriod;
  startDate: Date;
  endDate: Date;
  contractExpireDate: Date;
  bidComment?: string;
}

export class RequestInfo {
  requestId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  selectedRate: string;
  numberHrs: number;
  amountRange: string;
  currency: string;
  flexibilityType: string;
  serviceName: string;
  serviceDescription: string;
  awardedAmount: number;
  awardedRate: string; // Flat or Hourly
  awardedHrs: number;
  awardedDate: Date;
  serviceRequestStatus: ServiceRequestStatus;
  serviceLocation: PostalAddress;
  appId?: string;
  userId?: string;
  ppId?: string;
  providerId?: string;
  pqueryId?: string;
}
export interface IRequestInfo {
  requestId: string;
  clientId: string;
  startDate: Date;
  endDate: Date;
  selectedRate: string;
  numberHrs: number;
  amountRange: string;
  currency: string;
  flexibilityType: string;
  serviceName: string;
  serviceDescription: string;
  awardedAmount: number;
  awardedRate: string; // Flat or Hourly
  awardedHrs: number;
  awardedDate: Date;
  serviceRequestStatus: ServiceRequestStatus;
  serviceLocation: PostalAddress;
}

export interface IClient {
  clientChat: UserChat;
  registrationDate: Date;
  reviews: number;
  requests: number;
  completed: number;
  rating: number;
}
export class Client {
  clientChat: UserChat;
  registrationDate: Date;
  reviews: number;
  requests: number;
  completed: number;
  rating: number;
}

export interface IClientRequest {
  requestId: string;
  providers: Array<Provider>;
  subject: string;
  status: number;
  requestLocation: PostalAddress;
  startDate: Date;
  endDate: Date;
  selectedRate: string;
  amountRange: string;
  numberHrs: number;
  currency: string;
  flexibilityType: string;
  serviceName: string;
  serviceDescription: string;
  listedSkills: string;

  // provider bid info
  awardedAmount: number;
  awardedRate: string; // Flat or Hourly
  awardedHrs: number;
}
export class ClientRequest {
  requestId: string;
  providers: Array<Provider>;
  subject: string;
  status: number;
  requestLocation: PostalAddress;
  startDate: Date;
  endDate: Date;
  selectedRate: string;
  amountRange: string;
  numberHrs: number;
  currency: string;
  flexibilityType: string;
  serviceName: string;
  serviceDescription: string;
  listedSkills: string;

  // provider bid info
  awardedAmount: number;
  awardedRate: string; // Flat or Hourly
  awardedHrs: number;
  appId: string;
  userId: string;
}

export interface IClientRequests {
  clientId: string;
  clientChat: UserChat;
  clientRequests: Array<ClientRequestInfo>;
  message: string;
  httpStatus: string;
}
export class ClientRequests {
  clientId: string;
  clientChat: UserChat;
  clientRequests: Array<ClientRequestInfo>;
  message: string;
  httpStatus: string;
}

export class ClientRequestInfo {
  requestInfo: RequestInfo;
  providers: Array<ProviderInfo>;
}
export interface IClientRequestInfo {
  requestInfo: RequestInfo;
  providers: Array<ProviderInfo>;
}

export interface IRequestClientInfo {
  clientChat: UserChat;
  basicProfile: BasicProfile;
  requestInfo: RequestInfo;
  postalAddress: PostalAddress;
  bidInfo: BidInfo;
}
export class RequestClientInfo {
  clientChat: UserChat;
  basicProfile: BasicProfile;
  requestInfo: RequestInfo;
  postalAddress: PostalAddress;
  bidInfo: BidInfo;
}

export enum ClientServiceRequestSequenceEnum {
  CONST_REQUEST_CREATED = 0,
  CONST_PROVIDER_NOTIFIED = 1,
  CONST_BID_IN_PROGRESS = 2,
  CONST_SUBMIT_BID = 4,
  CONST_MODIFY_BID = 8,
  CONST_CHAT_IN_PROGRESS = 16,
  CONST_REQUEST_AWARDED = 32,
  CONST_REQUEST_CANCEL = 64,
  CONST_REQUEST_SIGN = 512,
  CONST_PAY_AMOUNT = 1024,
  CONST_WORK_IN_PROGRESS = 2048,
  CONST_REQUEST_COMPLETED = 4096,
  CONST_COMPLETE_PAYMENT = 8192,
  CONST_REVIEW_RATE = 16384,
  CONST_REQUEST_REPRATE = 32768,
  CONST_REQUEST_ARBIT = 65536,
  CONST_REQUEST_INVEST = 131072,
}

export enum ClientServiceRequestStatusEnum {
  CONST_REQUEST_CREATED = "SRCrtd",
  CONST_PROVIDER_NOTIFIED = "SRNotf",
  CONST_BID_IN_PROGRESS = "SRBSinP",
  CONST_SUBMIT_BID = "SRAcB",
  CONST_MODIFY_BID = "SRMoB",
  CONST_CHAT_IN_PROGRESS = "SRCiP",
  CONST_REQUEST_AWARDED = "SRAwd",
  CONST_REQUEST_CANCEL = "SRCancl",
  CONST_REQUEST_SIGN = "SRSgnC",
  CONST_PAY_AMOUNT = "SREscrP",
  CONST_WORK_IN_PROGRESS = "SRWinP",
  CONST_REQUEST_COMPLETED = "SRCompd",
  CONST_COMPLETE_PAYMENT = "SRCompdP",
  CONST_REVIEW_RATE = "SRRvw",
  CONST_REQUEST_REPRATE = "SRRply",
  CONST_REQUEST_ARBIT = "SRArb",
  CONST_REQUEST_INVEST = "SRInv",
}

export enum ProviderServiceRequestSequenceEnum {
  CONST_NEW_REQUEST = 0,
  CONST_CLIENT_NOTIFIED = 1,
  CONST_BID_IN_PROGRESS = 2,
  CONST_SUBMIT_BID = 4,
  CONST_MODIFY_BID = 8,
  CONST_CHAT_IN_PROGRESS = 16,
  CONST_REQUEST_AWARDED = 32,
  CONST_REQUEST_CANCEL = 64,
  CONST_SUBMIT_CONTRACT = 128,
  CONST_CONTRACT_EXPIRED = 256,
  CONST_WORK_IN_PROGRESS = 2048,
  CONST_REQUEST_COMPLETED = 4096,
  CONST_REVIEW_RATE = 16384,
  CONST_REQUEST_REPRATE = 32768,
  CONST_REQUEST_ARBITRATION = 65536,
  CONST_REQUEST_INVEST = 131072,
}

export enum ProviderServiceRequestStatusEnum {
  CONST_NEW_REQUEST = "SRPNew",
  CONST_CLIENT_NOTIFIED = "SRPNotf",
  CONST_BID_IN_PROGRESS = "SRPBSinP",
  CONST_SUBMIT_BID = "SRPAcB",
  CONST_MODIFY_BID = "SRPMoB",
  CONST_CHAT_IN_PROGRESS = "SRPCiP",
  CONST_REQUEST_AWARDED = "SRPAwd",
  CONST_REQUEST_CANCEL = "SRPCancl",
  CONST_SUBMIT_CONTRACT = "SRPSuC",
  CONST_CONTRACT_EXPIRED = "SRPCoE",
  CONST_WORK_IN_PROGRESS = "SRPWinP",
  CONST_REQUEST_COMPLETED = "SRPCompd",
  CONST_REVIEW_RATE = "SRPRvw",
  CONST_REQUEST_REPRATE = "SRPRply",
  CONST_REQUEST_ARBITRATION = "SRPArb",
  CONST_REQUEST_INVEST = "SRInv",
}

/////// provider

export interface Provider {
  name: string;
  description: string;
  userLogo: string;
  userId: string;
}

/* // bidRate: Flat or Hourly
export class Provider {
  provider: BasicUserInfo;
  providerChat: UserChat;
  status: number;
  bidAmount: number;
  bidRate: string; 
  bidStartDate: Date;
  bidEndDate: Date;
  bidHours: number;
  lastMessage: string;
  location: Address;
}
 */

export class ProviderRequest {
  basicProfile: BasicProfile;
  requestInfoProvider?: RequestInfoProvider;
  requestInfo?: RequestInfo;
  providerChat: UserChat;
  PropertyQueryInfo?: PropertyQueryInfo;
}

export interface ClientPropRequest {
  basicProfile: BasicProfile;
  requestInfoClient?: RequestInfoClient;
  clientChat: UserChat;
}

export interface PropertyRequest {
  clients: ClientPropRequest[];
  requestInfo: RequestInfo;
}

export interface IProviderRequest {
  basicProfile: BasicProfile;
  requestInfoProvider?: RequestInfoProvider;
  requestInfo: RequestInfo;
  clientChat: UserChat;
}

export interface IProviderRequests {
  providerId: string;
  providerChat: UserChat;
  clients: Array<ProviderRequest>;
}
export class ProviderRequests {
  providerId: string;
  providerChat: UserChat;
  clients: Array<ProviderRequest>;
}

export class RequestProviderInfo {
  providerId: string;
  providerChat: UserChat;
  basicProfile: BasicProfile;
  requestInfo: RequestInfo;
  postalAddress: PostalAddress;
  bidInfo: BidInfo;
}
export interface IRequestProviderInfo {
  providerId: string;
  providerChat: UserChat;
  basicProfile: BasicProfile;
  requestInfo: RequestInfo;
  postalAddress: PostalAddress;
  bidInfo: BidInfo;
}

export interface IProviderInfo {
  requestInfoProvider?: RequestInfoProvider;
  providerChat: UserChat;
  basicProfile: BasicProfile;
}
export class ProviderInfo {
  requestInfoProvider?: RequestInfoProvider;
  providerChat: UserChat;
  basicProfile: BasicProfile;
}

export class RequestInfoProvider {
  appId: string;
  userId: string;
  providerId: string;
  requestId: string;
  clientMsg: string;
  providerMsg: string;
  serviceRequestProviderStatus?: ServiceRequestStatus;
  bidInfo?: BidInfo;
}
export interface IRequestInfoProvider {
  providerId: string;
  requestId: string;
  clientMsg: string;
  providerMsg: string;
  serviceRequestProviderStatus?: ServiceRequestStatus;
  bidInfo?: BidInfo;
}

export interface RequestInfoClient {
  clientId: string;
  requestId: string;
  clientMsg: string;
  providerMsg: string;
  propertyQueryStatus?: ServiceRequestStatus;
  bidInfo?: BidInfo;
}

export interface clientPropertyRequest {
  clientRequests: clientPropRequest[];
  clientId: string;
  message: string;
  clientChat: UserChat;
}

export interface clientPropRequest {
  requestInfo: RequestInfo;
  proivders: ProviderRequest[];
}

export interface PropertyQueryInfo {
  housingId?: string;
  appId: string;
  rentalType: string;
  leaseType: string;
  propertyType: string;
  contactMechId: string;
  propertyStatus?: string;
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
  currency?: string;
  pqueryId?: string;
}

export interface CompanyType {
  enumId: string;
  enumTypeId: string;
  description: string;
  lastUpdatedStamp?: number;
}

export interface CompanyTypes {
  Companies: CompanyType[];
}

@Injectable({
  providedIn: "root",
})

export class CommonModelService {
  constructor() { }
}
