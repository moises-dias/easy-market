import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData, completeAddress } from '../models';
import { FirebaseService} from '../firebase.service';
import { MapboxService, Feature } from '../mapbox.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin: boolean = true;
  addresses: string[] = [];
  completeAddresses: completeAddress[] = [];
  selectedAddress: completeAddress = null;
  selectedAddressText: string = '';
  addressSet = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private firebaseService: FirebaseService,
    private mapboxService: MapboxService
  ) { }

  ngOnInit() {}

  authenticate(email: string, password: string, address?: completeAddress) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password, address);
        }
        authObs.subscribe(resData => {
          setTimeout(() => 
          {
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
            // DESCOMENTAR PARA RODAR NO CELULAR
            // FCM.getToken().then(token => {
            //   console.log(token);
            //   if (this.isLogin) {
            //     this.firebaseService.onLogin(email, token);
            //   } else {
            //     this.firebaseService.onSignup(email, token);
            //   }
            // });
          },
          1000);
          console.log(address)
          if(address) {
            console.log('adicionar endereço no bd')
            this.firebaseService.setLocation(email, address)
          }

          //this.router.navigateByUrl('/home');
        }, errRes => {
          loadingEl.dismiss();
          const code = errRes.error.error.message;
          let message = 'Could not sign you up, please try again.'
          if (code === 'EMAIL_EXISTS') {
            message = "This email address exists already!"
          } else if (code === 'EMAIL_NOT_FOUND') {
            message = 'E-Mail address could not be found.'
          } else if (code === 'INVALID_PASSWORD') {
            message = 'This password is not correct.'
          }
          this.showAlert(message);
        });
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
  
  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.log('invalid')
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const address = this.selectedAddress;
    // form.reset();
    // console.log(address)
    this.authenticate(email, password, address);
    // form.reset();
    console.log('RESETOU')
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed', 
        message: message, 
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  search(event: any) {
    if (this.addressSet){
      this.addressSet = false;
      console.log('nao muda agr')
      return;
    }
    console.log(event.target.value)
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.completeAddresses = features.map(feat =>  {
            let place = ''
            let neighborhood = ''
            for (let entry of feat.context) {
              //console.log(entry)
              if(entry.id.includes('place')) {
                place = entry.text;
              }
              else if (entry.id.includes('neighborhood')) {
                neighborhood = entry.text;
              }
            }
            return {address: feat.place_name, cidade: place, bairro: neighborhood, lat: feat.center[1], long: feat.center[0]}
          });
          console.log(this.completeAddresses)
        });
    } else {
      this.completeAddresses = [];
    }
  }

  onSelect(address) {
    this.selectedAddress = address;
    this.completeAddresses = [];
    this.selectedAddressText = this.selectedAddress.address;
    console.log('completo')
    console.log(this.selectedAddress)
    this.addressSet = true;
  }

}
