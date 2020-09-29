import { Injectable } from '@angular/core';
import { User, AuthResponseData, completeAddress } from '../models';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FirebaseService } from '../firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User>(null);
  private address: completeAddress = null;

  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseService
  ) { }

  get userMail() {
    return this._user.asObservable().pipe(map(user => {
      if(user) {
        return user.email;
      } else {
        return null;
      }
    }));
  }

  get userAddress() {
    return this._user.asObservable().pipe(map(user => {
      if(user) {
        return {
          address: user.address,
          cidade: user.cidade,
          bairro: user.bairro,
          lat: user.lat,
          long: user.long
        } as completeAddress;
      } else {
        this.address;
      }
    }));
  }

  login(email: string, password: string) {                      
    this.firebaseService.getUserAddress(email).subscribe((address) => this.address = address);

    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
      { email: email, password: password }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  signup(email: string, password: string, address: completeAddress) {
    this.address = address;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`, 
      { email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));

    setTimeout(() => 
    {
      this._user.next(
        new User(
          userData.localId, 
          userData.email, 
          userData.idToken, 
          expirationTime,
          this.address.address,
          this.address.cidade,
          this.address.bairro,
          this.address.lat,
          this.address.long
        )
      );
    },
    1000);





    // this._user.next(
    //   new User(
    //     userData.localId, 
    //     userData.email, 
    //     userData.idToken, 
    //     expirationTime,
    //     this.address.address,
    //     this.address.cidade,
    //     this.address.bairro,
    //     this.address.lat,
    //     this.address.long
    //   )
    // );
  }

}
