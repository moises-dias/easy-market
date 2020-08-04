import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      
      FCM.getToken().then(token => {
        console.log(token);
      });

      FCM.onTokenRefresh().subscribe(token => {
        console.log(token);
      });

      FCM.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('received in background');
          this.router.navigate([data.landing_page, data.price]);
        } else {
          console.log('received in foreground');
          this.router.navigate([data.landing_page, data.price])
        }
      });
      // FCM.subscribeToTopic('people');
      // FCM.unsubscribeFromTopic('marketing');

    });
  }
}
