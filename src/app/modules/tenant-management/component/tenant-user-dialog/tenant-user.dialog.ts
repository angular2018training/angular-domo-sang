import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding } from '@angular/core';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TenantManagementService } from '../../tenant-management.service';
import { UserTenantPage } from '../../pages/user-tenant/user-tenant.page';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SYSTEM, PATTERNS } from "../../../../core/constants/system.constant";
import { LOCAL_MESSAGE } from "../../../../core/constants/message";
import { isNumber } from 'util';
import { AuthService } from "../../../../core/services/auth.service";
@Component({
  selector: "app-tenant-user-dialog",
  templateUrl: "./tenant-user.dialog.html",
  styleUrls: ["./tenant-user.dialog.scss"]
})
export class TenantUserDialog implements OnInit {
  inputMaxName = 100;
  inputMaxPhone = 16;
  patternInput = PATTERNS.VALIDATE_LEADING_SPACE;
  numberPattern = "^[0-9]{0,}$";
  @HostBinding("class.full-wh") true;
  adminModel = {
    fullname: "",
    firstName: "",
    email: "",
    role: "",
    status: "",
    id: null,
    lastName: "",
    language: "",
    phone: "",
    login: "",
    activated: "",
 
  };
  passwordModel = {
    newPassword: "",
    confirmNewPassword: ""
  };
  users = [];
  constructor(
    public dialogRef: MatDialogRef<TenantUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _TenantManagementService: TenantManagementService,
    private _UtilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _AuthService: AuthService
  ) {
    let url = this.router.url;
    let temp = url.split("=");

    this.adminModel.id = temp.length > 1 ? temp[1] : null;
  }

  updateUserForm = new FormGroup({
    email: new FormControl(this.adminModel.email, [
      Validators.required,
      Validators.maxLength(100),
      Validators.email
    ]),
    firstName: new FormControl(this.adminModel.firstName, [
      Validators.required,
      Validators.maxLength(100)
    ]),
    lastName: new FormControl(this.adminModel.lastName, [
      Validators.required,
      Validators.maxLength(100)
    ]),
    login: new FormControl(this.adminModel.firstName),
    role: new FormControl(this.adminModel.role),
    phone: new FormControl(this.adminModel.phone),
    status: new FormControl(this.adminModel.status),
    language: new FormControl(this.adminModel.language)
  });
  get email() {
    return this.updateUserForm.get("email");
  }
  get firstName() {
    return this.updateUserForm.get("firstName");
  }
  get lastName() {
    return this.updateUserForm.get("lastName");
  }
  get role() {
    return this.updateUserForm.get("role");
  }
  get status() {
    return this.updateUserForm.get("status");
  }
  get language() {
    return this.updateUserForm.get("language");
  }
  get phone() {
    return this.updateUserForm.get("phone");
  }

  updatePasswordForm = new FormGroup({
    newPassword: new FormControl(this.passwordModel.newPassword),
    confirmNewPassword: new FormControl(this.passwordModel.confirmNewPassword)
  });
  get newPassword() {
    return this.updatePasswordForm.get("newPassword");
  }
  get confirmNewPassword() {
    return this.updatePasswordForm.get("confirmNewPassword");
  }

  ngOnInit() {
    if (!isNumber(this.data.model.id)) {
      let model = this.data.model;
      this.changeStringToNumber(model);
      this.adminModel = {
        id: model.id,
        fullname: model.fullname,
        email: model.email,
        role: model.userType,
        status: model.accountStatus,
        phone: model.phone,
        language: model.language,
        firstName: model.firstName,
        lastName: model.lastName,
        login: "",
        activated: model.activated
      };
    } else {
      return this._TenantManagementService
        .viewUser(this.adminModel.id)
        .then(result => {
          let model = this.data.model;
          this.changeStringToNumber(model);
          if (model) {
            this.adminModel = {
              id: model.id,
              fullname: model.fullname,
              email: model.email,
              role: model.userType,
              status: model.accountStatus,
              phone: model.phone,
              language: model.language,
              firstName: model.firstName,
              lastName: model.lastName,
              login: "admin",
              activated: model.activated
              // status:''
            };
          }
        });
    }
  }

  changeStringToNumber(item) {
    if (item.userType == "Super Consultant") {
      item.userType = 3;
    }
    if (item.userType == "Consultant") {
      item.userType = 2;
    }
    if (item.accountStatus == "Enable") {
      item.accountStatus = 1;
    }
    if (item.accountStatus == "Disable") {
      item.accountStatus = 2;
    }
    if (item.accountStatus == "Activated") {
      item.accountStatus = 3;
    }
    if (item.accountStatus == "Deactivated") {
      item.accountStatus = 4;
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  updateDetail() {
    if (!isNumber(this.data.model.id)) {
      var a = true;
      //loop check
      this.users.forEach(user => {
        if (a && user.email === this.adminModel.email) {
          // show message "email exists"
          this._UtilitiesService
            .translateValueByKey(LOCAL_MESSAGE["5"])
            .subscribe(value => {
              this._UtilitiesService.showError(value);
            });

          a = false;
        }
      });

      if (a) {
        // console.log(this.adminModel.role, this.adminModel.status);
        let request = {
          firstName: this.adminModel.firstName,
          email: this.adminModel.email,
          userType: parseInt(this.adminModel.role),
          accountStatus: this.adminModel.status,
          lastName: this.adminModel.lastName,
          phone: this.adminModel.phone,
          language: parseInt(this.adminModel.language),
          login: this.adminModel.email,
          id: this.adminModel.id
        };
        // Close dialog
        this.dialogRef.close(request);
      }
    } else {
      let errorInput = [];
      if (errorInput.length > 0) {
        this._UtilitiesService.validationWarningDisplay(errorInput);
      } else {
        let userLogin = this._AuthService.getLoggedInUser();
        let request = {
          firstName: this.adminModel.firstName,
          email: this.adminModel.email,
          userType: parseInt(this.adminModel.role),
          accountStatus: this.adminModel.status,
          lastName: this.adminModel.lastName,
          phone: this.adminModel.phone,
          language: parseInt(this.adminModel.language),
          login: this.adminModel.email,
          id: this.adminModel.id,
          loginId: userLogin.id
        };
        return this._TenantManagementService
          .updateUser(request)
          .then(result => {
            if (result) {
              this._UtilitiesService.showSuccessMessageAPI(result);
            }
          });
      }
    }
  }

  inputPasswordValidation() {
    let errorInput = [];
    if (
      this.passwordModel.newPassword != this.passwordModel.confirmNewPassword
    ) {
      errorInput.push("Passwords incorrect");
    }
    return errorInput;
  }

  updatePassword() {
    let errorInput = [];
    errorInput = this.inputPasswordValidation();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      let userLogin = this._AuthService.getLoggedInUser();
      let request = {
        id: this.adminModel.id,
        newPassword: this.passwordModel.newPassword,
        confirmPassword: this.passwordModel.confirmNewPassword,
        loginId: userLogin.id,
      };
      return this._TenantManagementService
        .updatePassword(request)
        .then(result => {
          if (result) {
            this._UtilitiesService.showSuccessMessageAPI(result);
          }
        });
    }
  }
}