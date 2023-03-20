import { Injectable } from "@angular/core";

export const CURRENT_USER = "currentUser";

export const SUCCESS = "Success";
export const SUCCESSFUL = "Successful";
export const SUCCESSFULLY = "Successfully";
export const ERROR = "Error";
export const DUPLICATE = "Duplicate";

//export const URL_REMOTE_HTTP = "http://moqui.sabonay.com/";
//export const URL_REMOTE_HTTPS = "https://moqui.sabonay.com/";
export const URL_REMOTE_HTTP = "http://dev.sabonay.com/";
export const URL_REMOTE_HTTPS = "https://dev.sabonay.com/";
//export const URL_REMOTE_HTTP = "http://test.sabonay.com/";
//export const URL_REMOTE_HTTPS = "https://test.sabonay.com/";
//export const URL_LOCALHOST = 'http://10.0.0.126:8888/';
//export const URL_LOCALHOST = 'http://localhost:8886/';
//export const URL_LOCALHOST = 'http://localhost:8080/';
//export const URL_REMOTE_HTTP = URL_LOCALHOST;
//export const URL_REMOTE_HTTPS = URL_LOCALHOST;

// dcube-auth
export const URL_LIVE_MOQUI_AUTH_REST = URL_REMOTE_HTTPS + "rest/s1/auth/";
export const URL_MOQUI_AUTH_REST = URL_LIVE_MOQUI_AUTH_REST;

export const URL_DEV_DCUBEAUTH = URL_REMOTE_HTTP + "apps/dcubeauth/";
export const URL_LIVE_DCUBEAUTH = URL_REMOTE_HTTPS + "apps/dcubeauth/";
export const URL_MOQUI_DCUBEAUTH = URL_LIVE_DCUBEAUTH;

// profile
export const URL_LIVE_MOQUI_PROFILE_REST =
  URL_REMOTE_HTTPS + "rest/s1/profile/";
export const URL_MOQUI_PROFILE_REST = URL_LIVE_MOQUI_PROFILE_REST;

// event
export const URL_LIVE_MOQUI_EVENT_REST = URL_REMOTE_HTTPS + "rest/s1/events/";
export const URL_MOQUI_EVENT_REST = URL_LIVE_MOQUI_EVENT_REST;

// dcube-utils
export const URL_LIVE_MOQUI_DUTILS_REST = URL_REMOTE_HTTPS + "rest/s1/dutils/";
export const URL_MOQUI_DUTILS_REST = URL_LIVE_MOQUI_DUTILS_REST;

export const URL_LIVE_MOQUI_DUTILS_REST_NOAUTH =
  URL_REMOTE_HTTPS + "rest/s1/dutilsna/";
export const URL_MOQUI_DUTILS_REST_NOAUTH = URL_LIVE_MOQUI_DUTILS_REST_NOAUTH;

export const URL_LIVE_MOQUI_DUTILS_REST_NOAUTHR =
  URL_REMOTE_HTTPS + "rest/s1/dutilsnar/";
export const URL_MOQUI_DUTILS_REST_NOAUTHR = URL_LIVE_MOQUI_DUTILS_REST_NOAUTHR;

// dcube-cms
export const URL_LIVE_MOQUI_DCUBECMS_REST =
  URL_REMOTE_HTTPS + "rest/s1/dcubecms/";
export const URL_MOQUI_DCUBECMS_REST = URL_LIVE_MOQUI_DCUBECMS_REST;

export const URL_LIVE_MOQUI_DCUBECMS_REST_NOAUTH =
  URL_REMOTE_HTTPS + "rest/s1/cmsna/";
export const URL_MOQUI_DCUBECMS_REST_NOAUTH =
  URL_LIVE_MOQUI_DCUBECMS_REST_NOAUTH;

export const URL_DEV_TNA_CMS = URL_REMOTE_HTTP + "apps/cmstna/";
export const URL_LIVE_TNA_CMS = URL_REMOTE_HTTPS + "apps/cmstna/";
export const URL_MOQUI_TNA_CMS = URL_LIVE_TNA_CMS;

