import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Injectable, NgModule, Renderer2 } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import * as moment from 'moment';

import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM, TAGS } from '../constants/system.constant';
import * as CryptoJS from 'crypto-js';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog.dialog';
import { ConfirmDialogDeletedDialog } from "../components/confirm-dialog-deleted/confirm-dialog-deleted.dialog";
import { Response } from '@angular/http/src/static_response';
import { API_CONFIGURATION } from '../constants/server.constant';
import { ToastrService } from 'ngx-toastr';

export var Strings = {

  format: (() => {
    return function (string, ...any) {
      // The string containing the format items (e.g. "{0}")
      // will and always has to be the first argument.
      var str = arguments[0];

      // start with the second argument (i = 1)
      for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        str = str.replace(regEx, arguments[i]);
      }

      return str;
    }
  })(),
  formatArray: (() => {
    var regexp = /{([^{]+)}/g;
    return function (str, pars) {
      return str.replace(regexp, function (ignore, key) {
        return pars[key] ? pars[key] : '';
      });
    }
  })(),
  isEmpty: (() => {
    return (val) => (val === undefined || val == null || val.length <= 0) ? true : false;
  })(),
}

@Injectable()
export class UtilitiesService {
  private isLoading: Boolean = false;
  private toastOpts = {
    toastLife: 2000,
    maxShown: 5,
    showCloseButton: true,
    enableHTML: true,
    preventDuplicates: true
  };
  private language;
  public static subjectLanguage = new Subject<any>();
  public static subjectScreen = new Subject<any>();
  private screenId: string;

  private _Renderer2: Renderer2;
  public messagesObject = {};

  constructor(private cookieService: CookieService, private _loadingService: TdLoadingService, private toastr: ToastrService, private dialog: MatDialog, private translateService: TranslateService, private http: Http) {
  }

  public formatTime(time) {
    return moment(time).format("YYYY/MM/DD HH:mm:ss");
  };

  public formatDateTime(time) {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
  };

  public showLoading() {
    if (!this.isLoading) {
      this._loadingService.register();
      this.isLoading = true;
    }
  }

  public hideLoading() {
    setTimeout(() => {
      if (this.isLoading) {
        this._loadingService.resolve();
        this.isLoading = false;
      }
    }, 100);
  }

  public showSuccess(message) {
    this.toastr.success(message, undefined);
  }

  public showError(message) {
    if (message) {
      let opts = _.cloneDeep(this.toastOpts);
      opts.toastLife = 7000;
      this.toastr.error(message, undefined);
    }
  }

  public showWarning(message) {
    let opts = _.cloneDeep(this.toastOpts);
    opts.toastLife = 5000;
    this.toastr.warning(message, undefined);
  }

  public showInfo(message) {
    let opts = _.cloneDeep(this.toastOpts);
    opts.toastLife = 4000;
    this.toastr.info(message, undefined);
  }

  public translateValue(key, param?) {
    return this.translateService.get(TAGS, param);
  }

  public translateValueByKey(key, param?) {

    return this.translateService.get(key, param);
  }

