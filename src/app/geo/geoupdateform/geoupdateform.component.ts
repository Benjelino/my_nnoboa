import { Component, Input, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import {
  GeoData,
  GeoModel,
  GeoStatusEnumerations,
  TourismData,
} from "src/app/base-services/common-service/models/common-model.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { Utils } from "src/app/base-services/utility-services/utils";
import { ToastComponent } from "src/app/components/toastComponent";
import { GeoService } from "../services/geo.service";

@Component({
  selector: "app-geoupdateform",
  templateUrl: "./geoupdateform.component.html",
  styleUrls: ["./geoupdateform.component.scss"],
})
export class GeoupdateformComponent implements OnInit {
  @Input() geoModel: GeoModel = null;
  @Input() tourismData: TourismData;
  newGeoModel: GeoModel = null;
  geoData: GeoData = null;
  rForm: UntypedFormGroup = new UntypedFormGroup({});

  geoDataStatus: GeoStatusEnumerations[];

  searchControl: UntypedFormControl;
  searching: any = false;
  loading: any = true;
  searchTerm: string = "";

  isLoggedIn = false;
  userId: string;
  apiKey: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalController: ModalController,
    private geoService: GeoService,
    private remoteSvrc: RemoteService,
    private auth: AuthenticationService,
    private toast: ToastComponent
  ) {
    this.buildForm();
  }

  ngOnInit() {
    //   console.log("geoModel", this.geoModel);

    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.geoService.getGeoEnumData(this.remoteSvrc).subscribe(
      (data) => {
        this.geoDataStatus = data.GeoStatusTypeEnumerations;
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }

  addFormControl(name: string, formGroup: UntypedFormGroup): void {
    this.rForm.addControl(name, formGroup);
  }

  buildForm() {
    this.rForm = this.formBuilder.group({
      status: ["", Validators.compose([Validators.required])],
    });
  }

  async cancelModal() {
    await this.modalController.dismiss(null);
  }

  submitForm(rpost) {
    /*  console.log("submitForm", post);

    this.newGeoModel = {
      country: {
        geoId: post.geo.countryCode.geoId,
        geoName: post.geo.countryCode.geoName,
      },

      city: {
        geoId: post.geo.cityLine.geoId,
        geoName: post.geo.cityLine.geoName,
      },
      district: {
        geoId: post.geo.district.geoId,
        geoName: post.geo.district.geoName,
      },

      region: {
        geoId: post.geo.statePRLine.geoId,
        geoName: post.geo.statePRLine.geoName,
      },
      suburb: {
        geoId: post.geo.suburb.geoId,
        geoName: post.geo.suburb.geoName,
      },
    }; */
    let post = rpost.value;
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
      userId: this.geoModel.userId,
      status: post.status.enumId,
    };

    if (post.geo.suburb != undefined || post.geo.suburb != null) {
      this.geoData.suburbId = post.geo.suburb.geoId;
      this.geoData.suburb = post.geo.suburb.geoName;
    }

    if (Utils.stringNotEmpty(this.geoModel.userId)) {
      this.geoData.userId = this.geoModel.userId;
    } else {
      this.geoData.userId = this.userId;
    }

    this.geoService
      .storeGeoData(this.geoData, null, this.apiKey, this.remoteSvrc)
      .subscribe(
        (data) => {
          this.loading = false;
        },
        (err) => {
          this.toast.presentFailedToast("Error Occured , Please try again !!!");
        }
      );

    //console.log("newGeoModel", this.newGeoModel);
  }
}
