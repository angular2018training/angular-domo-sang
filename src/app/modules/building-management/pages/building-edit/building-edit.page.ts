import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BuildingManagementService } from "../../building-management.service";
import { UtilitiesService } from '../../../../core/services/utilities.service';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BuildingsPage } from "../../pages/buildings/buildings.page";
import { TdFileInputComponent } from '@covalent/core';

@Component({
  selector: 'app-building-edit',
  templateUrl: './building-edit.page.html',
  styleUrls: ['./building-edit.page.scss']
})
export class BuildingEditPage implements OnInit {
  @Input('dataBuilding') data: any;
  @Input() timezones: any;

  inputMaxName = 100;
  inputMaxAddress = 100;
  inputMaxDescription = 500;
  /* input data */
  editData = {
    id: null,
    name: '',
    address: '',
    area: null,
    numberOfFloors: null,
    capacity: null,
    imageRef: '',
    description: '',
    clientId: null,
    avatar: null,
    floors: null,
    base64: '',
    timezoneId: null
  };
  tempData = {
    id: null,
    name: '',
    address: '',
    area: null,
    numberOfFloors: null,
    capacity: null,
    imageRef: '',
    description: '',
    clientId: null,
    avatar: null,
    floors: null,
    base64: '',
    timezoneId: null
  };

  /*upload*/
  avatarDisplay = null;
  /* form */
  editBuildingForm = new FormGroup({
    name: new FormControl(this.editData.name, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    address: new FormControl(this.editData.address, [
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
  get name() { return this.editBuildingForm.get('name'); }

  get address() { return this.editBuildingForm.get('address'); }

  constructor(
    private _UtilitiesService: UtilitiesService,
    private _BuildingManagementService: BuildingManagementService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _BuildingsPage: BuildingsPage,

  ) { }

  ngOnInit() {
    this.editData = _.cloneDeep(this.data);
    this.editData.floors = null;
    setTimeout(() => {
      this.tempData = _.cloneDeep(this.editData);
    }, 200);
  }

  /* handle edit buidling */
  onFormSubmit() {
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      errorInput = this._UtilitiesService.changeLanguage(errorInput);
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      const request = this.prepareeditData();
      this.editAction(request);
    }
  }
  /* execute sent request edit building to server */
  editAction(request) {
    return this._BuildingManagementService.updateBuilding(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        this._BuildingsPage.selectedBuilding = this.editData.id;
        this._BuildingsPage.reloadData();
      }
    });
  }

  /* prepare data */
  prepareeditData() {
    let formData = new FormData();
    formData.append('id', this.editData.id);
    formData.append('name', this.editData.name);
    formData.append('address', this.editData.address);
    formData.append('timezoneid', this.editData.timezoneId);
    formData.append('clientid', this.editData.clientId);
    if (this.editData.area) {
      formData.append('area', this.editData.area);
    } else {
      formData.append('area', '0');      
    }
    if (this.editData.capacity) {
      formData.append('capacity', this.editData.capacity);
    } else {
      formData.append('capacity', '0');
    }
    if (this.editData.numberOfFloors) {
      formData.append('numberoffloors', this.editData.numberOfFloors);
    } else {
      formData.append('numberoffloors', '0');      
    }
    if (this.editData.description) {
      formData.append('description', this.editData.description);
    }
    if (this.editData.avatar) {
      formData.append('avatar', this.editData.avatar);
    } else {
      if (this.editData.imageRef) {
        formData.append('imageRef', this.editData.imageRef);
      }
    }
    if (this.editData.floors) {
      formData.append('floors', this.editData.floors);
    }
    return formData;
  }
  /* validation */
  inputValidation() {
    let errorInput = [];
    /* trim data required */
    this.editData.name = this.editData.name.trim();
    this.editData.address = this.editData.address.trim();
    /* validate data */
    if (!this.editData.name || !this.editData.address) {
      errorInput.push('tags.message.invalid.input');
    }
    if(this.editData.floors.size == 0) {
      errorInput.push('messages.message91')
    }
    return errorInput;
  }
  /* selecte avatar file */
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
      this.editData.avatar = file;
      this.readerImage(file);
    }
    this.avatarInput.clear();
  }
  /* convert img to base64 */
  readerImage(file) {
    let reader = new FileReader();
    let vm = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
      vm.avatarDisplay = reader.result;
    };
  }
  /* remove image */
  cancelAvatarEvent(): void {
    this.editData.base64 = '';
    this.editData.avatar = null;
    this.editData.imageRef = null;
    this.avatarDisplay = null;
  }
  /* import floor list */
  @ViewChild('fileInput') inputEle: TdFileInputComponent;
  selectFloorsEvent(file): void {
    const type = ['.csv', '.xls', '.xlsx'];
    /* validate file */
    let importError = this._UtilitiesService.validationInportFile(file, type, 5242880);
    if (importError.length > 0) {
      importError = this._UtilitiesService.changeLanguage(importError);
      this._UtilitiesService.validationWarningDisplay(importError);
    } else {
      this.editData.floors = file;
    }
    this.inputEle.clear();
  }
  /* remove floor file */
  cancelFloorEvent(): void {
    this.editData.floors = null;
  }
  /* cancel button */
  cancel() {
    if (!_.isEqual(this.editData, this.tempData)) {
      this._UtilitiesService.showConfirmDialog('tags.message.confirm.quit', (res) => {
        if (res) {
          this._BuildingsPage.selectedBuilding = this.editData.id;
          this._BuildingsPage.reloadData();
        }
      })
    } else {
      this._BuildingsPage.selectedBuilding = this.editData.id;
      this._BuildingsPage.reloadData();
    }
  }
  /* handle input type number */
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