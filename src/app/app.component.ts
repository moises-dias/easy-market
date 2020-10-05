import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';

import { AuthService } from './auth/auth.service';
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  userMail: string = '';
  unread: number = 0;
  isLogged: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {
    this.initializeApp();
    this.authService.userMail.subscribe(mail => {
      this.userMail = mail;
      if(mail) {
        this.firebaseService.getUnreadNumber(mail).subscribe(unread => this.unread = unread);
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // DESCOMENTAR PARA RODAR NO CELULAR
      // FCM.getToken().then(token => {
      //   // console.log(token);
      // });

      // FCM.onTokenRefresh().subscribe(token => {
      //   // console.log(token);
      // });

      // FCM.onNotification().subscribe(data => {
      //   // console.log(data);
      //   if (data.wasTapped) {
      //     // console.log('received in background');
      //     this.router.navigate([data.landing_page]);
      //     // this.router.navigate([data.landing_page, data.price]);
      //   } else {
      //     // console.log('received in foreground');
      //     // this.router.navigate([data.landing_page])
      //     // this.router.navigate([data.landing_page, data.price])
      //   }
      // });

    });
  }

  close() {
    this.menu.close();
  }

  logout() {
    this.firebaseService.onLogout(this.userMail);
    this.authService.logout();
    this.menu.close();
  }

}
