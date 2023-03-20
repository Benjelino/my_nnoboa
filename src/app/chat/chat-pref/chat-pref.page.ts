import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

import * as Models from "src/app/chat/services/chat-model.service";
import * as CModels from "src/app/base-services/common-service/models/common-model.service";

import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { ToastComponent } from "src/app/components/toastComponent";
import { ProfileService } from "src/app/profile/services/profile.service";

@Component({
  selector: "app-chat-pref",
  templateUrl: "./chat-pref.page.html",
  styleUrls: ["./chat-pref.page.scss"],
})
export class ChatPrefPage implements OnInit {
  userForm: UntypedFormGroup;
  public response: CModels.UserPrefResponse;
  public YesNoEnum = CModels.YesNo;
  public ThemeEnum = CModels.Theme;
  public PresenceEnum = CModels.Presence;
  public YesNokeys: any;
  public Themekeys: any;
  public Presencekeys: any;
  userId: string;
  apiKey: string;
  userPref: CModels.UserPrefs;
  isLoading = false;
  public chatStatusTypes: Models.ChatStatusTypeList;

  formErrors = {
    theme: [],
    audioEnabled: [],
    browserNotificationsEnable: [],
    presence: [],
    statusMsg: [],
  };

  validationMessages = {
    theme: [{ type: "required", message: "Theme is required." }],
    audioEnabled: [{ type: "required", message: "Audio Enabled is Required." }],
    browserNotificationsEnable: [
      { type: "required", message: "Browser Notification Enabled is Required" },
    ],
    presence: [{ type: "required", message: "Presence is Required" }],
    statusMsg: [{ type: "required", message: "Status Message is Required" }],
  };

  constructor(
    private remoteSvrc: ProfileService,
    public fb: UntypedFormBuilder,
    private toast: ToastComponent,
    private auth: AuthenticationService
  ) {
    this.userForm = fb.group({
      theme: ["", Validators.compose([Validators.required])],
      audioEnabled: ["", Validators.compose([Validators.required])],
      browserNotificationsEnable: [
        "",
        Validators.compose([Validators.required]),
      ],
      presence: ["", Validators.compose([Validators.required])],
      statusMsg: ["", Validators.compose([Validators.required])],
    });

    this.YesNokeys = Object.keys(this.YesNoEnum);
    this.Presencekeys = Object.keys(this.PresenceEnum);
    this.Themekeys = Object.keys(this.ThemeEnum);
  }

  ngOnInit() {
    this.userId = this.auth.getUserLogin().userId;
    this.apiKey = this.auth.getUserLogin().apikey;
    this.userPref = this.auth.getUserLogin().userPrefs;

    if (this.userPref != undefined) {
      this.userForm.patchValue({
        theme: this.userPref.theme,
        audioEnabled: this.userPref.audioEnabled,
        browserNotificationsEnable: this.userPref.browserNotificationsEnable,
        presence: this.userPref.presence,
        statusMsg: this.userPref.statusMsg,
      });
    }

    this.remoteSvrc.getUserStatusList(null, this.apiKey).subscribe(
      (data) => {
        this.isLoading = false;
        this.chatStatusTypes = data as Models.ChatStatusTypeList;
        this.isLoading = true;
      },
      (err) => {
        this.toast.presentFailedToast("Error Occured , Please try again !!!");
      }
    );
  }

  SaveUserPref(value: any) {
    this.auth.getUserLogin().userPrefs.audioEnabled = value.audioEnabled;
    this.auth.getUserLogin().userPrefs.theme = value.theme;
    this.auth.getUserLogin().userPrefs.browserNotificationsEnable =
      value.browserNotificationsEnable;
    this.remoteSvrc
      .storeUserPref(
        value.theme,
        value.audioEnabled,
        value.browserNotificationsEnable,
        value.presence,
        value.statusMsg,
        null,
        this.apiKey
      )
      .subscribe(
        (data) => {
          this.response = data;

          this.toast.presentSuccessToast("Preference Saved  Successfully");
        },
        (err) => {
          this.toast.presentFailedToast(
            "Server Error | " + JSON.stringify(err)
          );
        }
      );
  }
}
