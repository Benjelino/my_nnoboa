import { Component, OnInit } from '@angular/core';
import { IimgCard } from '../services/models/iImgCard';


@Component({
  selector: 'app-companycard',
  templateUrl: './companycard.component.html',
  styleUrls: ['./companycard.component.scss'],
})
export class CompanyCardComponent implements OnInit {

  constructor() {
  }
  ngOnInit() {

    this.innerWidth = window.innerWidth;
  }

  companies: any;
  currentPage = 1;
  colors = ['#828282', '#FFE1E1', '#BFC2FF'];
  
  latestFundedCompanies: IimgCard[] = [
    {
      title: "NitroGen",
      desc: "lorem The number of nitrogen fixing application",
      bgImg: '../../../assets/images/sustainability.jpg',
      companyImg: '../../../assets/images/healthcare.jpg',
      tags: ['FinTech', 'AnyOther'],
      foundedDate: '2022'
    },
    {
      title: "Nnoboa",
      desc: "The number of nitrogen fixing application lorem dash something of the going",
      bgImg: '../../../assets/images/Agriculture.jpg',
      companyImg: '../../../assets/images/healthcare.jpg',
      tags: ['Agric', 'Science'],
      foundedDate: '2023'
    },
    {
      title: "NitroGen",
      desc: "lorem The number of nitrogen fixing application",
      bgImg: '../../../assets/images/sustainability.jpg',
      companyImg: '../../../assets/images/healthcare.jpg',
      tags: ['FinTech', 'AnyOther'],
      foundedDate: '2022'
    },
    {
      title: "Nnoboa",
      desc: "The number of nitrogen fixing application lorem dash something of the going",
      bgImg: '../../../assets/images/Agriculture.jpg',
      companyImg: '../../../assets/images/healthcare.jpg',
      tags: ['Agric', 'Science'],
      foundedDate: '2023'
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
