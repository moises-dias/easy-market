import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Chat } from '../models';

import { FirebaseService } from '../firebase.service'
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  messageId: string;
  chat: Chat = { buyer: '', seller: '', product: '', messages: [] };
  user: string = '';
  newMsg: string = '';
  @ViewChild(IonContent, { static: true }) content: IonContent;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
    this.authService.userMail.subscribe(mail => this.user = mail);
    this.route.paramMap.subscribe(paramMap => {
      this.messageId = paramMap.get('messageId');
      firebaseService.getMessages(this.messageId).subscribe(chat => {
        this.chat = chat;
        setTimeout(() => {
          this.content.scrollToBottom(200);
        }, 200);
      });
      // this.user = this.userService.getUsrMail();
    });
  }

  sendMessage() {
    this.firebaseService.notifyUser(this.user === this.chat.buyer ? this.chat.seller : this.chat.buyer);
    this.firebaseService.newMessage(this.messageId, this.user, this.newMsg, new Date().getTime().toString());
    this.newMsg = '';
    setTimeout(() => {
      this.content.scrollToBottom(200);
    }, 200);
  }

  async presentPrompt() {
    let alert = await this.alertCtrl.create({
      header: 'Detalhes do Voucher:',
      message: `
      <p> Produto: ${this.chat.product}</p>
      <p>Comprador: ${this.chat.buyer}</p>
    `,

      inputs: [
        {
          name: 'quantity',
          placeholder: 'Quantity',
          type: 'number',
          value: '1'
        },
      ],
      buttons: [
        'Cancelar',
        {
          text: 'Enviar Voucher',
          handler: data => {
            this.firebaseService.newVoucher(this.chat.product, this.chat.seller, this.chat.buyer, data.quantity);
            this.firebaseService.newMessage(this.messageId, "voucherSent", `${data.quantity} voucher(s) de ${this.chat.product} enviado`, new Date().getTime().toString());
          }
        }],
    });
    await alert.present();
  }

  ngOnInit() { }
}
