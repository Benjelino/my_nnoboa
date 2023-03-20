import { Component, OnInit } from '@angular/core';
import { IshortImage } from '../services/models/ishortimage';

@Component({
  selector: 'app-short-cards',
  templateUrl: './app-short-cards.component.html',
  styleUrls: ['./app-short-cards.component.scss'],
})
export class ShortCardsComponent implements OnInit {

  listShortCards: IshortImage[] = [];


  ngOnInit() {
    this.listShortCards.push(
      {
        icon: "../../../assets/icon/Company.png",
        numberOf: '250' + '+',
        title: 'Companies',
        desc: 'Description of the company'
      }, {
      icon: "../../../assets/icon/Crowdfunding.png",
      numberOf: '500' + '+',
      title: 'Investors',
      desc: 'Description of the company'
    }, {
      icon: "../../../assets/icon/Garden.png",
      numberOf: '150' + '+',
      title: 'Hubs',
      desc: 'Description of the company'
    }, {
      icon: "../../../assets/icon/Microscope.png",
      numberOf: '200' + '+',
      title: 'Researchers',
      desc: 'Description of the company'
    }
    );
  }

  constructor() { }

}
