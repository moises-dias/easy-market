import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FirebaseService } from '../firebase.service';

import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  clickedImage: string;
  noImage: string = 'data:image/png;base64,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';
  items: Observable<any>;
  userMail: string = "";

  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(
    private camera: Camera,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) {
      this.items = this.firebaseService.getProducts();
      this.authService.userMail.subscribe(mail => this.userMail = mail);
  }

  captureImage() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.clickedImage = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }

}
