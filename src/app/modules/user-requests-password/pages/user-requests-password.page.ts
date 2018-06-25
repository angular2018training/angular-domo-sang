import { LOCAL_MESSAGE } from './../../../core/constants/message';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { UserRequestsPasswordService } from '../user-requests-password.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-user-requests-password',
  templateUrl: './user-requests-password.page.html',
  styleUrls: ['./user-requests-password.page.scss']
})
export class UserRequestsPasswordPage implements OnInit {
  //key
  // key = this.activatedRoute.snapshot.queryParams['key'];
  

  fieldName = {
   email: '',
   newPassword: '',
   confirmPassword: '',
   status: '',
   key: ''
  };


  requestPasswordForm = new FormGroup({
    email: new FormControl(),
    newPassword: new FormControl(
      this.fieldName.newPassword, [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}.*$')
      ]
    ),
    confirmPassword: new FormControl(
      this.fieldName.confirmPassword, [
        Validators.required,
      ]
    ),
  });

  get newPassword() { return this.requestPasswordForm.get('newPassword'); }
  get confirmPassword() { return this.requestPasswordForm.get('confirmPassword'); }

  constructor(
    private _UtilitiesService: UtilitiesService,
    private _UserRequestsPasswordService: UserRequestsPasswordService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.fieldName.key = this.activatedRoute.snapshot.queryParams['key'];
    this.fieldName.email = this.activatedRoute.snapshot.queryParams['email'];
    this.fieldName.status = this.activatedRoute.snapshot.queryParams['status'];
  }

  onFormSubmit(){
    const request = this.updateUserInfo();
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.sendUserInfo(request);
      
    }
  }

  sendUserInfo(request){
    return this._UserRequestsPasswordService.sendUserInfo(request).then(result => {
      if (result) {
        if (result && result.fieldErrors && result.fieldErrors.length > 0) {
          this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE[result.fieldErrors[0].code]).subscribe(value => {
            this._UtilitiesService.showSuccess(value);
          })
        }

        this.router.navigate(['system/login']);
        this.authService.logoutUser();
        // this._UtilitiesService.showSuccessMessageAPI(result);
      }
    });
  }

  inputValidation() {
    let errorInput = [];
    if (!this.fieldName.email) {
      errorInput.push('Please enter the email');
    }
    if (!this.fieldName.newPassword) {
      errorInput.push('Please enter the New Password');
    }
    if (!this.fieldName.confirmPassword) {
      errorInput.push('Please enter the Confirm Password');
    }
    return errorInput;
  }

  updateUserInfo(){
    console.log(this.fieldName);

    let request = {
      email: this.fieldName.email,
      key: this.fieldName.key,
      status: this.fieldName.status,
      newPassword: this.fieldName.newPassword,
      confirmPassword: this.fieldName.confirmPassword
    }
    return request;
  }
}
