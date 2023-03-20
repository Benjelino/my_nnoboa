import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import {
  GeoData,
  GeoModel,
  GeoStatusEnumerations,
  TourismData,
  TourismTypeEnumerations,
} from "src/app/base-services/common-service/models/common-model.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
import { GeoService } from "src/app/geo/services/geo.service";

@Component({
  selector: "app-tourdataupdateform",
  templateUrl: "./tourdataupdateform.component.html",
  styleUrls: ["./tourdataupdateform.component.scss"],
})
export class TourdataupdateformComponent implements OnInit {
  userForm: UntypedFormGroup;
  tourismTypes: TourismTypeEnumerations[];
  geoDataStatus: GeoStatusEnumerations[];
  @Input() tourismData: TourismData;
  @Input() geoModel: GeoModel = null;
  defaultTourismType: TourismTypeEnumerations;

  isLoggedIn = false;
  userId: string;
  geoUserId: string;
  apiKey: string;

  constructor(
    private auth: AuthenticationService,
    private remoteSvrc: RemoteService,
    public fb: UntypedFormBuilder,
    private geoService: GeoService,
    private toast: ToastComponent,
    private modalController: ModalController
  ) {
    this.userForm = fb.group({
      tourismType: ["", Validators.compose([Validators.required])],
      tourismName: ["", Validators.compose([Validators.required])],
      tourismLocation: ["", Validators.compose([Validators.required])],
      phone: ["", Validators.compose([Validators.required])],
      grade: ["", Validators.compose([Validators.required])],
      tourismCost: ["", Validators.compose([Validators.required])],
      capacity: ["", Validators.compose(null)],
      status: ["", Validators.compose([Validators.required])],
    });
  }

  validationMessages = {
    tourismType: [{ type: "required", message: "Tourism Type is Required." }],
    tourismName: [{ type: "required", message: "Tourism Name is Required" }],
    tourismLocation: [
      { type: "required", message: "Tourism Location is Required" },
    ],
    phone: [{ type: "required", message: "Phone is Required" }],
    grade: [{ type: "required", message: "Grade is Required" }],
    tourismCost: [{ type: "required", message: "Tourism Cost is Required" }],
    capacity: [{ type: "required", message: "Capacity is Required" }],
    status: [{ type: "required", message: "Status is Required" }],
  };

  addFormControl(name: string, formGroup: UntypedFormGroup): void {
    this.userForm.addControl(name, formGroup);
  }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.geoService.getTourismTypes(this.remoteSvrc).subscribe(
      (data) => {
        this.tourismTypes = data.TourismTypeEnumerations;
        this.setData();
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );

    this.geoService.getGeoEnumData(this.remoteSvrc).subscribe(
      (data) => {
        this.geoDataStatus = data.GeoStatusTypeEnumerations;
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }

  setData() {
    if (this.tourismData != null) {
      this.defaultTourismType = this.tourismTypes.find(
        (a) => a.enumId == this.tourismData.tourismType
      );

      // console.log("tourism type ", this.defaultTourismType);

      this.userForm.patchValue({
        tourismType: this.defaultTourismType,
        tourismName: this.tourismData.tourismName,
        tourismLocation: this.tourismData.tourismLocation,
        phone: this.tourismData.phone,
        grade: this.tourismData.grade,
        tourismCost: this.tourismData.tourismCost,
        capacity: this.tourismData.capacity,
        status: this.tourismData.GeoData.status,
        cost: this.tourismData.tourismCost,
      });
    }
  }

  async cancelModal() {
    await this.modalController.dismiss(null);
  }

  geoData: GeoData = null;
  async submitForm(rpost) {
    let post = rpost;
    console.log("submitForm", post);
    if (Utils.stringNotEmpty(this.geoModel.userId)) {
      this.geoUserId = this.geoModel.userId;
    } else {
      this.geoUserId = this.userId;
    }

    // let post = rpost.value;
    this.geoData = {
      geoDataId: this.geoModel.geoId,
      country: post.geo.countryCode.geoName,
      countryId: post.geo.countryCode.geoId,
      city: post.geo.cityLine.geoName,
      cityId: post.geo.cityLine.geoId,
      district: post.geo.district.geoName,
      districtId: post.geo.district.geoId,
      region: post.geo.statePRLine.geoName,
      regionId: post.geo.statePRLine.geoId,
      userId: this.geoUserId,
      status: post.status.enumId,
    };

    if (post.geo.suburb != undefined || post.geo.suburb != null) {
      this.geoData.suburbId = post.geo.suburb.geoId;
      this.geoData.suburb = post.geo.suburb.geoName;
    }

    let approved = "approved";
    if (
      Utils.stringNotEmpty(this.geoData.status) &&
      approved == this.geoData.status
    ) {
      this.geoData.status = "UD";
    }

    /*   this.geoService
      .storeGeoData(this.geoData, null, this.apiKey, this.remoteSvrc)
      .subscribe(
        (data) => {
          //this.loading = false;
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      ); */

    //save tourism data
    let data: TourismData = {
      tourismId: this.tourismData.tourismId,
      tourismType: post.tourismType.enumId,
      tourismName: post.tourismName,
      tourismLocation: post.tourismLocation,
      phone: post.phone,
      grade: post.grade,
      tourismCost: post.tourismCost,
      capacity: post.capacity,
      region: post.geo.statePRLine.geoId,
      userId: this.geoUserId,
      directions: post.geo.direction,
    };

    this.geoService
      .storeGeoTourData(
        this.geoUserId,
        this.geoData,
        data,
        null,
        this.apiKey,
        this.remoteSvrc
      )
      .subscribe(
        (data) => {
          //this.loading = false;
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );

    await this.modalController.dismiss(null);
  }
}
