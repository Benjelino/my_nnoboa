import { Component, OnInit } from '@angular/core';

import { ClientDashboardPage } from '../client-dashboard/client-dashboard.page';
import { ClientSearchPage } from '../client-search/client-search.page';
import { ServiceRequestPage } from 'src/app/service-request/client-request/service-request.page';
import { ServiceRequestFsPage } from 'src/app/service-request/client-request-fs/service-request-fs.page';
import { ServiceRequestCommPage } from 'src/app/service-request/client-request-comm/service-request-comm.page';
import { MediaStatsPage } from 'src/app/media/client-media-stats/media-stats.page';
import { RateMediaPage } from 'src/app/recommendation/rate-media/rate-media.page';
import { RateProviderPage } from 'src/app/recommendation/rate-provider/rate-provider.page';
import { AuthenticationService } from 'src/app/auth/auth-service/authentication.service';


@Component({
    selector: 'app-client',
    templateUrl: './client.page.html',
    styleUrls: ['./client.page.scss'],
})
export class ClientPage implements OnInit {
    appId = "";

    tab1 = ClientDashboardPage;
    tab2 = ServiceRequestPage;
    tab3 = ClientSearchPage;
    tab4 = MediaStatsPage;
    tab5 = RateMediaPage;
    tab6 = RateProviderPage;
    tab7 = ServiceRequestFsPage;
    tab8 = ServiceRequestCommPage;

    constructor() {
        this.appId = AuthenticationService.env.appId;
    }

    ngOnInit() {
    }

}
