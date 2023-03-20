import { Component, Input, OnInit } from "@angular/core";
//import { Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import * as CModels from "src/app/base-services/common-service/models/common-model.service";
import { PopoverController, NavParams } from "@ionic/angular";

import { DataConfigService } from "src/app/base-services/common-service/config-service";
import {
  ProviderRequests,
  IProviderRequests,
  ProviderRequest,
} from "src/app/base-services/common-service/models/common-model.service";

import { Utils } from "src/app/base-services/utility-services/utils";
import { SelectItem } from "src/app/base-services/common-service/models/common-model.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { ClientRequestsService } from "src/app/service-request/services/clientrequests-service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";

const CST_FLAT: string = "Flat";
const CST_HOURLY: string = "Hourly";

@Component({
  selector: "app-client-bid-update",
  templateUrl: "./client-bid-update.component.html",
  styleUrls: ["./client-bid-update.component.scss"],
})
export class ClientBidUpdateComponent implements OnInit {
  currentRequest: ProviderRequest = null;

  title: any;

  /*  public CONST_NEW_REQUEST = 1;
  public CONST_IN_PROGRESS = 8;
  public CONST_AWARDED_BID = 64; */

  public clientRequestStatus = CModels.ClientServiceRequestStatusEnum;
  public clientRequestSequence = CModels.ClientServiceRequestSequenceEnum;

  private CONST_FLAT = "Flat";
  private CONST_ABSOLUTE = "Absolute";

  //form stuff
  public rForm: UntypedFormGroup = new UntypedFormGroup({});

  //datePickerObj: any = {};
  startDate: Date = new Date();
  endDate: Date = new Date();
  ceDate: Date = new Date();
  displayCE: boolean = false;
  displayTothrs: boolean = true;

  appId = "";
  userId: string;
  apiKey: string;

  private currentStartDate: Date = null;
  private currentEndDate: Date = null;
  public currentCEDate: Date = null;

  @Input()
  public requestId;
  @Input()
  public pqueryId;
  @Input()
  public ppId;
  @Input()
  public cliendId;
  @Input()
  public providerId;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private popoverCtrl: PopoverController,
    private navParams: NavParams,
    private configService: DataConfigService,
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    private clientRequestsService: ClientRequestsService,
    private events: Events
  ) {
    //console.log('ProviderDashboardPopoverComponent::constructor() this.navParams.data: ' + JSON.stringify(this.navParams.data));
    this.currentRequest = this.navParams.data.request;
    this.title = this.navParams.data.title;

    this.buildForm();

    this.setFormData();

    this.appId = AuthenticationService.env.appId;

    let userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;
  }

  formErrors = {
    ceDate: [],
    nameSign: [],
  };

  validationMessages = {
    ceDate: [
      { type: "required", message: "End Date is Required" },
      { type: "dateAfter", message: "Must be after today" },
    ],
    nameSign: [{ type: "required", message: "End Date is Required" }],
  };

  ngOnInit() {
    this.currentCEDate = new Date();
    if (
      this.currentRequest.requestInfo.serviceRequestStatus.statusNum >=
      this.clientRequestSequence.CONST_REQUEST_AWARDED
    ) {
      this.displayCE = true;
      const ceDate = this.rForm.get("ceDate");
      const nameSign = this.rForm.get("nameSign");
      ceDate.setValidators([Validators.required]);
      nameSign.setValidators([Validators.required]);
      this.rForm.setValidators(this.customValidatorForm());
    }
  }

  customValidatorForm() {
    return (fg: UntypedFormGroup) => {
      const startDate = new Date().getTime();
      const ceDate = new Date(fg.get("ceDate").value).getTime();
      const error =
        startDate && ceDate && ceDate >= startDate ? null : { dateAfter: true };

      fg.get("ceDate").setErrors(error);
      return error;
    };
  }

  buildForm() {
    this.rForm = this.formBuilder.group({
      amount: [1, Validators.compose([Validators.required])],
      numberHrs: "",
      sdate: "",
      edate: "",
      ceDate: "",
      comment: "",
      nameSign: "",
    });
  }

  setFormData() {
    // amount: this.regData.amount
    // amount: this.amountRange[0].value
    if (this.currentRequest) {
      this.rForm.patchValue({
        amount: this.currentRequest.requestInfoProvider.bidInfo.bidAmount,
        comment: this.currentRequest.requestInfoProvider.bidInfo.bidComment,
      });
    }
  }

  getFormData() {
    let post = this.rForm.value;
    /*  this.currentRequest.requestInfoProvider.bidInfo.bidAmount = post.amount;
    this.currentRequest.requestInfo.awardedAmount = post.amount;
    this.currentRequest.requestInfo.numberHrs = post.numberHrs;
    this.currentRequest.requestInfo.startDate = post.sdate;
    this.currentRequest.requestInfo.endDate = post.edate; */
  }

  async dismissModal() {
    this.getFormData();
    console.log(
      "ProviderDashboardPopoverComponent::dismissModal() this.currentRequest:",
      JSON.stringify(this.currentRequest)
    );

    let post = this.rForm.value;

    this.clientRequestsService
      .acceptBid_Client(
        this.appId,
        this.requestId,
        this.cliendId,
        this.providerId,
        this.ppId,
        this.pqueryId,
        post.amount,
        this.apiKey,
        this.remoteSvrc,
        post.comment
      )

      .then((data) => {
        if ((<any>data).httpStatus === "200") {
          this.events.publish("clientrequest:created", {
            user: null,
            time: new Date(),
          });
        }
      })
      .catch((err) => {});

    await this.popoverCtrl.dismiss({
      request: this.currentRequest,
      submit: true,
    });
  }

  async cancelModal() {
    //this.getFormData();

    await this.popoverCtrl.dismiss({ submit: false });
  }
}