// scomcenter
export const URL_LIVE_SCOM_REST = URL_REMOTE_HTTPS + "rest/s1/scom/";
export const URL_DEV_SCOM_REST = URL_REMOTE_HTTP + "rest/s1/scom/";
export const URL_MOQUI_SCOM_REST = URL_LIVE_SCOM_REST;

// matrix for instant messaging
export const URL_LIVE_MOQUI_MATRIX_REST =
  URL_REMOTE_HTTPS + "rest/s1/matrixrs/";
export const URL_MOQUI_MATRIX_REST = URL_LIVE_MOQUI_MATRIX_REST;

export const URL_LIVE_MOQUI_MATRIX_NA_REST =
  URL_REMOTE_HTTPS + "rest/s1/matrixna/";
export const URL_MOQUI_MATRIX_NA_REST = URL_LIVE_MOQUI_MATRIX_NA_REST;

export const URL_LIVE_MOQUI_GRP_MATRIX_REST =
  URL_REMOTE_HTTPS + "rest/s1/matrixgp/";
export const URL_MOQUI_GRP_MATRIX_REST = URL_LIVE_MOQUI_GRP_MATRIX_REST;

// questions and answers forum
export const URL_LIVE_MOQUI_QAAFORUM_REST =
  URL_REMOTE_HTTPS + "rest/s1/qaaforum/";
export const URL_MOQUI_QAAFORUM_REST = URL_LIVE_MOQUI_QAAFORUM_REST;

export const URL_LIVE_MOQUI_QAAFORUM_SEARCH =
  URL_REMOTE_HTTPS + "rest/s1/qaafsearch/";
export const URL_MOQUI_QAAFORUM_SEARCH = URL_LIVE_MOQUI_QAAFORUM_SEARCH;

// elasticsearch
export const URL_LIVE_MOQUI_ES_CMS = URL_REMOTE_HTTPS + "rest/s1/cmssearch/";
export const URL_MOQUI_ES_CMS = URL_LIVE_MOQUI_ES_CMS;

export const URL_LIVE_MOQUI_ES_CMS_NOAUTH =
  URL_REMOTE_HTTPS + "rest/s1/cmsnasearch/";
export const URL_MOQUI_ES_CMS_NOAUTH = URL_LIVE_MOQUI_ES_CMS_NOAUTH;

// tourcesearch
export const URL_LIVE_MOQUI_ES_TOUR = URL_REMOTE_HTTPS + "rest/s1/toursearch/";
export const URL_MOQUI_ES_TOUR = URL_LIVE_MOQUI_ES_TOUR;

export const URL_LIVE_MOQUI_ES_TOUR_NOAUTH =
  URL_REMOTE_HTTPS + "rest/s1/toursearch/";
export const URL_MOQUI_ES_TOUR_NOAUTH = URL_LIVE_MOQUI_ES_TOUR_NOAUTH;

// dcube-payment utils
export const URL_LIVE_MOQUI_PAY_REST = URL_REMOTE_HTTPS + "rest/s1/dpymtmoq/";
export const URL_MOQUI_PAY_REST = URL_LIVE_MOQUI_PAY_REST;

export const URL_LIVE_MOQUI_PAY_NA_REST =
  URL_REMOTE_HTTPS + "rest/s1/pymtsrvcna/";
export const URL_MOQUI_PAY_NA_REST = URL_LIVE_MOQUI_PAY_NA_REST;

// dcube-payment MTN
export const URL_LIVE_MOQUI_PAY_MTN_REST =
  URL_REMOTE_HTTPS + "rest/s1/pymtsrvcmtn/";
export const URL_MOQUI_PAY_MTN_REST = URL_LIVE_MOQUI_PAY_MTN_REST;

// dcube-payment ECO
export const URL_LIVE_MOQUI_PAY_ECO_REST =
  URL_REMOTE_HTTPS + "rest/s1/pymtsrvceco/";
export const URL_MOQUI_PAY_ECO_REST = URL_LIVE_MOQUI_PAY_ECO_REST;

// dcube-payment HTL
export const URL_LIVE_MOQUI_PAY_HTL_REST =
  URL_REMOTE_HTTPS + "rest/s1/pymtsrvchtl/";
