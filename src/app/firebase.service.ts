import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { of, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Chat, Product, Voucher, Messages } from './models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore
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
