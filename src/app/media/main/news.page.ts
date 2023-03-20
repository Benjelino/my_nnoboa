import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";

import { ActivatedRoute } from "@angular/router";

import { ActionSheetController, Platform } from "@ionic/angular";

import { Crop } from "@ionic-native/crop/ngx";

import { ToastComponent } from "../../components/toastComponent";
import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as Models from "src/app/media/services/media-model.service";

import { Location } from "@angular/common";

import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

@Component({
  selector: "app-news",
  templateUrl: "./news.page.html",
  styleUrls: ["./news.page.scss"],
})
export class NewsPage implements OnInit {
  constructor(
    private auth: AuthenticationService,
    public fb: UntypedFormBuilder,

    private crop: Crop,
    public actionSheetController: ActionSheetController,
    private plt: Platform,
    private remoteSvrc: RemoteService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastComponent,
    private location: Location,

    private events: Events
  ) {
    this.userForm = fb.group({
      author: ["", Validators.compose([Validators.required])],
      title: ["", Validators.compose([Validators.required])],
      content: ["", Validators.compose([Validators.required])],
      tag: ["", Validators.compose([Validators.minLength(0)])],
    });

    this.keys = Object.keys(this.mediaType).filter((k) => !isNaN(Number(k)));

    if (this.plt.is("cordova") || this.plt.is("android")) {
      this.isAndroid = true;
      this.isWeb = false;
    } else {
      this.isAndroid = false;
      this.isWeb = true;
    }
  }

  appId = "";
  content: any;
  userForm: UntypedFormGroup;
  croppedImagepath = "";
  isLoading = false;
  public response: Models.AnnoucementResponse;
  public mediaType = Models.mediumType;
  public keys: any;
  mediaTypeId = 1;
  showEditor = false;

  isAndroid = false;
  isWeb = false;
  isLoggedIn = false;
  userId = null;
  apiKey = null;
  public editorOptions: Object;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  formErrors = {
    author: [],
    title: [],
    content: [],
    mtype: [],
  };

  validationMessages = {
    author: [{ type: "required", message: "Author is required." }],
    mtype: [{ type: "required", message: "Medium Type Required." }],
    title: [{ type: "required", message: "Title Required" }],
    content: [{ type: "required", message: "Content Required" }],
  };

  ngOnInit() {
    this.editorOptions = {
      anchor_bottom: false,
      anchor_top: false,
      autoresize_bottom_margin: 10,
      autoresize_min_height: 40,
      branding: false,
      language: "en",
      inline: true,
      fixed_toolbar_container: ".tiny-mce-toolbar",
      menubar: false,
      statusbar: false,
      default_link_target: "_blank",
      link_assume_external_targets: true,
      target_list: false,
      link_title: false,
      skin_url: "assets/tinymce/skins/lightgray",
      plugins: "autoresize link lists",
      toolbar:
        "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link unlink",
    };

    this.mediaTypeId = Number(this.activatedRoute.snapshot.paramMap.get("id"));

    this.isLoggedIn = this.auth.isAuthenticated();
    if (this.isLoggedIn == true) {
      this.userId = this.auth.getUserLogin().userId;
      this.apiKey = this.auth.getUserLogin().apikey;
    }

    this.appId = AuthenticationService.env.appId;

    let myUserDetails = this.auth.getUserLogin();

    if (myUserDetails.isShowEditor == "Y") {
      this.showEditor = true;
    } else {
      this.showEditor = false;
    }
  }

  formData = new FormData();

  postNews(value: any) {
    const url = AppConstants.URL_MOQUI_DCUBECMS_REST + "saveMedium";

    this.formData.append("author", value.author);
    this.formData.append("appId", this.appId);
    this.formData.append("content", encodeURIComponent(value.content));
    this.formData.append("title", encodeURIComponent(value.title));
    this.formData.append("mtype", this.mediaTypeId.toString());
    this.formData.append("tag", value.tag);
    this.formData.append("userId", this.userId);

    this.formData.append("datePosted", new Date().getTime() + "");

    return new Promise((resolve, reject) => {
      this.remoteSvrc
        .postHttpApikeyFormData(url, this.formData, null, this.apiKey)
        .subscribe(
          (data) => {
            if (Models.mediumType.Announcement == this.mediaTypeId) {
              this.events.publish("announcement:update", {
                user: null,
                time: new Date(),
              });
            } else if (Models.mediumType.News == this.mediaTypeId) {
              this.events.publish("news:update", {
                user: null,
                time: new Date(),
              });
            } else if (Models.mediumType.Opinion == this.mediaTypeId) {
              this.events.publish("opinion:update", {
                user: null,
                time: new Date(),
              });
            } else if (Models.mediumType.Story == this.mediaTypeId) {
              this.events.publish("story:update", {
                user: null,
                time: new Date(),
              });
            }

            resolve(data);
            this.userForm.reset();

            this.formData.delete("author");
            this.formData.delete("content");
            this.formData.delete("title");
            this.formData.delete("mtype");
            this.formData.delete("tag");
            this.formData.delete("userId");
            this.formData.delete("datePosted");

            this.image = null;
            this.toast.presentSuccessToast(
              "New " + this.mediaType[this.mediaTypeId] + " Saved Successfully"
            );
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  postNews2(value: any) {
    let medium: Models.Medium;
    medium.author = value.author;
    medium.content = value.content;
    medium.title = value.title;
    medium.mtype = value.mtype;
    medium.tag = value.tag;
  }

  mtype = "1";
  ionChangeMediaType(evt) {
    this.mtype = evt["detail"]["value"];
  }

  image: any;
  images = [];
  fileNames = [];

  imageSelected(evt) {
    let self = this;

    let files: FileList = evt.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      let file = files[0];

      reader.readAsDataURL(file);
      reader.onload = () => {
        self.image = reader.result;

        self.images.push(self.image);
        self.fileNames.push(file.name);

        let file2upload = self.image.split(",", 2)[1];

        const blobFile = new Blob([file2upload]);

        self.formData.append("imageFile", blobFile, this.getRandomString(15));
      };
    }
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 }).then(
      (newPath) => {
        this.showCroppedImage(newPath.split("?")[0]);
      },
      (error) => {
        alert("Error cropping image" + error);
      }
    );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    const copyPath = ImagePath;
    const splitPath = copyPath.split("/");
    const imageName = splitPath[splitPath.length - 1];
  }

  goBack() {
    this.location.back();
  }

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;

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

  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript

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
}

import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { File } from "@ionic-native/file/ngx";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { Events } from "src/app/base-services/publish-subscribe/events.service";
defineCustomElements(window);
