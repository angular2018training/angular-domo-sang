import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { BuildingManagementPage } from '../../pages/building-management/building-management.page';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { BuildingManagementService } from "../../building-management.service";
import { BuildingsPage } from "../../pages/buildings/buildings.page";
import { Router, ActivatedRoute } from '@angular/router';
import { TdFileInputComponent } from '@covalent/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-building-details',
  templateUrl: './building-details.page.html',
  styleUrls: ['./building-details.page.scss']
})
export class BuildingDetailsPage implements OnInit {
  @Input() buildingId: any;
  clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  // buildingId = Number(this.activatedRoute.snapshot.queryParams['buildingId']);
  data = {
    id: null,
    name: '',
    address: '',
    area: null,
    base64: '',
    imageRef: '',
    capacity: null,
    clientId: null,
    clientName: '',
    description: '',
    floors: [],
    numberOfFloors: null,
    timezoneName: ''

  };
  floors = null;
  publishStatus = null;
  constructor(
    private _BuildingManagementPage: BuildingManagementPage,
    private _UtilitiesService: UtilitiesService,
    private _BuildingManagementService: BuildingManagementService,
    private _BuildingsPage: BuildingsPage,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.publishStatus = this._BuildingManagementPage.clientDetail.publishStatus;
    }, 200);
  }
  /* get building detail */
  getBuildingDetail(id) {
    let param = {
      clientid: this.clientId
    }
    return this._BuildingManagementService.getBuildingById(id, param).then(result => {
      if (result) {
        this.data = result;
      }
    }, error => {
      if (error) {
        this._BuildingsPage.reloadData();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.buildingId) {
      this.getBuildingDetail(this.buildingId);
    }
  }
  editBuilding(data) {
    this._BuildingsPage.editBuilding(data);
  }
  /* confirm delete building */
  deleteBuildingConfirm(event) {
    event.preventDefault();
    event.stopPropagation();
    this._UtilitiesService.showConfirmDialog('tags.message.confirmDelete', (res) => {
      if (res) {
        this.deleteBuilding(this.data.id).then(() => {
          /*  move to the screen of the next building or previous building */
          const indexBuilding = _.findIndex(this._BuildingsPage.data, (o) => { return o.id == this.data.id; });
          if (this._BuildingsPage.data[indexBuilding + 1]) {
            this._BuildingsPage.selectedBuilding = this._BuildingsPage.data[indexBuilding + 1].id;
          } else if (this._BuildingsPage.data[indexBuilding - 1]) {
            this._BuildingsPage.selectedBuilding = this._BuildingsPage.data[indexBuilding - 1].id;
          } else {
            this._BuildingsPage.selectedBuilding = null;
            this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: this.clientId } });
          }
          this._BuildingsPage.reloadData();
        });
      }
    });
  }
  /* request delete building */
  deleteBuilding(id) {
    let params = {
      clientid: this.data.clientId
    }
    return this._BuildingManagementService.deleteBuilding(id, params).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
      }
    });
  }
  /* input file  */
  @ViewChild('fileInput') inputEle: TdFileInputComponent;
  selectEvent(file) {
    const type = ['.csv', '.xls', '.xlsx'];
    /* validate file */
    let importError = this._UtilitiesService.validationInportFile(file, type, 5242880);
    if (importError.length > 0) {
      importError = this._UtilitiesService.changeLanguage(importError);
      this._UtilitiesService.validationWarningDisplay(importError);
    } else {
      this.floors = file;
    }
    this.inputEle.clear();
  }
  /* prepare form data */
  prepareCreateData() {
    let formData = new FormData();
    if (this.floors) {
      formData.append('floors', this.floors);
    }
    return formData;
  }
  inputValidation() {
    let errorInput = [];
    if (!this.floors) {
      errorInput.push('No file selected');
    } else if(this.floors.size == 0) {
      errorInput.push('messages.message91')
    }
    return errorInput;
  }
  /* upload file to sever */
  uploadFile() {
    const request = this.prepareCreateData();
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      errorInput = this._UtilitiesService.changeLanguage(errorInput);
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.uploadAction(request);
    }
  }
  /* send request to sever */
  uploadAction(request) {
    return this._BuildingManagementService.uploadFloor(this.data.id, request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        this._BuildingsPage.reloadData();
        this.getBuildingDetail(this.data.id);
        this.floors = null;
      }
    });
  }

  /* show detail floor */
  showFloorDetail(floor) {
    this._BuildingsPage.showSubMenu(this.data.id, true);
    this._BuildingsPage.showFloorDetail(this.data.id, floor.id);
  }
}
