import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models';
import { FirebaseService } from '../firebase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController
    ) { }

    product: Product = {title: '', price: '', description: '', images: [], vendor: ''};
    userMail: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.firebaseService.getProduct(paramMap.get('productId')).subscribe(
        product => { this.product = product; }
      );
    });
  }

  sendMessage() {
    this.firebaseService.newChat(this.product.title, 'mail', this.product.vendor)
    .then((value) => {
      this.router.navigateByUrl("/chats-list/chat/"+value.id);
    });
  }

}
