import { Component, OnInit, ViewChild, ElementRef, Inject, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BuildingManagementService } from "../../building-management.service";
import { BuildingsPage } from "../../pages/buildings/buildings.page";
import { TdFileInputComponent } from '@covalent/core';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {
  @Input() floorId: any;
  buildingId = Number(this.activatedRoute.snapshot.queryParams['buildingId']);
  
  /* updaload data */
  sensors = null;
  lastModifiedDate = null;
  clientPublishStatus = null;
  /* table data */
  columns: ITdDataTableColumn[] = [
    { name: 'id', label: 'tags.floorManagement.sensorList.sensorID', filter: true, sortable: true, width: 150 },
    { name: 'sensorName', label: 'tags.floorManagement.sensorList.sensorName', filter: true, sortable: true },
    { name: 'sensorType', label: 'tags.floorManagement.sensorList.sensorType', filter: true, sortable: true },
    { name: 'sensorService', label: 'tags.floorManagement.sensorList.sensorService', filter: true, sortable: true },
  ];
  dataConnection: any;
  data: any[] = [];
  filteredData: any[];
  filteredTotal: number;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = 'id';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  constructor(
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _BuildingManagementService: BuildingManagementService,
    private _BuildingsPage: BuildingsPage,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.floorId) {
      this.getSensorList(this.floorId);
      this.sensors = null;      
    }
  }

  /* get data sensor list */
  getSensorList(floorId) {
    let params = {}
    return this._BuildingManagementService.getSensors(floorId, params).then(result => {
      if (result) {
        this.data = result.sensors;
        this.dataConnection = result.connections;
        this.lastModifiedDate = result.lastModifiedDate;
        this.clientPublishStatus = result.clientPublishStatus;
        this.filter();
      }
    });
  }
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    if (this.sortBy === sortEvent.name) {
      this.sortOrder = this.sortOrder === TdDataTableSortingOrder.Ascending ? TdDataTableSortingOrder.Descending : TdDataTableSortingOrder.Ascending;
    } else {
      this.sortBy = sortEvent.name;
      this.sortOrder = this.sortOrderDefault;
    }
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }
  filter(): void {
    let newData: any[] = this.data;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return !column.filter;
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  /* confirm delete all sensor */
  deleteAllSensorConfirm() {
    this._UtilitiesService.showConfirmDialog('tags.floorManagement.confirm.deleteSensorList', (res) => {
      if (res) {
        this.deleteAllSensor(this.floorId).then(() => {
          this._BuildingsPage.reloadData();
        });
      }
    });
  }
  /* request delete all sensor */
  deleteAllSensor(id) {
    return this._BuildingManagementService.deleteAllSensor(id).then(result => {
      if (result) {
        this.getSensorList(this.floorId);
        this._UtilitiesService.showSuccessMessageAPI(result);
        this.sensors = null;        
      }
    });
  }
  /* input file  */
  @ViewChild('fileInput') inputEle: TdFileInputComponent;
  selectEvent(file) {
    const type = ['.csv', '.xls', '.xlsx'];
    /* validate file */
    let importError = this._UtilitiesService.validationInportFile(file, type, 5242880 );
    if (importError.length > 0) {
      importError = this._UtilitiesService.changeLanguage(importError);      
      this._UtilitiesService.validationWarningDisplay(importError);
    } else {
      this.sensors = file;
    }
    this.inputEle.clear();
  }
  /* prepare form data */
  prepareCreateData() {
    let formData = new FormData();
    if (this.sensors) {
      formData.append('sensors', this.sensors);
    }
    return formData;
  }
  inputValidation() {
    let errorInput = [];
    if (!this.sensors) {
      errorInput.push('No file selected');
    }
    return errorInput;
  }
  /* upload file to sever */
  uploadFile() {
    const request = this.prepareCreateData();
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.uploadAction(request);
    }
  }
  /* send request to sever */
  uploadAction(request) {
    return this._BuildingManagementService.uploadSensor(this.floorId, request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        this._BuildingsPage.reloadData();
        this.getSensorList(this.floorId);
        this.sensors = null;
      }
    });
  }

}
