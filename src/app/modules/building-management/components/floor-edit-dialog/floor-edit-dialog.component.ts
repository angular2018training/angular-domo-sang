import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding } from '@angular/core';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import * as _ from 'lodash';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BuildingManagementService } from "../../building-management.service";


@Component({
  selector: 'app-floor-edit-dialog',
  templateUrl: './floor-edit-dialog.component.html',
  styleUrls: ['./floor-edit-dialog.component.scss']
})
export class FloorEditDialogComponent implements OnInit {
  inputMaxName = 100;
  /* input data */
  editData = {
    id: null,
    name: '',
    floorLevel: null,
    floorLayoutImage: '',
    buildingId: null,
    clientId: null,
    clientName: '',
    buildingName: ''
  };
  /*  form */
  editFloorForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(this.editData.name, [
      Validators.required,
      Validators.maxLength(100),
    ]),
  });
  get name() { return this.editFloorForm.get('name'); }

  constructor(
    private _UtilitiesService: UtilitiesService,
    private _BuildingManagementService: BuildingManagementService,
    public dialogRef: MatDialogRef<FloorEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.editData = _.cloneDeep(this.data);
  }
  /* handle edit floor */
  onFormSubmit() {
    let errorInput = [];
    errorInput = this.inputValidation();
    const request = this.prepareeditData();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.editAction(request);
    }
  }
  /* execute sent request edit floor to server */
  editAction(request) {
    return this._BuildingManagementService.updateFloor(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        this.dialogRef.close(true);
      }
    });
  }

  /* prepare data */
  prepareeditData() {
    let request = {
      id: this.editData.id,
      name: this.editData.name,
      buildingId: this.editData.buildingId
    }
    return request;
  }
  /* validataion */
  inputValidation() {
    let errorInput = [];
    /* trim data required */
    this.editData.name = this.editData.name.trim();
    if (!this.editData.name) {
      errorInput.push('tags.message.invalid.input');
    }
    return errorInput;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
