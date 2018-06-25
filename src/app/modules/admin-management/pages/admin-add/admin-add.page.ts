import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { AdminService } from '../../admin-management.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { TenantDetailPage } from "../../../tenant-detail/pages/tenant-detail.page";
@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.page.html',
  styleUrls: ['./admin-add.page.scss']
})
export class AdminAddPage implements OnInit {
  //private _TenantDetailPage: TenantDetailPage;
  inputMaxName = 100;
  userdetail : User = {
    id:'',
    login:'',
    firstName: '',
    lastName: '',
    email: '',
    imageUrl: '',
    activated: true,
    langKey: '',
    createdBy: '',
    createdDate: '',
    lastModifiedBy: '',
    lastModifiedDate: '',
    authorities: '',
    timezoneId: '',
    password: '',
    tenantId: '',
    userType:'',
    accountStatus: '',
    deletedDate: '',
    expiredDate: '',
    lastLoginDate:'',
    phone:null,
    role:'',
    status:''
     };


     createUserForm = new FormGroup({
      email: new FormControl(this.userdetail.email, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      firstName: new FormControl(this.userdetail.firstName, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      lastName:new FormControl(this.userdetail.lastName,[
        Validators.required,
        Validators.maxLength(100),
      ]),
      role:new FormControl(this.userdetail.role,[
        Validators.required,
      ]),
      status:new FormControl(this.userdetail.status,[
        Validators.required,
      ]),
      login: new FormControl(this.userdetail.lastName),
      phone:new FormControl(),
      // area: new FormControl(),
      // numberOfFloors: new FormControl(),
      // capacity: new FormControl(),
      // description: new FormControl(),
      // floor: new FormControl(),
      // avatar: new FormControl(),
    });
    get email() { return this.createUserForm.get('email'); }

    get firstName() { return this.createUserForm.get('firstName'); }
    get lastName() { return this.createUserForm.get('lastName'); }

    get role() { return this.createUserForm.get('role'); }
    get status() { return this.createUserForm.get('status'); }
    
  constructor(
    private _AdminService: AdminService,
    private _UtilitiesService: UtilitiesService,
 
  ) { }

  ngOnInit() {
    console.log(this.createUserForm);
  }
  onFormSubmit() {
    const request = this.prepareCreateData();    
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.createAction(request);
    }
  }
  createAction(request) {
    return this._AdminService.createUser(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        // this._TenantDetailPage.reloadData();
      }
    });
  }

  prepareCreateData() {
    let formData = new FormData();
    console.log(this.userdetail);

    formData.append('email', this.userdetail.email);
    formData.append('firstName', this.userdetail.firstName);
    formData.append('lastName', this.userdetail.lastName);
    // formData.append('role', this.userdetail.role);
    // formData.append('status', this.userdetail.status);
    formData.append('login', this.userdetail.firstName);    
    return formData;
  }


  inputValidation() {
    let errorInput = [];
    if (!this.userdetail.email) {
      errorInput.push('Please enter the Email');
    }
    if (!this.userdetail.firstName) {
      errorInput.push('Please enter the First Name');
    }
    if (!this.userdetail.lastName) {
      errorInput.push('Please enter the Last Name');
    }
    // if (!this.userdetail.role) {
    //   errorInput.push('Please enter the Role');
    // }
    // if (!this.userdetail.status) {
    //   errorInput.push('Please enter the Status');
    // }
    return errorInput;
  }

  cancel() {
    this._UtilitiesService.showConfirmDialog('tags.message.confirm.quit', (res) => {
      if (res) {
        // this._TenantDetailPage.reloadDataId(null);
      }
    })
  }

}
class User {
    id: string;
    login:string;
    firstName: string;
    lastName:string;
    email: string;
    imageUrl: string;
    activated: boolean;
    langKey: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    authorities: string;
    timezoneId:string;
    password: string;
    tenantId: string;
    userType: string;
    accountStatus: string;
    deletedDate: string;
    expiredDate: string;
    lastLoginDate: string;
    phone: number;
    role:string;
    status: string;
}