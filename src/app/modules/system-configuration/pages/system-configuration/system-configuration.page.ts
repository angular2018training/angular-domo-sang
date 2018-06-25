import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CustomValidators } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SystemConfigurationService } from '../../system-configuration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShowlogDialogComponent } from '../../components/showlog-dialog/showlog-dialog.component';

@Component({
  selector: 'app-system-configuration',
  templateUrl: './system-configuration.page.html',
  styleUrls: ['./system-configuration.page.scss']
})
export class SystemConfigurationPage implements OnInit {

  check_box = {
    check_box_retension: false,
    check_box_backup: false
  }
  data = {
    id: null,
    dataRetentionValue: null,
    dataRetentionTimeUnit: null,
    backupValue: 0,
    backupTimeUnit: 2,
    backupStartTime: "",
    conversionIntervalValue: null,
    conversionIntervalTimeUnit: null,
    concurrentProcessNumber: null,
    serverMailAddress: "",
    serverMailPort: null,
    serverMailEncryption: null,
    serverMailUsername: "",
    serverMailPassword: ""
  }
  hour
  minute
  backupStartTime
  dataShowlog ={
    
  }

  systemConfigForm = new FormGroup({
    checkBox: new FormControl(),
    data2: new FormControl(this.data.dataRetentionValue, [
      Validators.pattern('^[0-9]{0,16}$')]),
    dataRetentionTimeUnit: new FormControl(),
    checkBox2: new FormControl(),
    data3: new FormControl(this.data.backupValue,CustomValidators.range([1, 31]),),
    backupTimeUnit: new FormControl(),
    data4: new FormControl(this.data.conversionIntervalValue,[
      Validators.pattern('^[0-9]{0,16}$')]),
    conversionIntervalTimeUnit: new FormControl(),
    gender: new FormControl(this.data.serverMailEncryption),
    data5: new FormControl(this.data.concurrentProcessNumber,[
      Validators.pattern('^[0-9]{0,16}$')]),
    data6: new FormControl(this.data.serverMailAddress,[
      Validators.required,
      Validators.maxLength(100),
    ]),
    data7: new FormControl(this.data.serverMailPort,[
      Validators.pattern('^[0-9]{0,16}$')]),
    data8: new FormControl(this.data.serverMailUsername,[
      Validators.required,
      Validators.maxLength(100),
    ]),
    data9: new FormControl(this.data.serverMailPassword,[
      Validators.required,
      Validators.maxLength(100),
    ]),
    hourControl: new FormControl(this.hour,CustomValidators.range([0, 23]),),
    minuteControl: new FormControl(this.minute,CustomValidators.range([0, 59]),)
  })

  //get checkBox(){return this.systemConfigForm.get('checkBox')}
  get hourControl() { return this.systemConfigForm.get('hourControl')}
  get minuteControl() { return this.systemConfigForm.get('minuteControl')}
  get data2() { return this.systemConfigForm.get('data2')}
  get data3(){return this.systemConfigForm.get('data3')}
  get data4(){return this.systemConfigForm.get('data4')}
  get data5(){return this.systemConfigForm.get('data5')}
  get data6(){return this.systemConfigForm.get('data6')}
  get data7(){return this.systemConfigForm.get('data7')}
  get data8(){return this.systemConfigForm.get('data8')}
  get data9(){return this.systemConfigForm.get('data9')}
  ngOnInit() {
    this.getDataDetail();
    if (this.check_box.check_box_backup == false)
      this.check_box.check_box_backup = true;   
  }

  checkBackup()
  {
    if (this.data.backupTimeUnit == 2)
      this.data.backupValue=0; 
  }
  getDataDetail() {
    return this._SystemConfigurationService.getAllData().then(result => {
      if (result) {
        this.data = result;
        //console.log(this.data)
        this.hour = moment(this.data.backupStartTime).hour();
        console.log(this.hour)
        this.minute = moment(this.data.backupStartTime).minute();
        console.log(this.minute)
      }
      if (this.data.backupValue == 0)
        this.check_box.check_box_backup = false
    });
  }

  getDataShowlog() {
    return this._SystemConfigurationService.getDataShowlog().then(result => {
      if (result) {
        this.data = result;
      }
    });
  }

  invalidCredentialMsg: string;

  constructor(private _SystemConfigurationService: SystemConfigurationService,
    private _UtilitiesService: UtilitiesService,
    public dialog: MatDialog
  ) { }

  showDialog() {
    const dialogRef = this.dialog.open(ShowlogDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  prepareData() {
    this.backupStartTime = moment.utc().hour(this.hour-7).minute(this.minute).toDate()
    let request = {
      id: this.data.id,
      dataRetentionValue: this.data.dataRetentionValue,
      dataRetentionTimeUnit: this.data.dataRetentionTimeUnit,
      backupValue: this.data.backupValue,
      backupTimeUnit: this.data.backupTimeUnit,
      backupStartTime: this.backupStartTime,
      conversionIntervalValue: this.data.conversionIntervalValue,
      conversionIntervalTimeUnit: this.data.conversionIntervalTimeUnit,
      concurrentProcessNumber: this.data.concurrentProcessNumber,
      serverMailAddress: this.data.serverMailAddress,
      serverMailPort: this.data.serverMailPort,
      serverMailEncryption: this.data.serverMailEncryption,
      serverMailUsername: this.data.serverMailUsername,
      serverMailPassword: this.data.serverMailPassword
    }
    if (this.check_box.check_box_backup == false)
      request.backupValue = 0
    return request;
  }

  prepareTestData() {
    let request = {
      serverMailAddress: this.data.serverMailAddress,
      serverMailPort: this.data.serverMailPort,
      serverMailEncryption: this.data.serverMailEncryption,
      serverMailUsername: this.data.serverMailUsername,
      serverMailPassword: this.data.serverMailPassword
    }
    return request;
  }

  onTestSetting() {
    const requestBody = this.prepareTestData();
    let errorInput = [];
    errorInput = this.validation();
    if (errorInput.length > 0) {
      /* show message warrning */
      errorInput = this._UtilitiesService.changeLanguage(errorInput);
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.saveActionAccount(requestBody);
    }
  }


  onSaveData() {
    const requestBody = this.prepareData();
    let errorInput = [];
    errorInput = this.validation();
    if (errorInput.length > 0) {
      /* show message warrning */
      errorInput = this._UtilitiesService.changeLanguage(errorInput);
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.saveAction(requestBody);
    }
  }
  onCancel()
  {
    this.getDataDetail();
    if (this.check_box.check_box_backup == false)
      this.check_box.check_box_backup = true;
  }

  validation() {
    let error = [];
    this.data.serverMailAddress = this.data.serverMailAddress.trim();
    this.data.serverMailUsername = this.data.serverMailUsername.trim();
    /* validate data */
    if (!this.data.serverMailAddress || !this.data.serverMailUsername) {
      error.push('tags.message.invalid.input');
    }
    return error
  }

  saveAction(requestBody) {
    this._SystemConfigurationService.updateData(requestBody).then(res => {
      this._UtilitiesService.showSuccessMessageAPI(requestBody);
    })
  }

  saveActionAccount(requestBody) {
    this._SystemConfigurationService.testData(requestBody).then(res => {
      this._UtilitiesService.showSuccessMessageAPI(requestBody);
    })
  }
}