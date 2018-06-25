import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  HostBinding
} from "@angular/core";
import { UtilitiesService } from "../../../../core/services/utilities.service";
import {
  ITdDataTableColumn,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent,
  TdDataTableService,
  IPageChangeEvent
} from "@covalent/core";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TenantManagementService } from "../../tenant-management.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TenantDetailPage } from "../../pages/tenant-detail/tenant-detail.page";
import { SYSTEM, PATTERNS } from "../../../../core/constants/system.constant";
import { LOCAL_MESSAGE } from "../../../../core/constants/message";
@Component({
  selector: "app-tenant-user-create-dialog",
  templateUrl: "./tenant-user-create.dialog.html",
  styleUrls: ["./tenant-user-create.dialog.scss"]
})
export class TenantUserCreateDialog implements OnInit {
  private _TenantDetailPage: TenantDetailPage;
  inputMaxName = 100;
  inputMaxPhone = 16;
  numberPattern = "^[0-9]{0,}$";
  pattern = PATTERNS.VALIDATE_EMAIL;
  patternInput = PATTERNS.VALIDATE_LEADING_SPACE;
  @HostBinding("class.full-wh") true;

  adminModel = {
    firstName: '',
    email: '',
    role: '',
    status: '',
    id : this.data.tenantId,
    lastName: '',
    language: '',
    phone:'',
    login:'',
    tenantId:'',
  };

  users = [];

  constructor(
    public dialogRef: MatDialogRef<TenantUserCreateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _UtilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute,
    private _TenantManagementService: TenantManagementService
  ) {}

  ngOnInit() {
    this.users = this.data.users;
    console.log("users: ", this.users);
    // console.log(this.createUserForm);
  }

  createUserForm = new FormGroup({
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
    login: new FormControl(this.adminModel.email),
    role: new FormControl(this.adminModel.role, [Validators.required]),
    phone: new FormControl(this.adminModel.phone),
    status: new FormControl(this.adminModel.status),
    language: new FormControl(this.adminModel.language)
  });
  get email() {
    return this.createUserForm.get("email");
  }
  get firstName() {
    return this.createUserForm.get("firstName");
  }
  get lastName() {
    return this.createUserForm.get("lastName");
  }
  get role() {
    return this.createUserForm.get("role");
  }
  get status() {
    return this.createUserForm.get("status");
  }
  get language() {
    return this.createUserForm.get("language");
  }
  get phone() {
    return this.createUserForm.get("phone");
  }

  cancel() {
    this._UtilitiesService.showConfirmDialog(
      "Are you sure you want to cancel?",
      res => {
        if (res) {
          this.closeDialog()
        }
      }
    );
  }

  saveInfo() {
    if (this.adminModel.id === "") {
      var a = true;
      //loop check
      this.users.forEach(user => {
        if (a && user.email === this.adminModel.email) {
          // show message "email exists"
          this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['5']).subscribe(value => {
            this._UtilitiesService.showError(value);
          });
          
          a = false;
        }
      })

      if (a) {
        // console.log(this.adminModel.role, this.adminModel.status);
      let request = {
        firstName: this.adminModel.firstName,
        email: this.adminModel.email,
        userType: this.adminModel.role,
        accountStatus: this.adminModel.status,
        lastName: this.adminModel.lastName,
        phone: this.adminModel.phone,
        language: parseInt(this.adminModel.language),
        login: this.adminModel.email,
      };
        // Close dialog
        this.dialogRef.close(request);
      }

    } else {
      let errorInput = [];
      if (errorInput.length > 0) {
        this._UtilitiesService.validationWarningDisplay(errorInput);
      } else {
        let request = {
          firstName: this.adminModel.firstName,
          email: this.adminModel.email,
          userType: parseInt(this.adminModel.role),
          accountStatus: this.adminModel.status,
          lastName: this.adminModel.lastName,
          phone: this.adminModel.phone,
          language: parseInt(this.adminModel.language),
          login: this.adminModel.email,
          tenantId: this.adminModel.id
        };

        // this.dialogRef.close(request);

        return this._TenantManagementService.createUser(request).then(
          result => {
            if (result) {
              this._UtilitiesService.showSuccessMessageAPI(result);
            }
            // this._TenantDetailPage.reloadData();
          }
        );
      }
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }
}
