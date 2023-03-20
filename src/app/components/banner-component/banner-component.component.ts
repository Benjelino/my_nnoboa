import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-component',
  templateUrl: './banner-component.component.html',
  styleUrls: ['./banner-component.component.scss'],
})
export class BannerComponentComponent implements OnInit {
  showBanner = false;
  showFuneralBanner = false;
  showCommunityBanner = false;
  showCitiesBanner = false;
  showBrandBanner = false;
  showCrowdFunding = false;

  constructor() { }

  ngOnInit() {}

}
