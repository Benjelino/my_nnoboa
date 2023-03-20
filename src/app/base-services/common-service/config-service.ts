import { Injectable } from "@angular/core";

@Injectable()
export class DataConfigService {

    private flexibilityTypes: any[] = null;
    private contactMethods: any[] = null;
    private booleanYN: any[] = null;
    private isloaded = false;


    constructor() { }

    //coming from moqui
    loadConfigData() {
        if (this.isloaded == false) {
            this.isloaded = true;

            this.flexibilityTypes = [];
            this.flexibilityTypes.push({ label: 'Flexible', value: 'Flexible' });
            this.flexibilityTypes.push({ label: 'Absolute', value: 'Absolute' });

            this.contactMethods = [];
            this.contactMethods.push({ label: 'Cell Phone', value: 'PHONE' });
            this.contactMethods.push({ label: 'Email Address', value: 'EMAIL' });

            this.booleanYN = [];
            this.booleanYN.push({ label: 'Yes', value: 'Y' });
            this.booleanYN.push({ label: 'No', value: 'N' });
        }
    }

    getServiceFlexibilityTypes() {
        return this.flexibilityTypes;
    }

    getContactMethods() {
        return this.contactMethods;
    }

    getBooleanYN() {
      return this.booleanYN;
    }

}