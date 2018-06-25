import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM } from '../constants/system.constant';
import { CommonService } from '../../shared/services/common.service';
import { UtilitiesService } from './utilities.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';
import { ROLE } from '../constants/system.constant';
import { Subject } from "rxjs/Subject";

export class Role {
  constructor(public id: number, public name: string, public description: string) {
  }
}

export class TempRole extends Role {
  constructor() {
    super(-1, ROLE.TEMPORARY, 'Temporary Role');
  }
}

export class User {
  constructor(public id: number, public email: string, public firsName: string,
    public lastName: string, public fullName: string, public phone: string, public useType: number,
    public accountStatus: number, public expiredDate: string, public passwordReminder: number) {
  }
}

export class Token {
  constructor(public accessToken: string = null, public refreshToken: string = null, public tokenType: string = 'bearer', public tenantId: string = null, public authenticateViaIDP: boolean = false) {
  }
}

export class LoginAccount {
  constructor(public email: string, public password: string, public tenantId: string) {
  }
}

export const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  INITIAL_PASSWORD: 'INITIAL_PASSWORD',
  REQ_CHANGED_PASSWORD: 'REQ_CHANGED_PASSWORD'
}

@Injectable()
export class UserService {
  // private loggedInUser: User;
  // private subjectUserInfoChanged = new Subject<any>();

  constructor(private _Utilities: UtilitiesService, private http: Http, private router: Router) {
  }


  // getLoggedInUser(): User {
  //   return this.loggedInUser;
  // }

  // setLoggedInUser(user: User) {
  //   this.loggedInUser = user;
  // }

  setToken(token: Token) {
    if (token) {
      this._Utilities.setLocalStorage(SYSTEM.TOKEN, JSON.stringify(token));
    }
  }

  getToken(): Token {
    return this._Utilities.getLocalStorage(SYSTEM.TOKEN) ? JSON.parse(this._Utilities.getLocalStorage(SYSTEM.TOKEN)) : null;
  }

  removeToken() {
    this._Utilities.deleteLocalStorage(SYSTEM.TOKEN);
  }

  // setLoginedAccount(account: LoginAccount, isRemember) {
  //   let encryptedUser = this._Utilities.encryptText(JSON.stringify(account), SYSTEM.SECRET_KEY);
  //   if (isRemember) {
  //     this._Utilities.setLocalStorage(SYSTEM.ACCOUNT, encryptedUser.toString());
  //   } else {
  //     // sessionStorage.setItem(SYSTEM.ACCOUNT, encryptedUser.toString());
  //   }
  // }

  // getLoginedAccount(): LoginAccount {
  //   let encryptedAccount = this._Utilities.getLocalStorage(SYSTEM.ACCOUNT);
  //   let account: LoginAccount;
  //   if (encryptedAccount) {
  //     account = JSON.parse(this._Utilities.decryptText(encryptedAccount, SYSTEM.SECRET_KEY));
  //   } else { // check is refresh browser
  //     encryptedAccount = sessionStorage.getItem(SYSTEM.ACCOUNT);
  //     if (encryptedAccount) {
  //       account = JSON.parse(this._Utilities.decryptText(encryptedAccount, SYSTEM.SECRET_KEY));
  //     }
  //   }
  //   return account;
  // }

  setTenantId(tenantId) {
    if (tenantId) {
      this._Utilities.setLocalStorage(SYSTEM.TENANT_ID, tenantId.toString());
    }
  }

  getTenantId() {
    return this._Utilities.getLocalStorage(SYSTEM.TENANT_ID) ? this._Utilities.getLocalStorage(SYSTEM.TENANT_ID) : null;
  }

  removeTenantId() {
    this._Utilities.deleteLocalStorage(SYSTEM.TENANT_ID);
  }

  setLoginInfo(userInfo) {
    if (userInfo) {
      this._Utilities.setSessionStorage(SYSTEM.LOGIN_USER_INFO, JSON.stringify(userInfo));
    }
  }

  getLoginInfo() {
    return this._Utilities.getSessionStorage(SYSTEM.LOGIN_USER_INFO) ? JSON.parse(this._Utilities.getSessionStorage(SYSTEM.LOGIN_USER_INFO)[SYSTEM.ACCESS_TOKEN]) : null;
  }

  removeLoginInfo() {
    this._Utilities.deleteSessionStorage(SYSTEM.LOGIN_USER_INFO);
  }

  // updateUserInfo(name, email) {
  //   this.loggedInUser.fullName = name || this.loggedInUser.fullName;
  //   this.loggedInUser.email = email || this.loggedInUser.email;
  // }

  // afterUserInfoChanged(): Observable<any> {
  //   return this.subjectUserInfoChanged.asObservable();
  // }

  // broadcastUserInfoChanged(data = null) {
  //   this.subjectUserInfoChanged.next(data);
  // }
}