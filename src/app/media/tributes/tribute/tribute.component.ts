import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  ActionSheetController,
  ModalController,
  Platform,
} from "@ionic/angular";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ToastComponent } from "src/app/components/toastComponent";
import * as Models from "src/app/media/services/media-model.service";
import { DcubecmsRemoteService } from "../../services/dcubecms-remote.service";

@Component({
  selector: "app-tribute",
  templateUrl: "./tribute.component.html",
  styleUrls: ["./tribute.component.scss"],
})
export class TributeComponent implements OnInit {
  @Input() mediumId: string;
  isAndroid = false;
  isWeb = false;
  isLoggedIn = false;
  userId = null;
  apiKey = null;
  appId = "";
  userForm: UntypedFormGroup;
  keys: any;
  public tributeType = Models.FunNoteType;
  tributeTypesArray = [];
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;

  constructor(
    private remoteSvrc: DcubecmsRemoteService,
    public fb: UntypedFormBuilder,
    private toast: ToastComponent,
    private plt: Platform,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private auth: AuthenticationService
  ) {
    this.userForm = fb.group({
      author: ["", Validators.compose([Validators.required])],
      title: ["", Validators.compose([Validators.required])],
      content: ["", Validators.compose([Validators.required])],
      ttype: ["", Validators.compose([Validators.required])],
      location: ["", Validators.compose([Validators.required])],
      tag: ["", Validators.compose([Validators.minLength(0)])],
    });

    if (this.plt.is("cordova") || this.plt.is("android")) {
      this.isAndroid = true;
      this.isWeb = false;
    } else {
      this.isAndroid = false;
      this.isWeb = true;
    }

    this.keys = Object.keys(this.tributeType);
    console.log("Keys", JSON.stringify(this.keys));

    this.mapEnumToArray();
  }

  formErrors = {
    author: [],
    title: [],
    content: [],
    tag: [],
    ttype: [],
    location: [],
  };

  validationMessages = {
    author: [{ type: "required", message: "Author is required." }],
    title: [{ type: "required", message: "Title is Required." }],
    content: [{ type: "required", message: "Content is Required" }],
    tag: [{ type: "required", message: "Tag is Required" }],
    ttype: [{ type: "required", message: "Tribute Type is Required" }],
    location: [{ type: "required", message: "Location is Required" }],
  };

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }
    this.appId = AuthenticationService.env.appId;
  }

  dismissClose() {
    this.modalController.dismiss();
  }

  mapEnumToArray() {
    this.tributeTypesArray = [];
    for (var n in this.tributeType) {
      this.tributeTypesArray.push({ value: this.tributeType[n], name: n });
    }
  }

  getRandomString(length) {
    var randomChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }
  formData = new FormData();
  image: any;
  imageSelected(evt) {
    let self = this;

    let files: FileList = evt.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      let file = files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        self.image = reader.result;

        /*  self.images.push(self.image);
        self.fileNames.push(file.name); */

        let file2upload = self.image.split(",", 2)[1];

        const blobFile = new Blob([file2upload]);

        self.formData.append("imageFile", blobFile, this.getRandomString(15));
      };
    }
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source,
    });

    this.image = image.webPath;

    let blob = await fetch(image.webPath).then((r) => r.blob());

    let filename = new Date().getTime().toString();
    this.formData.append("imageFile", blob, filename);
  }

  async selectImageSource() {
    const buttons = [
      {
        text: "Take Photo",
        icon: "camera",
        handler: () => {
          this.addImage(CameraSource.Camera);
        },
      },
      {
        text: "Choose From Photos Photo",
        icon: "image",
        handler: () => {
          this.addImage(CameraSource.Photos);
        },
      },
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is("hybrid")) {
      buttons.push({
        text: "Choose a File",
        icon: "attach",
        handler: () => {
          this.fileInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      buttons,
    });
    await actionSheet.present();
  }

  postTribute(value: any) {
    this.formData.append("author", value.author);
    this.formData.append("appId", this.appId);
    this.formData.append("mediumId", this.mediumId);
    this.formData.append("content", encodeURIComponent(value.content));
    this.formData.append("title", encodeURIComponent(value.title));
    this.formData.append("ttype", value.ttype.value);
    this.formData.append("tag", value.tag);
    this.formData.append("location", value.location);
    this.formData.append("userId", this.userId);

    this.formData.append("datePosted", new Date().getTime() + "");

    this.remoteSvrc.saveTribute(this.formData, null, this.apiKey).subscribe(
      (data) => {
        this.userForm.reset();
        this.formData.delete("author");
        this.formData.delete("content");
        this.formData.delete("title");
        this.formData.delete("mtype");
        this.formData.delete("tag");
        this.formData.delete("userId");
        this.formData.delete("datePosted");
        this.formData.delete("location");
        this.formData.delete("mediumId");
        this.image = null;
        this.toast.presentSuccessToast("Tribute Added Successfully");
        this.modalController.dismiss({ data: data });
      },
      (err) => {
        this.toast.presentFailedToast("Server Error | " + JSON.stringify(err));
      }
    );
  }
}