export const URL_MOQUI_PAY_HTL_REST = URL_LIVE_MOQUI_PAY_HTL_REST;

// dcube-payment UWT
export const URL_LIVE_MOQUI_PAY_UWT_REST =
  URL_REMOTE_HTTPS + "rest/s1/pymtsrvcuw/";
export const URL_MOQUI_PAY_UWT_REST = URL_LIVE_MOQUI_PAY_UWT_REST;

// dcube-payment STP
export const URL_LIVE_MOQUI_PAY_STP_REST =
  URL_REMOTE_HTTPS + "rest/s1/pymtsrvcstp/";
export const URL_MOQUI_PAY_STP_REST = URL_LIVE_MOQUI_PAY_STP_REST;

export const URL_DEV_MOQUI_PYMT_NA = URL_REMOTE_HTTP + "apps/pymtsrvcna/";
export const URL_LIVE_MOQUI_PYMT_NA = URL_REMOTE_HTTPS + "apps/pymtsrvcna/";
export const URL_MOQUI_PYMT_NA = URL_LIVE_MOQUI_PYMT_NA;

export const URL_MOQUI_PYMT_ECO = URL_MOQUI_PYMT_NA + "ecogh";
export const URL_MOQUI_PYMT_HTL = URL_MOQUI_PYMT_NA + "hubtel";
export const URL_MOQUI_PYMT_MTN = URL_MOQUI_PYMT_NA + "mtnmomo";
export const URL_MOQUI_PYMT_UW = URL_MOQUI_PYMT_NA + "uniwallet";
export const URL_MOQUI_PYMT_STP = URL_MOQUI_PYMT_NA + "stripe";

// dcube-utils
export const URL_LIVE_MOQUI_UTILS_AUTH = URL_REMOTE_HTTPS + "apps/dcubeutils/";
export const URL_MOQUI_DUTILS_AUTH = URL_LIVE_MOQUI_UTILS_AUTH;

export const URL_LIVE_MOQUI_UTILS_NOAUTH =
  URL_REMOTE_HTTPS + "apps/dutilsnoauth/";
export const URL_MOQUI_DUTILS_NOAUTH = URL_LIVE_MOQUI_UTILS_NOAUTH;

// payments
export const URL_DEV_MOQUI_PYMT = URL_REMOTE_HTTP + "apps/dpayments/";
export const URL_LIVE_MOQUI_PYMT = URL_REMOTE_HTTPS + "apps/dpayments/";
export const URL_MOQUI_PYMT = URL_LIVE_MOQUI_PYMT;

export const URL_DEV_MOQUI_MTN = URL_REMOTE_HTTP + "apps/pymtsrvcmtn/";
export const URL_LIVE_MOQUI_MTN = URL_REMOTE_HTTPS + "apps/pymtsrvcmtn/";
export const URL_MOQUI_MTN = URL_LIVE_MOQUI_MTN;

export const URL_DEV_MOQUI_ECOBANK = URL_REMOTE_HTTP + "apps/pymtsrvceco/";
export const URL_LIVE_MOQUI_ECOBANK = URL_REMOTE_HTTPS + "apps/pymtsrvceco/";
export const URL_MOQUI_ECOBANK = URL_LIVE_MOQUI_ECOBANK;

export const URL_DEV_MOQUI_HUBTEL = URL_REMOTE_HTTP + "apps/pymtsrvchtl/";
export const URL_LIVE_MOQUI_HUBTEL = URL_REMOTE_HTTPS + "apps/pymtsrvchtl/";
export const URL_MOQUI_HUBTEL = URL_LIVE_MOQUI_HUBTEL;

export const URL_DEV_MOQUI_UNIWALLET = URL_REMOTE_HTTP + "apps/pymtsrvcuw/";
export const URL_LIVE_MOQUI_UNIWALLET = URL_REMOTE_HTTPS + "apps/pymtsrvcuw/";
export const URL_MOQUI_UNIWALLET = URL_LIVE_MOQUI_UNIWALLET;

