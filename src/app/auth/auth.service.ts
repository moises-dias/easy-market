import { Injectable } from '@angular/core';
import { User, AuthResponseData } from '../models';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient
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

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`,
      { email: email, password: password }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`, 
      { email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    this._user.next(
      new User(
        userData.localId, 
        userData.email, 
        userData.idToken, 
        expirationTime
      )
    );
  }

}
