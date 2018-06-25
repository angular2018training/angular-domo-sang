import { AuthService } from './../../core/services/auth.service';
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';
import { UtilitiesService, Strings } from "../../core/services/utilities.service";
import { SYSTEM } from "../../core/constants/system.constant";
import { API_CONFIGURATION, MESSAGE, LOCK_UI_MESSAGES } from "../../core/constants/server.constant";
import { UserService } from "../../core/services/user.service";
import { Router } from '@angular/router';
import { LOCAL_MESSAGE } from '../../core/constants/message';

@Injectable()
export class CommonService {
  constructor(protected http: Http, protected _Utilities: UtilitiesService, private _UserService: UserService, private router: Router,
    private _AuthService: AuthService) {
  }

  protected getHeaderDefault() {

    // Remove tenant id if this is not client-management module
    let url = this.router.url;
    let urlSplit = url.split('client-management');

    // if (urlSplit.length === 1 || (urlSplit.length > 1 && urlSplit[1] === '')) {
    //   this._UserService.removeTenantId();
    // }

    if (this.router.url !== 'system/login' && this.router.url.indexOf('reset-password') === -1 && this.router.url.indexOf('reset/finish') === -1) {
      this._AuthService.checkValidSession();
    }

    this._AuthService.updatePasswordExpired();

    let headers = new Headers();
    let token = this._UserService.getToken();
    let currentToken;

    if (token && token.accessToken) {
      currentToken = "Bearer " + token.accessToken;
    }

    let tenantId = this._UserService.getTenantId();

    // set headers here e.g.
    headers.append('Authorization', token ? currentToken : '');

    if (tenantId) {
      headers.append('tenant_id', tenantId);
    }

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Accept', 'application/json, text/plain, */*');

    return headers;
  }
  protected getHeaderFormData() {
    // Remove tenant id if this is not client-management module
    let url = this.router.url;
    let urlSplit = url.split('client-management');

    // if (urlSplit.length === 1 || (urlSplit.length > 1 && urlSplit[1] === '')) {
    //   this._UserService.removeTenantId();
    // }

    if (this.router.url !== 'system/login' && this.router.url.indexOf('reset-password') === -1 && this.router.url.indexOf('reset/finish') === -1) {
      this._AuthService.checkValidSession();
    }

    this._AuthService.updatePasswordExpired();

    let headers = new Headers();
    let token = this._UserService.getToken();
    let currentToken;

    if (token && token.accessToken) {
      currentToken = "Bearer " + token.accessToken;
    }

    let tenantId = this._UserService.getTenantId();

    // set headers here e.g.
    headers.append('Authorization', token ? currentToken : '');

    if (tenantId) {
      headers.append('tenant_id', tenantId);
    }

    // headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Accept', 'application/json, text/plain, */*');

    return headers;
  }

  protected getRequest(url, params = null, headers = null) {
    if (!headers) {
      headers = this.getHeaderDefault();
    }
    let urlParams = new URLSearchParams();
    for (let prop in params) {
      if (params.hasOwnProperty(prop)) {
        urlParams.set(prop, params[prop]);
      }
    }
    let options = new RequestOptions({ headers: headers, params: urlParams });
    return this.http.get(url, options)
      .toPromise()
      .then(this.extractData).catch(err => { return this.handleErrorPromise(err) });
  }

  protected parsePageParam(dataTable) {
    let result = '?';
    if (dataTable) {
      result += 'page=' + (dataTable.currentPage - 1) + '&size=' + dataTable.pageSize
        + '&sort=' + (dataTable.sortOrder === 'DESC' ? '-' : '+') + dataTable.sortBy
    }
    return result.length === 1 ? '' : result;
  }

  protected postRequest(url, body: any = {}, headers = null, params = null) {
    if (!headers) {
      headers = this.getHeaderDefault();
    }
    let urlParams = new URLSearchParams();
    for (let prop in params) {
      if (params.hasOwnProperty(prop)) {
        urlParams.set(prop, params[prop]);
      }
    }
    let options = new RequestOptions({ headers: headers, params: urlParams });
    return this.http.post(url, body, options)
      .toPromise()
      .then(this.extractData).catch(err => { return this.handleErrorPromise(err) });
  }

  protected downloadRequest(url, body: any = {}, headers = null, params = null) {
    if (!headers) {
      headers = this.getHeaderDefault();
    }
    let urlParams = new URLSearchParams();
    for (let prop in params) {
      if (params.hasOwnProperty(prop)) {
        urlParams.set(prop, params[prop]);
      }
    }
    let options = new RequestOptions({ headers: headers, params: urlParams, responseType: ResponseContentType.Blob });
    return this.http.get(url, options)
      .toPromise()
      .then(this.extractData).catch(err => { return this.handleErrorPromise(err) });
  }

