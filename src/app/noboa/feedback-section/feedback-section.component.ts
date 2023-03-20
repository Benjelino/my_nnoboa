import { PopoverService } from './../services/popover.service';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { IfeedBackCard } from '../services/models/IfeedBack';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-feedback-section',
  templateUrl: './feedback-section.component.html',
  styleUrls: ['./feedback-section.component.scss'],
})
export class FeedbackSectionComponent implements OnInit {

  constructor(private popservice: PopoverService, public popoverController: PopoverController) {
  }

  ngOnInit() { }

  feedbacks: IfeedBackCard[] = [
    {
      name: 'Benjamin',
      imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      companyName: 'company',
      companyImgUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGNvbXBhbmllc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'James',
      imgUrl: 'https://images.unsplash.com/photo-1615813967515-e1838c1c5116?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGxvZ298ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'Emmanuel',
      imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1494022299300-899b96e49893?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxMTMxNTg1MHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'George',
      imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      companyName: 'company',
      companyImgUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGNvbXBhbmllc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'Kevin',
      imgUrl: 'https://images.unsplash.com/photo-1615813967515-e1838c1c5116?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGxvZ298ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'Issac',
      imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1494022299300-899b96e49893?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxMTMxNTg1MHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'Sylvester',
      imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      companyName: 'company',
      companyImgUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGNvbXBhbmllc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'Mary',
      imgUrl: 'https://images.unsplash.com/photo-1615813967515-e1838c1c5116?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGxvZ298ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'name',
      imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1494022299300-899b96e49893?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxMTMxNTg1MHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'name',
      imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      companyName: 'company',
      companyImgUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGNvbXBhbmllc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'name',
      imgUrl: 'https://images.unsplash.com/photo-1615813967515-e1838c1c5116?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGVjaCUyMGxvZ298ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },
    {
      name: 'name',
      imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      companyName: 'company1',
      companyImgUrl: 'https://images.unsplash.com/photo-1494022299300-899b96e49893?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxMTMxNTg1MHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
      comments: 'Am very Happy for your support',

    },

  ];

  addfeedback(feedback: IfeedBackCard) {

    console.log(feedback)

  }

  async presentPopover(ev: any, index: number) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: { value: this.feedbacks[index] }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}

