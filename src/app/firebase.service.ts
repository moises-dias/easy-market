import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { of, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Chat, Product, Voucher, Messages, UserData } from './models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
  ) {}

  newMessage(chatId: string, user: string, message: string, date: string): void {
    this.firestore.collection('chats').doc(chatId).update({
      messages:
        firebase.firestore.FieldValue.arrayUnion({user: user, message: message, date: date})
    });
  }

  getProduct(id: string) {
    return this.firestore.collection("products").doc(id).snapshotChanges()
    .pipe(
      map( res => {
        const data = res.payload.data() as Product;
        return data;
      })
    )
  }

  getMessages(id: string) {
    return this.firestore.collection("chats").doc(id).snapshotChanges()
    .pipe(
      map( res => {
        const data = res.payload.data() as Messages;
        return data;
      })
    );

  }

  getProducts() {
    return this.firestore.collection('products').snapshotChanges()
    .pipe(
      map( res => {
        return res.map( a => {
          const data = a.payload.doc.data() as Product; 
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getAllChats(usr: string) {
    const buyer = this.firestore
      .collection("chats", ref => ref.where("buyer","==",usr));
    const seller = this.firestore
      .collection("chats", ref => ref.where("seller","==",usr));

    return combineLatest([buyer.snapshotChanges(), seller.snapshotChanges()]).pipe(
      mergeMap(chats => {
          const [buyerChats, sellerChats] = chats;
          const combined = buyerChats.concat(sellerChats)
          .map(chat => {
            const data = chat.payload.doc.data() as Chat;
            const id = chat.payload.doc.id;
            return { id, ...data};
          });
          return of(combined);
      })
    )
  }

  newProduct (title: string, vendor: string, price: number, description: string, images: string[]) {
    this.firestore.collection('products').add({
      title: title,
      vendor: vendor,
      price: price,
      description: description,
      images: images
    })
  }

  newVoucher (name: string, vendor: string, buyer: string, quantity: number) {
    this.firestore.collection('vouchers').add({
      name: name,
      vendor: vendor,
      buyer: buyer,
      quantity: quantity,
    })
  }

  onSignup (user: string, device: string){
    this.firestore.collection("userData").doc(user).set({
      unread: 0,
      device: device
    });
  }

  onLogout (user: string) {
    this.firestore.collection("userData").doc(user).update({
      device: ''
    });
  }

  onLogin (user: string, device: string){
    this.firestore.collection("userData").doc(user).update({
      device: device
    });
  }

  checkMessages(user: string) {
    this.firestore.collection("userData").doc(user).update({
      unread: 0
    });
  }

  notifyUser(userToNotify: string) {

    this.firestore.collection("userData").doc(userToNotify).get()
    .pipe(
      map( res => {
        const data = res.data() as UserData;
        return data;
      }))
    .subscribe(
      data => { 
        this.firestore.collection("userData").doc(userToNotify).update({
          unread: data.unread + 1
        });
        if(data.device !== ''){
          this.http.post<any>('https://fcm.googleapis.com/fcm/send', 
          {
            "notification":{
              "title":`Você tem ${data.unread + 1} novas mensagens!`,
              "body":"Continue suas compras e vendas no easy market",
              "sound":"default",
              "click_action":"FCM_PLUGIN_ACTIVITY",
              "icon":"fcm_push_icon"
            },
            "data":{
              "landing_page":"chats-list",
              "price":"$3,000.00"
            },
            "to":data.device,
            "priority":"high",
            "restricted_package_name":""
          },
          { headers: 
            {'Authorization': 
              'key=AAAAJ-PpGdY:APA91bGDjfDlgIzw5tPpOscVEEX2Peb3g_MNZrQ_xEShQ2UDYuz9qYueYZ2DRm7Zz8WNCfn4MsXefbE-R4h_9Phjn_MTlg7883WCtH0ItT7wbt_WulO_rNjmb4jah96mHPiARPLPemS_',
              'Content-Type': 'application/json' 
            }
          }
          ).subscribe(data => {
            // console.log(data);
          })
        }
      }
    );
  }
    
  getVouchers(usr: string) {
    const buyer = this.firestore
      .collection("vouchers", ref => ref.where("buyer","==",usr));
    const seller = this.firestore
      .collection("vouchers", ref => ref.where("vendor","==",usr));

    return combineLatest([buyer.snapshotChanges(), seller.snapshotChanges()]).pipe(
      mergeMap(vouchers => {
          const [buyerVouchers, sellerVouchers] = vouchers;
          const combined = buyerVouchers.concat(sellerVouchers)
          .map(voucher => {
            const data = voucher.payload.doc.data() as Voucher;
            const id = voucher.payload.doc.id;
            return { id, ...data};
          });
          return of(combined);
      })
    )
  }

  newChat (product: string, buyer: string, seller: string) {
    this.notifyUser(seller);
    return this.firestore.collection('chats').add({
      product: product,
      buyer: buyer,
      seller: seller,
      messages: [{user: buyer, message: "Olá " + seller + ", estou interessado em " + product, date: new Date().getTime().toString()}],
    })
  }

  discountVoucher(id: string, quantity: number): void {
    this.firestore.collection('vouchers').doc(id).update({
      quantity: quantity
    });
  }

  removeVoucher(id: string) {
    this.firestore.collection('vouchers').doc(id).delete();
  }

}
