// Inspired in: https://devblogs.microsoft.com/premier-developer/angular-how-to-editable-config-files/

import { Injectable, isDevMode } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { tap } from "rxjs/operators";
import { IAppShellConfig } from "./config.interfaces";
import { ToastComponent } from "../../toastComponent";

@Injectable({
  providedIn: "root",
})
export class AppShellConfig {
  static settings: IAppShellConfig;

  constructor(private http: HttpClient, private toast: ToastComponent) {}

  // Simplified version from: https://stackoverflow.com/a/49707898/1116959
  load(): Promise<void | IAppShellConfig> {
    const configFile =
      "./assets/config/app-shell.config" +
      (!isDevMode() ? ".prod" : "") +
      ".json";

    return this.http
      .get<IAppShellConfig>(configFile)
      .pipe(
        tap((configSettings) => {
          AppShellConfig.settings = configSettings;
        })
      )
      .toPromise()
      .catch((error: any) => {
        this.toast.presentFailedToast(
          `Could not load file '${configFile}'` + error
        );
      });
  }
}