  public showConfirmDialog(message, callback) {
    var title = '';
    var content = '';
    this.translateService
      .get(['tags.confirmation', message], null)
      .subscribe(value => {
        title = value['tags.confirmation'];
        content = value[message];
      });
    let dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      minHeight: '150px',
      disableClose: true,
      data: {
        title: title,
        message: content
      }
    });

    dialogRef.afterClosed().subscribe(callback);
  }

  public showConfirmDeletedDialog(message, callback) {
    var title = "";
    var content = "";
    this.translateService
      .get(["tags.confirmation", message], null)
      .subscribe(value => {
        title = value["tags.confirmation"];
        content = value[message];
      });
    let dialogRef = this.dialog.open(ConfirmDialogDeletedDialog, {
      width: "350px",
      minHeight: "150px",
      disableClose: true,
      data: {
        title: title,
        message: content
      }
    });

    dialogRef.afterClosed().subscribe(callback);
  }

  public setLanguage(language) {
    this.language = _.cloneDeep(language);
    this.translateService.use(this.language.value);
    // this.setLocalStorage(SYSTEM.LANGUAGE, JSON.stringify(language));
    UtilitiesService.subjectLanguage.next({});
  }

  public getLanguage() {
    return _.cloneDeep(this.language);
  }

  public getLanguageChangeEvent(): Observable<any> {
    return UtilitiesService.subjectLanguage.asObservable();
  }

  public md5Text(text) {
    return CryptoJS.MD5(text).toString();
  }

  public encryptText(text, key) {
    if (!text) return '';
    return CryptoJS.AES.encrypt(text, key);
  }

  public decryptText(text, key) {
    if (!text) return '';
    let decryped = CryptoJS.AES.decrypt(text, key);
    return decryped.toString(CryptoJS.enc.Utf8);
  }

  public setLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  public getLocalStorage(key) {
    return localStorage.getItem(key);
  }

  public deleteLocalStorage(key) {
    localStorage.removeItem(key);
  }

  // public setCookie(key, value) {
  //   this.cookieService.set(key, value, 0);
  // }

  // public getCookie(key) {
  //   return this.cookieService.get(key);
  // }

  // public deleteCookie(key) {
  //   this.cookieService.delete(key);
  // }

  public setScreenId(screen) {
    this.screenId = screen;
    UtilitiesService.subjectScreen.next({});
  }

  public getScreenChangeEvent(): Observable<any> {
    return UtilitiesService.subjectScreen.asObservable();
  }

  public getScreenId() {
    return this.screenId;
  }

  public getScrollHeightOfElement(element) {
    let height = 0;
    if (element.scrollWidth > element.clientWidth) {
      if (element.children.length === 1) {
        height = element.offsetHeight - element.children[0].clientHeight;
        height = height < 0 ? 0 : height;
      }
    }
    return height;
  }
  public getTranslatedValue(tag: string) {
    let transValue = '';
    this.translateValueByKey([tag], null).subscribe(value => {
      transValue = value[tag];
    });
    return transValue;
  }
  public showErrorDialog(message, callback?) {
    var title = '';
    this.translateService.get(['tags.error'], null).subscribe((value) => {
      title = value['tags.error'];
    })
    // if (!this.dialogRef || !this.dialogRef.componentInstance) {
    //   this.dialogRef = this.dialog.open(ConfirmDialog, {
    //     minWidth: '30vw',
    //     maxWidth: '80vw',
    //     disableClose: true,
    //     data: {
    //       title: title,
    //       message: message,
    //       isErrorMode: true
    //     }
    //   });

    //   if (callback) {
    //     this.dialogRef.afterClosed().subscribe(callback);
    //   }
    // }
  }
  /**
   * Clone item except Date
   * @param item 
   */
  public clone(item: any) {
    return JSON.parse(JSON.stringify(item));
  }

  /**
   * Clone object
   * @param obj 
   */
  public cloneObject(obj: object): object {
    return Object.assign({}, obj)
  }

  /**
   * Add class to element
   * @param element 
   * @param className 
   */
  public addClass(ele, className) {
    if (!ele) return;
    this._Renderer2.addClass(ele, className);
  }

  /**
   * Remove class from element
   * @param element
   * @param className 
   */
  public removeClass(ele, className) {
    if (!ele) return;
    this._Renderer2.removeClass(ele, className);
  }

  /**
   * Check object empty
   * @param obj
   */
  public isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

  public setSessionStorage(key, item) {
    let encryptedItem = this.encryptText(item, SYSTEM.SECRET_KEY);
    sessionStorage.setItem(key, encryptedItem.toString());
  }

  public getSessionStorage(key) {
    let encryptedItem = sessionStorage.getItem(key);
    if (!encryptedItem) return null;
    let decryptedItem = this.decryptText(encryptedItem, SYSTEM.SECRET_KEY);
    var decryptedItemObj = {};
    decryptedItemObj[SYSTEM.ACCESS_TOKEN] = decryptedItem;
    return JSON.parse(JSON.stringify(decryptedItemObj));
  }

  public deleteSessionStorage(key) {
    sessionStorage.removeItem(key);
  }
  /* show warning message */
  validationWarningDisplay(errorInput) {
    let errorMessage = '';
    if (errorInput.length > 1) {
      _.forEach(_.uniq(errorInput), (value, index) => {
        if (index < errorInput.length - 1) {
          errorMessage = errorMessage + value + '\n\n';
        } else {
          errorMessage = errorMessage + value;
        }
      });
    } else {
      errorMessage = errorInput;
    }
    this.showWarning(errorMessage);
  }
  /* show success message */
  showSuccessMessageAPI(res) {
    if (res) {
      res.fieldErrors.forEach(element => {
        this.showSuccess(element.message);
      });
    } else {
      this.showSuccess('Successfully');
    }
  }
  /* show error message */
  showErrorMessageAPI(res) {
    if (res) {
      res.fieldErrors.forEach(element => {
        this.showError(element.message);
      });
    } else {
      this.showError('Error');
    }
  }
  /* validation file import */
  validationInportFile(file, type, size = null) {
    let errorInput = [];
    let isValid = false;
    for (let index = 0; index < type.length; index++) {
      if (_.toLower(file.name).lastIndexOf(type[index]) > 0) {
        isValid = true;
        break;
      }
    }
    if (!isValid) {
      if (_.indexOf(type, '.csv') >= 0) {
        errorInput.push('tags.message.invalid.fileFormat.csv');
      } else if (_.indexOf(type, '.png') >= 0) {
        errorInput.push('tags.message.invalid.fileFormat.png');
      }
    }
    if (size && file.size > size) {
      errorInput.push('tags.message.invalid.fileSize');
    }
    return errorInput;
  }

  changeLanguage(listTitle) {
    let errorList = [];
    this.translateValueByKey(listTitle, null).subscribe(value => {
      for(let i = 0; i < listTitle.length; i++) {
        errorList.push(value[listTitle[i]]);
      }
    });
    return errorList;
  }
}
