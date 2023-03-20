import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AppConfigService {
  private _env: Object;

  constructor(private http: HttpClient) {}

  load() {
    return new Promise((resolve, reject) => {
      this.http.get("assets/config/appenv.json").subscribe(
        (env_data) => {
          this._env = env_data;

          resolve(env_data);
        },
        (onerr) => {
          console.error("config loading error: " + JSON.stringify(onerr));
          reject(onerr);
        },
        () => {
          console.log("app-config loading completed");
        }
      );
    });
  }

  getEnv(key: any) {
    return this._env[key];
  }
}
