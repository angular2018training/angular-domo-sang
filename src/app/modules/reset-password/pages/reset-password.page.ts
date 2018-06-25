import { ValidationService } from './../../../core/services/validation.service';
import { LOCAL_MESSAGE } from './../../../core/constants/message';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup , Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM } from '../../../core/constants/system.constant';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { RecaptchaComponent } from 'ng-recaptcha/recaptcha/recaptcha.component';
import { ResetPasswordService } from '../reset-password.service';


@Component({
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage implements OnInit {
  @ViewChild('captcha')  captcha;
  email;
  resetPasswordForm;

  reCaptcha;
  get emailControl() { return this.resetPasswordForm.get('emailControl'); }
  isValidCaptcha = false;
  constructor(private _AuthService: AuthService, private router: Router,
     private cookieService: CookieService, private _Utilities: UtilitiesService,
     private _ResetPasswordService: ResetPasswordService,
     private activatedRoute: ActivatedRoute,
     private _UtilitiesService: UtilitiesService,
    private validationService: ValidationService) {
  }

  ngOnInit() {
    this._Utilities.showLoading();
    setTimeout(() => {
      this._Utilities.hideLoading();
    }, 500);

    this.resetPasswordForm = new FormGroup({
      userId: new FormControl(null),
      emailControl: new FormControl(this.email, [
        Validators.pattern(this.validationService.emailFormat),
        Validators.required
      ])
      // captcha: new FormControl(),
    })
  }


  onFormSubmit() {
    let errorInput = [];
    if (!this.isValidCaptcha) {
      this.captcha.reset();
      errorInput.push(LOCAL_MESSAGE['15'])
      this._Utilities.translateValueByKey(LOCAL_MESSAGE['15']).subscribe(value => {
        this._UtilitiesService.showWarning(value);
      })

      return ;
    }
    
    let url = this._AuthService.getRequestPassUrl();
    
    const request = this.prepareUserDetail();
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      this._Utilities.translateValueByKey(LOCAL_MESSAGE['15']).subscribe(value => {
        this._UtilitiesService.showWarning(value);
      })
    } else {
      this.sendEmail(request);
    }
  }

  sendEmail(request){
    return this._ResetPasswordService.sendEmail(request).then(result => {
      if (result) {
        if (result && result.fieldErrors && result.fieldErrors.length > 0) {
          this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE[result.fieldErrors[0].code]).subscribe(value => {
            this._UtilitiesService.showSuccess(value);
          })
        }
      }
    }, err => {
      this.captcha.reset();
      this.isValidCaptcha = false;
      this.reCaptcha = null;
    });
  }
  recaptchaCallback(response) {
    this.reCaptcha = response;
    this.isValidCaptcha = true;
  };
  prepareUserDetail()
  {
    let request = {
      email: this.email,
      reCaptcha: this.reCaptcha
    }
    return request;
  }

  inputValidation() {
    let errorInput = [];
    if (!this.email) {
      errorInput.push(LOCAL_MESSAGE['15']);
    }
    return errorInput;
  }

}
