import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    sliderConfig = {
        autoplay: 5000,
        loop: true,
        pager: true
    };

    constructor(private router: Router) { }

  ngOnInit() {
  }

}
