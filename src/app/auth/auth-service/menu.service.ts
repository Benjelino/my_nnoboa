import { Injectable } from '@angular/core';

import { AuthenticationService } from 'src/app/auth/auth-service/authentication.service';


export interface IMenuItem {
  title: string;
  url?: string;
  icon?: string;
  open?: boolean;
  allowList?: string[];
  children?: IMenuItem[];
}


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  constructor( private auth: AuthenticationService ) { 
  }

  getAllowMenuList(pagesAllowList: IMenuItem[]) : IMenuItem[] {
    let pages: IMenuItem[] = [];

    for (const item of pagesAllowList) {
      //console.log('getAllowMenuList() item ' + JSON.stringify(item));

      if (item.children) {
        const children: IMenuItem[] = [];
        for (const citem of item.children) {
          //console.log('getAllowMenuList() citem ' + JSON.stringify(citem));
          if (!citem.allowList) {
            children.push(citem);
          } else {
            const isAllowed = this.isAllowed(citem);
            if (isAllowed) {
              children.push(citem);
            }
          }
        }
        const subitem: IMenuItem = {
          title: item.title,
          children
        };
        pages.push(subitem);
      } else {
        if (!item.allowList) {
          pages.push(item);
        } else {
          const isAllowed = this.isAllowed(item);
          if (isAllowed) {
            pages.push(item);
          }
        }
      }
    }

    return pages;
  }

  // allowList: ['DACLIENT', 'DAPROVIDER', 'ALL_USERS']
  // allowList: ['ADMIN', 'DACUSTCARE', 'DASUPPORT', 'DASUPPORT2']
  //  "userGroupArray" : [ "DACLIENT", "MG_dcubechat", "ADMIN", "ALL_USERS" ]
  isAllowed(item: IMenuItem): boolean {
    const ug = this.auth?.getUserLogin()?.userGroupArray;
    //console.log('isAllowed() userGroupArray ' + JSON.stringify(ug));
    if ((null != ug) && (undefined !== ug) && item && item.allowList) {
      for (const grp of item.allowList) {
        //console.log('isAllowed() grp ' + JSON.stringify(grp));
        //if (ug.includes(grp) && (('DACUSTCARE' === grp) || ('DASUPPORT' === grp) || ('DASUPPORT2' === grp))) {
        if ( ug.includes(grp) ) {
          return true;
        }
      }
    }

    return false;
  }

}
