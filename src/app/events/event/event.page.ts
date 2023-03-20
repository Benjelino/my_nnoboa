import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastComponent } from "src/app/components/toastComponent";

import * as Models from "src/app/media/services/media-model.service";
import {
  RxFormBuilder,
  RxwebValidators,
} from "@rxweb/reactive-form-validators";
import { DcubecmsRemoteService } from "src/app/media/services/dcubecms-remote.service";
import { EventService } from "../services/event.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";

@Component({
  selector: "app-event",
  templateUrl: "./event.page.html",
  styleUrls: ["./event.page.scss"],
})
export class EventPage implements OnInit {
  mediumId = null;
  isLoading = false;
  isSaved = false;
  public medium: Models.Medium;
  label: string;
  appId = "";
  userForm: UntypedFormGroup;
  public response: Models.AnnoucementResponse;
  public keys: any;
  userId: string;
  apiKey: string;

  formErrors = {
    locationName: [],
    description: [],
    startDate: [],
    endDate: [],
    locationGPS: [],
  };

  validationMessages = {
    locationName: [
      { type: "required", message: "Event Location Name is required." },
    ],
    description: [{ type: "required", message: "Description is Required." }],
    startDate: [{ type: "required", message: "Start Date is Required" }],
    endDate: [
      { type: "required", message: "End Date is Required" },
      { type: "dateAfter", message: "Must be after start date" },
    ],
    locationGPS: [
      { type: "minLength", message: "Cannot be less than 11 letters" },
      { type: "mxLength", message: "Must be after start date" },
    ],
  };

  customValidatorForm() {
    return (fg: UntypedFormGroup) => {
      const startDate = new Date(fg.get("startDate").value).getTime();
      const endDate = new Date(fg.get("endDate").value).getTime();
      const error =
        startDate && endDate && endDate >= startDate
          ? null
          : { dateAfter: true };

      fg.get("endDate").setErrors(error);
      return error;
    };
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private remoteSvrc: DcubecmsRemoteService,
    private eventSvrc: EventService,
    public fb: UntypedFormBuilder,
    private fb1: RxFormBuilder,
    public events: Events,
    private toast: ToastComponent,
    private auth: AuthenticationService
  ) {
    this.userForm = this.fb.group(
      {
        locationName: ["", Validators.compose([Validators.required])],
        description: ["", Validators.compose([Validators.required])],
        startDate: ["", Validators.compose([Validators.required])],
        endDate: ["", [Validators.required]],
        attendNotes: ["", [Validators.required]],
        locationGPS: ["", [Validators.minLength(11), Validators.maxLength(12)]],
      },
      { validators: this.customValidatorForm() }
    );
  }

  ngOnInit() {
    this.mediumId = this.activatedRoute.snapshot.paramMap.get("mediumId");
    this.userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;
    this.appId = AuthenticationService.env.appId;
    this.label = "Annoucement Info";
    this.remoteSvrc
      .getMedium(this.mediumId, this.userId, null, this.apiKey, this.appId)
      .subscribe(
        (data) => {
          this.isLoading = false;
          this.medium = data;
          this.isLoading = true;
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }

  Save(value: any) {
    let event1: Models.Event = {
      description: value.description,
      endDate: value.endDate,
      startDate: value.startDate,
      locationName: value.locationName,
      userId: this.userId,
      mediumId: this.mediumId,
      locationGPS: value.locationGPS,
    };

    this.eventSvrc.storeEvent(event1, null, this.apiKey).subscribe(
      (data) => {
        this.isSaved = false;
        this.response = data;
        this.isSaved = true;

        this.userForm.reset();
        this.toast.presentSuccessToast("Event Added Successfully");
      },
      (err) => {
        this.toast.presentFailedToast("Server Error | " + JSON.stringify(err));
      }
    );
  }
}
