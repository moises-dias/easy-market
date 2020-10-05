import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { of, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Chat, Product, Voucher, Messages, UserData, completeAddress } from './models';

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

  getUnreadNumber(mail: string) {
    return this.firestore.collection("userData").doc(mail).snapshotChanges()
    .pipe(
      map( res => {
        const data = res.payload.data() as UserData;
        if(data) {
          return data.unread;
        } else {
          return 0;
        }
      })
    )
  }

  getUserAddress(mail: string) {
    return this.firestore.collection("userData").doc(mail).snapshotChanges()
    .pipe(
      map( res => {
        const data = res.payload.data() as UserData;
        // console.log('inside getuseraddress')
        // console.log(data)
        if(data) {
          return {
            address: data.address,
            cidade: data.cidade,
            bairro: data.bairro,
            lat: data.lat,
            long: data.long
          } as completeAddress;
        } else {
          return null;
        }
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

  getProducts(userAddress: completeAddress) {
    return this.firestore.collection('products').snapshotChanges()
    .pipe(
      map( res => {
        // console.log(res);
        var filtered = res.map( a => {
          const data = a.payload.doc.data() as Product; 
          const id = a.payload.doc.id;
          return { id, ...data };
        })
        // return filtered.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)); 
        // console.log('DENTRO DA GETPRODUCTS NO FIREBASE SERVICE')
        // console.log(userAddress);
        if(userAddress) {
          // console.log('FILTROU POR DISTANCIA')
          return filtered.sort((a,b) => (this.distInKm(a.lat, a.long, userAddress.lat, userAddress.long) > this.distInKm(b.lat, b.long, userAddress.lat, userAddress.long)) ? 1 : -1); 
        }
        // console.log('FILTROU ALFABETICO')
        return filtered.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
      })
    )
  }

  distInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    var deg2Rad = deg => {
      return deg * Math.PI / 180;
    }

    var r = 6371; // Radius of the earth in km
    var dLat = deg2Rad(lat2 - lat1);
    var dLon = deg2Rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2Rad(lat1)) * Math.cos(deg2Rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = r * c; // Distance in km
    return d;
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

  newProduct (title: string, vendor: string, price: number, description: string, images: string[], bairro: string, cidade: string, lat: number, long: number) {
    this.firestore.collection('products').add({
      title: title,
      vendor: vendor,
      price: price,
      description: description,
      images: images,
      lat: lat,
      long: long,
      bairro: bairro,
      cidade: cidade
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
    // console.log('signup')
    this.firestore.collection("userData").doc(user).set({
      unread: 0,
      device: device
    });
  }

  setLocation (user: string, address: completeAddress, device?: string){
    // console.log('address on db')
    // console.log(address)
    this.firestore.collection("userData").doc(user).set({
      address: address.address,
      lat: address.lat,
      long: address.long,
      bairro: address.bairro,
      cidade: address.cidade,
      device: device? device : '',
      unread: 0
    });
  }

  // setUserAddress (user: string, address: string){
  //   this.firestore.collection("userData").doc(user).update({
  //     address: address,
  //     lat: 'device',
  //     long: 'device'
  //   });
  // }

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
              "title":`Você tem ${data.unread + 1} nova${data.unread > 0 ? 's' : ''} mensage${data.unread > 0 ? 'ns' : 'm'}!`,
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