  protected deleteRequest(url, params = null, headers = null) {
    if (!headers) {
      headers = this.getHeaderDefault();
    }
    let urlParams = new URLSearchParams();
    for (let prop in params) {
      if (params.hasOwnProperty(prop)) {
        urlParams.set(prop, params[prop]);
      }
    }
    let options = new RequestOptions({ headers: headers, params: urlParams });
    return this.http.delete(url, options)
      .toPromise()
      .then(this.extractData).catch(err => { return this.handleErrorPromise(err) });
  }

  protected putRequest(url, body = null, headers = null) {
    if (!headers) {
      headers = this.getHeaderDefault();
    }
    let options = new RequestOptions({ headers: headers });
    return this.http.put(url, body, options).toPromise()
      .then(this.extractData)
      .catch(err => { return this.handleErrorPromise(err) });
  }

  private extractData(res: Response) {
    let body = res.text();  // If response is a JSON use json()
    if (body) {
      return res.json();
    }
    return {};
  }

  protected handleErrorPromise(err: Response | any) {
    let tagMessage;
    let errorCode = null;

    if (err && err.status !== 0) {
      let errRespone;
      try {
        errRespone = JSON.parse(err._body);

        if (errRespone.fieldErrors && errRespone.fieldErrors instanceof Array && errRespone.fieldErrors.length > 0) {
          errorCode = errRespone.fieldErrors[0].code;

          if (errorCode) {
            tagMessage = LOCAL_MESSAGE[errorCode];

            if (!tagMessage) {
              tagMessage = LOCAL_MESSAGE.defaultMessage;
            }
          } else {
            tagMessage = LOCAL_MESSAGE.defaultMessage;
          }
        } else if (errRespone.fieldErrors && errRespone.fieldErrors instanceof Object) {
          errorCode = errRespone.fieldErrors.code;

          if (errorCode) {
            tagMessage = LOCAL_MESSAGE[errorCode];

            if (!tagMessage) {
              tagMessage = LOCAL_MESSAGE.defaultMessage;
            }
          } else {
            tagMessage = LOCAL_MESSAGE.defaultMessage;
          }
        }
      } catch (e) {
        if (err._body instanceof Blob) {
          tagMessage = err.status === 404 ? LOCAL_MESSAGE['95'] : LOCAL_MESSAGE.defaultMessage;
          errorCode = 95;
        }
      }
    } else {
      tagMessage = LOCAL_MESSAGE.noInternetMessage;
    }

    this._Utilities.translateValueByKey(tagMessage, null).subscribe(value => {
      if (errorCode && parseInt(errorCode) !== 136 && parseInt(errorCode) !== 22
        && parseInt(errorCode) !== 1003 && parseInt(errorCode) !== 93) {
        this._Utilities.showError(value);
      }

    });

    if (parseInt(errorCode) === 61 || parseInt(errorCode) === 43
      || parseInt(errorCode) === 144 || parseInt(errorCode) === 42
      || parseInt(errorCode) === 143) {
      this._AuthService.logoutUser();
    }

    return Promise.reject(err);
  }


  protected handleRequest(requestFn: (() => Promise<any>)) {
    this._Utilities.showLoading();
    return requestFn().then((rs) => {
      this._Utilities.hideLoading();
      return rs;
    }).catch((err) => {
      err = err.json ? err.json() : err;
      this._Utilities.hideLoading();
      return Promise.reject(err);
    })
  }

  public getNewToken(body) {
    let headers = new Headers();
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Authorization', 'Basic QWZtSnNDbGllbnQ6QWZtITIwMTc=');

    // let body = {
    //   username: username,
    //   password: password
    // };
    // if (reCaptcha) {
    //   body['reCaptcha'] = reCaptcha;
    // }
    return this.postRequest(API_CONFIGURATION.URLS.ADMIN.SYSTEM_LOGIN, body);
  }

  public removeToken(): Promise<any> {
    return this.postRequest(API_CONFIGURATION.URLS.ADMIN.LOGOUT);
  }

  // private loadUserInfo(params) {
  //   let headers = new Headers();

  //   headers.append('Content-Type', 'application/json; charset=UTF-8');
  //   headers.append('Accept', 'application/json, text/plain, */*');
  //   headers.append('TenantId', params.tenantId);
  //   headers.append('Authorization', params.token);

  //   return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.LOAD_USER_INFO, headers, params), true, true);
  // }

  // public getUserInfo(noRedirect = true, receiveError = true) {
  //   return this.handleRequest(() => this.getRequest(API_CONFIGURATION.URLS.ADMIN.GET_USER_INFO), noRedirect, receiveError);
  // }

  public samlLogout(): Promise<any> {
    return this.postRequest(API_CONFIGURATION.URLS.ADMIN.SAML_LOGOUT, null, null, { local: true });
  }

  public updatePasswordExpired() {

  }
}