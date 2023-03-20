import { Component, OnInit } from '@angular/core';
import { ViewChild } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable, interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import * as AppConstants from "src/app/base-services/common-service/app-constants/app-constants.service";
import * as Models from "src/app/media/services/media-model.service";
import * as CModels from "src/app/base-services/common-service/models/common-model.service";

import { DcubeAdapter } from "src/app/chat/services/dcube-adapter";
import { DcubeGroupAdapter } from "src/app/chat/services/dcube-groupadapter";
import { AuthenticationService } from "src/app/auth/auth-service/authentication.service";
import { RemoteService } from "src/app/base-services/remote-service/remote.service";
import { DcubecmsRemoteService } from "src/app/media/services/dcubecms-remote.service";

@Component({
  selector: 'app-media-stats',
  templateUrl: './media-stats.page.html',
  styleUrls: ['./media-stats.page.scss'],
})
export class MediaStatsPage implements OnInit {
    private id: string;
    public user = 'John Doe';

    isLoading = false;
    isLoggedIn = false;
    public data: Models.UserStat;

    appId = '';
    userId: string;
    apiKey: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private remoteSvrc: RemoteService,
        private dremoteSvrc: DcubecmsRemoteService) {
            this.appId = AuthenticationService.env.appId;
            let userId = this.authenticationService.getUserLogin().userId;
            this.apiKey = this.authenticationService.getUserLogin().apikey;
    }

    ngOnInit() {
        this.isLoggedIn = this.authenticationService.isAuthenticated();
        this.user = this.authenticationService.getUserLogin().userFullName;
        //  console.log (this.authenticationService.getUserLogin().apikey +  " apikey ");
        // console.log(this.authenticationService.getUserLogin().userId + " testing user id")
        this.userId = this.authenticationService.getUserLogin().userId;
        this.apiKey = this.authenticationService.getUserLogin().apikey;

        this.dremoteSvrc.getUserStats(this.userId, null, this.apiKey, this.appId).subscribe(
            data => {
                this.isLoading = false;
                this.data = data;
                this.isLoading = true;

            },
            err => {
                console.log('Server Error | ' + JSON.stringify(err));
            }
        );
  }

}
