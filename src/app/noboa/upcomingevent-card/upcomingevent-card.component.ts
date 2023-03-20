/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/member-ordering */
import { IupComingEvents } from '../services/models/iUpcomingevents';
import { Component, OnInit } from '@angular/core';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';

@Component({
  selector: 'app-upcomingevent-card',
  templateUrl: './upcomingevent-card.component.html',
  styleUrls: ['./upcomingevent-card.component.scss'],
})
export class UpcomingeventCardComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  upComeEvents: IupComingEvents[] = [
    {
      title: "NitroGen",
      desc: "lorem The number of nitrogen fixing application",
      imgUrl: '../assets/images/Agriculture.jpg',
      date: 'November 16, 2022'
    },
    {
      title: "Nnoboa",
      desc: "The number of nitrogen fixing application lorem dash something of the going",
      imgUrl: '../assets/images/healthcare.jpg',
      date: 'August 20, 2023'
    },
    {
      title: "NitroGen",
      desc: "lorem The number of nitrogen fixing application",
      imgUrl: '../assets/images/Agriculture.jpg',
      date: 'July 12, 2022'
    },
    {
      title: "Nnoboa",
      desc: "The number of nitrogen fixing application lorem dash something of the going",
      imgUrl: '../assets/images/healthcare.jpg',
      date: 'May 20, 2023'
    },
  ];


  public innerWidth: any;
  option = {
    0: {
      slidesPerView: 1,
      spaceBetween: 5
    },
    680: {
      slidesPerView: 1.5,
      spaceBetween: 5
    },
    720: {
      slidesPerView: 2.5,
      spaceBetween: 5
    },
    // when window width is >= 640px
    960: {
      slidesPerView: 3.5,
      spaceBetween: 5
    }
  };

  private mySwiper: any;

  setSwiperInstance(swiper: any) {
    this.mySwiper = swiper;
  }


  swipePrevious() {
    this.mySwiper.slidePrev();
  }


  swipeNext() {
    this.mySwiper.slidePrev();
  }

}
