import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { UserDetailService } from '../user-detail.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmEqualValidatorDirective } from '../../../shared/components/confirm-password/confirm-equal-validator.directive';
import { RootConfirmEqualValidatorDirective } from '../../../shared/components/root-confirm-password/confirm-equal-validator.directive';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss']
})


export class UserDetailPage implements OnInit {

  constructor(private _UtilitiesService: UtilitiesService,
    private _AuthService: AuthService,
    private _UserDetailService: UserDetailService, ) {

  }

  inputMaxName = 100;
  user;
  fieldName = {
    id: '',
    login: '',
    firstName: '',
    lastName: '',
    phone: '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  };
  userDetailForm = new FormGroup({
    emailControl: new FormControl(),
    firstNameControl: new FormControl(this.fieldName.firstName, [
      Validators.required,Validators.maxLength(100)]),
    lastNameControl: new FormControl(this.fieldName.lastName, [
      Validators.required,Validators.maxLength(100)]),
    phoneControl: new FormControl(this.fieldName.phone,[CustomValidators.number,Validators.pattern('^.{0,16}$')]),
  });

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl(
      this.fieldName.currentPassword, [
        Validators.required,
        Validators.maxLength(100),
      ]
    ),
    password: new FormControl(
      this.fieldName.password, [
        Validators.required,
        //Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,}.*$'),
        Validators.maxLength(100)
        //^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$

      ]
    ),
    confirmPassword: new FormControl(
      this.fieldName.confirmPassword, [
        Validators.required,
        Validators.maxLength(100)
      ]
    ),
  });
  get lastNameControl() { return this.userDetailForm.get('lastNameControl'); }
  get firstNameControl() { return this.userDetailForm.get('firstNameControl'); }
  get phoneControl() { return this.userDetailForm.get('phoneControl'); }
  get currentPassword() { return this.changePasswordForm.get('currentPassword'); }
  get password() { return this.changePasswordForm.get('password'); }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }


  getUserData() {
    return this._UserDetailService.getUser().then(result => {
      if (result) {
        this.fieldName = result;
      }
    });
  }

  onDetailFormSubmit() {
    const request = this.prepareUserDetail();
    let errorInput = [];
    errorInput = this.inputValidationDetail();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.updateData(request);
    }
  }

  onChangePasswordFormSubmit() {
    const request = this.prepareChangePassword();
    let errorInput = [];
    errorInput = this.inputValidationPass();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.changePassword(request);
    }
  }

  prepareChangePassword() {
    console.log(this.fieldName);

    let request = {
      currentPassword: this.fieldName.currentPassword,
      password: this.fieldName.password,
      confirmPassword: this.fieldName.confirmPassword
    }
    return request;

    // formData.append('currentPassword', this.fieldName.currentPassword);
    // formData.append('newPassword', this.fieldName.newPassword);
    // formData.append('confirmPassword', this.fieldName.confirmNewPassword);
    // return formData;
  }
  prepareUserDetail() {
    // let formData = new FormData();
    // console.log(this.fieldName);
    // formData.append('login', this.fieldName.login);
    // formData.append('firstName', this.fieldName.firstName);
    // formData.append('lastName', this.fieldName.lastName);
    // formData.append('phone', this.fieldName.phone);
    // return formData;

    let request = {
      login: this.fieldName.login,
      firstName: this.fieldName.firstName,
      lastName: this.fieldName.lastName,
      phone: this.fieldName.phone
    }
    return request;
  }

  inputValidationDetail() {
    let errorInput = [];
    if (!this.fieldName.firstName) {
      errorInput.push('Please enter the First Name');
    }
    if (!this.fieldName.lastName) {
      errorInput.push('Please enter the Last Name');
    }
    // if (!this.fieldName.phone){
    //   errorInput.push('Please enter the Phone with Number')
    // }
    return errorInput;
  }

  inputValidationPass(){
    let errorInput = [];
    if (!this.fieldName.currentPassword) {
      errorInput.push('Please enter the Current Password');
    }
    return errorInput;
  }
  changePassword(request) {
    return this._UserDetailService.changePasswordUser(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
      }
    });
  }

  updateData(request) {
    return this._UserDetailService.editUser(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
      }
    });
  }

  generalForm = new FormGroup({
    fullname: new FormControl(),
    email: new FormControl(),
    role: new FormControl(),
  });

  detailForm = new FormGroup({
    userId: new FormControl(),
    curPassword: new FormControl(),
    newPassword: new FormControl(),
    confirmPassword: new FormControl()
  });

  invalidCredentialMsg: string;



  ngOnInit() {
    this._UtilitiesService.showLoading();
    this.getUserDetail();
    this.getUserData();
    setTimeout(() => {
      this._UtilitiesService.hideLoading();
    }, 500);
  }

  getUserDetail() {
    this.user = this._AuthService.getLoggedInUser();
    this.generalForm.setValue({
      fullname: this.user.fullName,
      email: this.user.email,
      role: this.user.useType,
    });
    this.detailForm.setValue({
      userId: this.user.id,
      curPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  matchValidator(fieldName: string) {
    let fcfirst: FormControl;
    let fcSecond: FormControl;

    return function matchValidator(control: FormControl) {

        if (!control.parent) {
            return null;
        }

        // INITIALIZING THE VALIDATOR.
        if (!fcfirst) {
            //INITIALIZING FormControl first
            fcfirst = control;
            fcSecond = control.parent.get(fieldName) as FormControl;

            //FormControl Second
            if (!fcSecond) {
                throw new Error('matchValidator(): Second control is not found in the parent group!');
            }

            fcSecond.valueChanges.subscribe(() => {
                fcfirst.updateValueAndValidity();
            });
        }

        if (!fcSecond) {
            return null;
        }

        if (fcSecond.value !== fcfirst.value) {
            return {
                matchOther: true
            };
        }

        return null;
    }
}

}
