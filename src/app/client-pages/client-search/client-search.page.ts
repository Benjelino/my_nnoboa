import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

import { AuthenticationService } from 'src/app/auth/auth-service/authentication.service';
import { RemoteService } from 'src/app/base-services/remote-service/remote-service.module';
import { EsearchService } from 'src/app/base-services/remote-service/esearch.service';


@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.page.html',
  styleUrls: ['./client-search.page.scss'],
})
export class ClientSearchPage implements OnInit {
    propertyType: string = "Apartment";
    srchTxt: string = "electronics";
    srchData = "search text eg: electronics";

    constructor(private router: Router, private toastController: ToastController,
        private auth: AuthenticationService, 
        private remoteSvrc: RemoteService,
        private esSvrc: EsearchService) { }

  ngOnInit() {
  }

  searchSimpleQueryString() {
      let self = this;

      let msgBody = {}
      msgBody['qstr'] = this.srchTxt;
      console.log("ClientSearchPage::searchSimpleQueryString() msgBody: " + JSON.stringify(msgBody));

      this.esSvrc.searchSimpleQueryString(this.remoteSvrc, msgBody, this.auth.getUserLogin().apikey)
          .then(data => {
              console.log("ClientSearchPage::searchSimpleQueryString() data: " + JSON.stringify(data));
              if ('200' == data['httpStatus']) {
                  self.srchData = JSON.stringify(data);
              }
          })
          .catch(err => {
              //this.toastCtrl.presentFailure();
              console.log("ClientSearchPage::searchSimpleQueryString() err: " + JSON.stringify(err));
      });

  }


  selectPropertyType(event) {

  }

  async makeRequest() {
      const toast = await this.toastController.create({
          message: 'Your request has been sent to providers. Interested providers will contact you.',
          position: 'middle',
          duration: 5000
      });
      toast.present();

      this.close()
  }

  close() {
      this.router.navigate(['menu/client-dashboard'])
  }

}
