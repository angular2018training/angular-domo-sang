import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM } from '../constants/system.constant';
import { CommonService } from '../../shared/services/common.service';
import { UtilitiesService } from './utilities.service';
import { UserService, User } from './user.service';
import { LOCAL_MESSAGE } from '../constants/message';

// export class User {
//   constructor(public userId: number, public email: string,
//     public password: string, public role: string, public fullname: string, public passwordReminder: number) {
//   }
// }

// const USERS = [
//   new User(1, 'clientadmin', '123456', 'ADMIN_CLIENT', 'Client Admin'),
//   new User(2, 'clientuser', '123456', 'USER', 'Client User'),
//   new User(3, 'sysadmin', '123456', 'ADMIN_SYSTEM', 'System Admin')
// ];
// let usersObservable = Observable.of(USERS);

@Injectable()
export class AuthService {
  private redirectUrl: string = '/';
  private requestsPassUrl: string = '/user-requests-password';
  private createNewUserUrl: string = '/create-new-user';
  private loginUrl: string = 'system/login';
  private isloggedIn: boolean = false;
  // private loggedInUser: any;
  private token = { accessToken: null, refreshToken: null };

  constructor(private _Utilities: UtilitiesService, private router: Router, private _UserService: UserService) {

  }

  // getAllUsers(): Observable<User[]> {
  //   return usersObservable;
  // }
  // isUserAuthenticated(email: string, password: string, isRemember: boolean) {
  //   return this.getAllUsers()
  //     .map(users => {
  //       let user = users.find(user => (user.email === email) && (user.password === password));
  //       if (user) {
  //         this.isloggedIn = true;
  //         // this.loggedInUser = user;

  //         let encryptedUser = this._Utilities.encryptText(JSON.stringify(user), SYSTEM.SECRET_KEY);
  //         if (isRemember) {
  //           this._Utilities.setLocalStorage(SYSTEM.USER, encryptedUser.toString());
  //         } else {
  //           sessionStorage.setItem(SYSTEM.USER, encryptedUser.toString());
  //         }
  //       } else {
  //         this.isloggedIn = false;
  //       }
  //       return this.isloggedIn;
  //     });
  // }
  // isUserLoggedIn(): boolean {
  //   if (!this.getLoggedInUser()) { // check is remembered
  //     let encryptedUser = this._Utilities.getLocalStorage(SYSTEM.USER);
  //     if (encryptedUser) {
  //       let user = JSON.parse(this._Utilities.decryptText(encryptedUser, SYSTEM.SECRET_KEY));
  //       this.isUserAuthenticated(user.email, user.password, true).subscribe();
  //     } else { // check is refresh browser
  //       encryptedUser = sessionStorage.getItem(SYSTEM.USER);
  //       if (encryptedUser) {
  //         let user = JSON.parse(this._Utilities.decryptText(encryptedUser, SYSTEM.SECRET_KEY));
  //         this.isUserAuthenticated(user.email, user.password, false).subscribe();
  //       }
  //     }
  //   }
  //   return this.isloggedIn;
  // }
  getCreateNewUserUrl(): string{
    return this.createNewUserUrl;
  }
  getRequestPassUrl(): string {
    return this.requestsPassUrl;
  }
  getRedirectUrl(): string {
    return this.redirectUrl;
  }
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  getLoginUrl(): string {
    return this.loginUrl;
  }
  getLoggedInUser(): User {
    let encryptedAccount = this._Utilities.getLocalStorage(SYSTEM.LOGGED_USER_INFO);
    let account;
    if (encryptedAccount) {
      account = JSON.parse(this._Utilities.decryptText(encryptedAccount, SYSTEM.SECRET_KEY));
    }
    return account;
  }
  logoutUser(): void {
    this._Utilities.deleteLocalStorage(SYSTEM.USER);
    this._Utilities.deleteLocalStorage(SYSTEM.LOGGED_USER_INFO);
    this._Utilities.deleteLocalStorage(SYSTEM.TOKEN);

    sessionStorage.removeItem(SYSTEM.USER);
    // this.getLoggedInUser = undefined;
    this.isloggedIn = false;
    this.router.navigate(['system/login']);
  }

  setLoggedInUser(user) {
    this.isloggedIn = true;
    // this.loggedInUser = user;

    let encryptedUser = this._Utilities.encryptText(JSON.stringify(user), SYSTEM.SECRET_KEY);
      this._Utilities.setLocalStorage(SYSTEM.LOGGED_USER_INFO, encryptedUser.toString());
  }
  getAccessToken() {
    if (!this.token.accessToken) return;
    let decryptedText = this._Utilities.decryptText(this.token.accessToken, SYSTEM.SECRET_KEY);
    return JSON.parse(decryptedText);
  }
  setAccessToken(token) {
    this.token.accessToken = this._Utilities.encryptText(JSON.stringify(token), SYSTEM.SECRET_KEY);;
  }
  getRefreshToken() {
    if (!this.token.refreshToken) return;
    let decryptedText = this._Utilities.decryptText(this.token.refreshToken, SYSTEM.SECRET_KEY);
    return JSON.parse(decryptedText);
  }
  setRefreshToken(token) {
    this.token.refreshToken = this._Utilities.encryptText(JSON.stringify(token), SYSTEM.SECRET_KEY);
  }

  checkValidSession() {
    let user: any = this.getLoggedInUser();
    if (user) {
      let now = new Date();
      if (now.getTime() > new Date(user.expiredDate).getTime()) {
        this.logoutUser();
        this.router.navigate(['system/login']);
        return false;
      }
      // Handle privilege based on user Type
      return true;
    }

    this.router.navigate(['system/login']);
    return false;
  }

  updatePasswordExpired() {
    let user = this.getLoggedInUser();
    if (user) {
      let expiredPasswordNumber = user.passwordReminder;

      if (Number(expiredPasswordNumber) < 1 && this.router.url.indexOf('user-detail') === -1) {
        this._Utilities.translateValueByKey(LOCAL_MESSAGE['64']).subscribe(value => {
          this._Utilities.showError(value);
        })
        this.router.navigate(['user-detail']);
      }
    }
  }
}