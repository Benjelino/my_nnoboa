import { Injectable } from '@angular/core';

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PagingService {
  static paging = new BehaviorSubject(undefined);

  constructor() { }

  static goToNextPage() {
    console.log("PagingService::goToNextPage() value", PagingService.paging.value);
    PagingService.paging.next( true );
    console.log("PagingService::goToNextPage() value", PagingService.paging.value);
  }

  static goToPrevious() {
    console.log("PagingService::goToPrevious() ...");
    PagingService.paging.next( false );
  }

}
