import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.price = this.route.snapshot.params['price'];
  }

  price: any = '';

  ngOnInit() {
  }

}
