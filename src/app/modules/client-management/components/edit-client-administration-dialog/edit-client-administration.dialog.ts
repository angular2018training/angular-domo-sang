import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'edit-client-administration.dialog',
  templateUrl: 'edit-client-administration.dialog.html',
  styleUrls: ['./edit-client-administration.dialog.scss']
})
export class EditClientAdministrationDialog {
  @HostBinding('class.full-wh') true;

  adminModel = {
    fullname: null,
    email: null,
    role: 'Client Admin',
    status: 'Active',
    userId: null,
    newPassword: null,
    confirmNewPassword: null,
  };
  actions = [
    { label: 'tags.cancel', onClick: this.closeDialog.bind(this) },
    { label: 'tags.save', onClick: this.saveHandle.bind(this) }
  ];

  constructor(public dialogRef: MatDialogRef<EditClientAdministrationDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    let model = this.data.model;
    if (model) {
      this.adminModel = {
        fullname: model.fullname,
        email: model.email,
        role: 'Client Admin',
        status: model.status,
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
