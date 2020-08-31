import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Chat } from '../models';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.page.html',
  styleUrls: ['./chats-list.page.scss'],
})
export class ChatsListPage implements OnInit {

  chatsList: Chat[];
  chats: Observable<any[]>;
  userMail: string = '';

  constructor (
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) { 
    this.authService.userMail.subscribe(mail => this.userMail = mail);
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.firebaseService.checkMessages(this.userMail);
    this.chats = this.firebaseService.getAllChats(this.userMail);
  }

}
