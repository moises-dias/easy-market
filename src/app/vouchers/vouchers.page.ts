import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.page.html',
  styleUrls: ['./vouchers.page.scss'],
})
export class VouchersPage implements OnInit {
  vouchers: Observable<any[]>;
  userMail: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    this.authService.userMail.subscribe(mail => this.userMail = mail);
    this.vouchers = this.firebaseService.getVouchers(this.userMail);
   }

  ngOnInit() {}

  discountVoucher(id: string, quantity: number){
    if (quantity > 0) {
      this.firebaseService.discountVoucher(id, quantity);
    }
    else {
      this.firebaseService.removeVoucher(id);
    }
  }

}