// matrix for instant messaging
export const URL_DEV_MOQUI_MATRIX = URL_REMOTE_HTTP + "apps/matrix/";
export const URL_LIVE_MOQUI_MATRIX = URL_REMOTE_HTTPS + "apps/matrix/";
export const URL_MOQUI_MATRIX = URL_LIVE_MOQUI_MATRIX;

// tourism
export const URL_LIVE_MOQUI_TOUR_NO_AUTH =
  URL_REMOTE_HTTPS + "rest/s1/tourismna/";
export const URL_MOQUI_TOUR_NO_AUTH = URL_LIVE_MOQUI_TOUR_NO_AUTH;

export const URL_LIVE_MOQUI_TOUR = URL_REMOTE_HTTPS + "rest/s1/tourism/";
export const URL_MOQUI_TOUR = URL_LIVE_MOQUI_TOUR;

// Geo
export const URL_LIVE_MOQUI_GEO_NO_AUTH = URL_REMOTE_HTTPS + "rest/s1/geona/";
export const URL_MOQUI_GEO_NO_AUTH = URL_LIVE_MOQUI_GEO_NO_AUTH;

export const URL_LIVE_MOQUI_GEO = URL_REMOTE_HTTPS + "rest/s1/geo/";
export const URL_MOQUI_GEO = URL_LIVE_MOQUI_GEO;

// service request
export const URL_LIVE_MOQUI_DCUBE_APP_SR =
  URL_REMOTE_HTTPS + "rest/s1/dcubeappsr/";
export const URL_MOQUI_SR_REST = URL_LIVE_MOQUI_DCUBE_APP_SR;

export const URL_LIVE_MOQUI_DCUBE_APP_SRC =
  URL_REMOTE_HTTPS + "rest/s1/dcubeappsrc/";
export const URL_MOQUI_SRC_REST = URL_LIVE_MOQUI_DCUBE_APP_SRC;

export const URL_LIVE_MOQUI_DCUBE_APP_SRP =
  URL_REMOTE_HTTPS + "rest/s1/dcubeappsrp/";
export const URL_MOQUI_SRP_REST = URL_LIVE_MOQUI_DCUBE_APP_SRP;

// dcube-sheet
export const URL_MOQUI_SHEET_REST = URL_REMOTE_HTTPS + "rest/s1/sheet/";

// printapp
export const URL_MOQUI_PRINTAPP = URL_REMOTE_HTTPS + "rest/s1/print/";

// Housing
export const URL_LIVE_MOQUI_HOUSING_NO_AUTH =
  URL_REMOTE_HTTPS + "rest/s1/housingna/";
export const URL_MOQUI_HOUSING_NO_AUTH = URL_LIVE_MOQUI_HOUSING_NO_AUTH;

export const URL_LIVE_MOQUI_HOUSING = URL_REMOTE_HTTPS + "rest/s1/housing/";
export const URL_MOQUI_HOUSING = URL_LIVE_MOQUI_HOUSING;

//Property
export const URL_LIVE_MOQUI_PROPERTY =
  URL_REMOTE_HTTPS + "rest/s1/propertysrc/";
export const URL_MOQUI_PROPERTY = URL_LIVE_MOQUI_PROPERTY;

export const URL_LIVE_MOQUI_PROPERTY_SR =
  URL_REMOTE_HTTPS + "rest/s1/propertysr/";
export const URL_MOQUI_PROPERTY_SR = URL_LIVE_MOQUI_PROPERTY_SR;


// webscraper debug
export const URL_MOQUI_DEBUG_REST = URL_REMOTE_HTTPS + "rest/s1/debug/";

// equity crowd funding
export const URL_MOQUI_ECFUND_REST = URL_REMOTE_HTTPS + "rest/s1/ecfund/";
export const URL_MOQUI_ECFUND_REST_NO_AUTH = URL_REMOTE_HTTPS + "rest/s1/ecfundna/";

//export const USERNAME = 'john.doe';
//export const PASSWORD = 'moqui';

/*
  Author: Stephen Agyepong
*/

@Injectable({
  providedIn: "root",
})
export class AppConstantsService {
  constructor() {}
}
