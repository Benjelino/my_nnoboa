import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.page.html',
  styleUrls: ['./chat-contacts.page.scss']
})
export class ChatContactsPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  openChat() {
    this.router.navigateByUrl('menu/chat')
  }
}
