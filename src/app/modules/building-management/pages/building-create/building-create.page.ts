import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { BuildingManagementService } from "../../building-management.service";
import { BuildingsPage } from "../../pages/buildings/buildings.page";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from 'lodash';
import { TdFileInputComponent } from '@covalent/core';

@Component({
  selector: 'app-building-create',
  templateUrl: './building-create.page.html',
  styleUrls: ['./building-create.page.scss']
})
export class BuildingCreatePage implements OnInit {
  clientId = this.activatedRoute.snapshot.queryParams['clientId'];
  @Input() timezones: any;

  inputMaxName = 100;
  inputMaxAddress = 100;
  inputMaxDescription = 500;

  /* input data */
  createData = {
    name: '',
    address: '',
    area: null,
    numberOfFloors: null,
    capacity: null,
    description: '',
    clientId: null,
    avatar: null,
    floors: null,
    timeZone: null
  };
  tempData = {
    name: '',
    address: '',
    area: null,
    numberOfFloors: null,
    capacity: null,
    description: '',
    clientId: null,
    avatar: null,
    floors: null,
    timeZone: null
  };

  /*upload*/
  avatarDisplay = null;
  /* form */
  createBuildingForm = new FormGroup({
    name: new FormControl(this.createData.name, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    address: new FormControl(this.createData.address, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    area: new FormControl(),
    numberOfFloors: new FormControl(),
    capacity: new FormControl(),
    description: new FormControl(),
    floor: new FormControl(),
    avatar: new FormControl(),
    timeZone: new FormControl(),
  });

  get name() { return this.createBuildingForm.get('name'); }
  get address() { return this.createBuildingForm.get('address'); }

  constructor(
    private _UtilitiesService: UtilitiesService,
    private _BuildingManagementService: BuildingManagementService,
    private _BuildingsPage: BuildingsPage,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.createData.timeZone = this.timezones[0].id;
      this.tempData.timeZone = this.timezones[0].id;
    }, 150);
  }

  /* handle create buidling */
  onFormSubmit() {
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      errorInput = this._UtilitiesService.changeLanguage(errorInput);
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      const request = this.prepareCreateData();
      this.createAction(request);
    }
  }
  /* execute sent request create building to server */
  createAction(request) {
    return this._BuildingManagementService.createBuilding(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        this._BuildingsPage.selectedBuilding = result.id
        this._BuildingsPage.reloadData();
      }
    });
  }

  // prepare data for create new chiller palant
  prepareCreateData() {
    let formData = new FormData();
    formData.append('name', this.createData.name);
    formData.append('address', this.createData.address);
    formData.append('timezoneid', this.createData.timeZone);
    formData.append('clientid', this.clientId);
    if (this.createData.area) {
      formData.append('area', this.createData.area);
    } else {
      formData.append('area', '0');
    }
    if (this.createData.capacity) {
      formData.append('capacity', this.createData.capacity);
    } else {
      formData.append('capacity', '0');      
    }
    if (this.createData.numberOfFloors) {
      formData.append('numberoffloors', this.createData.numberOfFloors);
    } else {
      formData.append('numberoffloors', '0');      
    }
    if (this.createData.description) {
      formData.append('description', this.createData.description);
    }
    if (this.createData.avatar) {
      formData.append('avatar', this.createData.avatar);
    }
    if (this.createData.floors) {
      formData.append('floors', this.createData.floors);
    }
    return formData;
  }
  // validate
  inputValidation() {
    let errorInput = [];
    /* trim data required */
    this.createData.name = this.createData.name.trim();
    this.createData.address = this.createData.address.trim();
    /* validate data */
    if (!this.createData.name || !this.createData.address) {
      errorInput.push('tags.message.invalid.input');
    }
    if(this.createData.floors && this.createData.floors.size == 0) {
      errorInput.push('messages.message91')
    }
    return errorInput;
  }
  /* browse avatar */
  @ViewChild('avatarInput') avatarInput: TdFileInputComponent;
  selectAvatarEvent(file): void {
    const type = ['.png', '.jpg'];
    /* validate file */
    let importError = this._UtilitiesService.validationInportFile(file, type, 5242880);
    if (importError.length > 0) {
      importError = this._UtilitiesService.changeLanguage(importError);
      this._UtilitiesService.validationWarningDisplay(importError);
    } else {
      this.createData.avatar = file;
      this.readerImage(file);
    }
    this.avatarInput.clear();
  }
  /* render file to base64 */
  readerImage(file) {
    let reader = new FileReader();
    let vm = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
      vm.avatarDisplay = reader.result;
    };
  }
  /* remove avatar */
  cancelAvatarEvent() {
    this.createData.avatar = null;
    this.avatarDisplay = null;
  }

  @ViewChild('fileInput') inputEle: TdFileInputComponent;
  selectFloorsEvent(file): void {
    const type = ['.csv', '.xls', '.xlsx'];
    /* validate file */
    let importError = this._UtilitiesService.validationInportFile(file, type, 5242880);
    if (importError.length > 0) {
      importError = this._UtilitiesService.changeLanguage(importError);
      this._UtilitiesService.validationWarningDisplay(importError);
    } else {
      this.createData.floors = file;
    }
    this.inputEle.clear();
  }
  cancelFloorEvent(): void {
    this.createData.floors = null;
  }
  /* cancel button */
  cancel() {
    if (!_.isEqual(this.createData, this.tempData)) {
      this._UtilitiesService.showConfirmDialog('tags.message.confirm.quit', (res) => {
        if (res) {
          this._BuildingsPage.reloadData();
        }
      })
    } else {
      this._BuildingsPage.reloadData();
    }
  }
  /* handle input type number */
  // inputNumber(e) {
  //   if (
  //     (e.keyCode == 187 ||
  //       e.keyCode == 189 ||
  //       e.keyCode == 109 ||
  //       e.keyCode == 107) ||
  //     (e.keyCode >= 65 &&
  //       e.keyCode <= 90)
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }
  inputNumber(e) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
      return true;
    } else {
      if (e.keyCode >= 96 && e.keyCode <= 105) {
        return true;
      } else {
        if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 190 || e.keyCode == 110) {
          return true
        } else {
          return false;
        }
      }
    }
  }
}
