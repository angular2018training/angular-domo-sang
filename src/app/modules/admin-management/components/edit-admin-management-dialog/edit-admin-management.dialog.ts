import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'edit-admin-management.dialog',
  templateUrl: 'edit-admin-management.dialog.html',
  styleUrls: ['./edit-admin-management.dialog.scss']
})
export class EditAdminManagementDialog {
  @HostBinding('class.full-wh') true;

  adminModel = {
    fullname: null,
    email: null,
    role: 'System Admin',
    status: 'Active',
    userId: null,
    newPassword: null,
    confirmNewPassword: null,
  };
  actions = [
    { label: 'tags.cancel', onClick: this.closeDialog.bind(this) },
    { label: 'tags.save', onClick: this.saveHandle.bind(this) }
  ];

  constructor(public dialogRef: MatDialogRef<EditAdminManagementDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    let model = this.data.model;
    if (model) {
      this.adminModel = {
        fullname: model.fullname,
        email: model.email,
        role: 'System Admin',
        status: model.authority,
        userId: model.name,
        newPassword: '123456',
        confirmNewPassword: '123456',
      };
    }
  }

  saveHandle() {
    // handle here
    this.dialogRef.close('Save');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
