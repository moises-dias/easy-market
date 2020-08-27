import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
})
export class NewProductPage implements OnInit {
  userMail: string = '';
  form: FormGroup;
  images: string[] = [];

  options: CameraOptions = {
    quality: 30,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetHeight: 320
  }

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router,
    private camera: Camera
  ) { 
    this.authService.userMail.subscribe(mail => this.userMail = mail);
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })

    });
  }

  anunciar() {
    this.firebaseService.newProduct(
      this.form.value.title,
      this.userMail,
      this.form.value.price,
      this.form.value.description,
      this.images
    );
    this.form.reset();
    this.router.navigateByUrl('/home');
  }

  captureImage() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.images.push(imageData);
    }, (err) => {
      console.log(err);
    });
  }

}
