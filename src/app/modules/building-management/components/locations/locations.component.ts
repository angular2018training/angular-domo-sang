import { Component, OnInit, ViewChild, ElementRef, Inject, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BuildingManagementService } from "../../building-management.service";
import { BuildingsPage } from "../../pages/buildings/buildings.page";
import { TdFileInputComponent } from '@covalent/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  @Input() floorId: any;
  buildingId = Number(this.activatedRoute.snapshot.queryParams['buildingId']);
  @ViewChild('pagingBar') pagingBar;

  /* upload data */
  locations = null;
  lastModifiedDate = null;
  clientPublishStatus = null;
  /* data table */
  columns: ITdDataTableColumn[] = [
    { name: 'placeID', label: 'tags.floorManagement.locations.placeID', filter: true, sortable: true, width: 150 },
    { name: 'placeName', label: 'tags.floorManagement.locations.areaName', filter: true, sortable: true },
    { name: 'placeType', label: 'tags.floorManagement.locations.type', filter: true, sortable: true },
  ];
  dataMeetingSpaces: any;
  data: any = [];
  filteredData: any[];
  filteredTotal: number;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = 'placeID';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  totalPage: number = 1;

  listPage: number[];
  fromCurrentPage = new FormControl();

  constructor(
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _BuildingManagementService: BuildingManagementService,
    private _BuildingsPage: BuildingsPage
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.floorId) {
      this.getLocationList(this.floorId);
      this.locations = null;
    }
  }
  /* get data location list */
  getLocationList(floorId) {
    let params = {}
    return this._BuildingManagementService.getLocations(floorId, params).then(result => {
      if (result) {
        this.data = result.workpoints;
        this.dataMeetingSpaces = result.meetingSpaces;
        this.lastModifiedDate = result.lastModifiedDate,
        this.clientPublishStatus = result.clientPublishStatus,
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
    this.totalPage = Math.ceil(this.filteredTotal / this.pageSize);
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
    
    // update array pages
    this.updateListPages();
  }

  /* confirm delete all location */
  deleteAllLocationConfirm() {
    this._UtilitiesService.showConfirmDialog('tags.floorManagement.confirm.deleteLocations', (res) => {
      if (res) {
        this.deleteAllLocation(this.floorId).then(() => {
          this._BuildingsPage.reloadData();
        });
      }
    });
  }
  /* request delete all location */
  deleteAllLocation(id) {
    return this._BuildingManagementService.deleteAllLocation(id).then(result => {
      if (result) {
        this.getLocationList(this.floorId);
        this._UtilitiesService.showSuccessMessageAPI(result);
        this.locations = null;
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
      this.locations = file;
    }
    this.inputEle.clear();
  }
  /* prepare form data */
  prepareCreateData() {
    let formData = new FormData();
    if (this.locations) {
      formData.append('locations', this.locations);
    }
    return formData;
  }
  inputValidation() {
    let errorInput = [];
    if (!this.locations) {
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
    return this._BuildingManagementService.uploadLocation(this.floorId, request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        this._BuildingsPage.reloadData();
        this.getLocationList(this.floorId);
        this.locations = null;
      }
    });
  }

  updateListPages() {
    this.listPage = [];
    const totalPages = Math.ceil(this.filteredTotal / this.pageSize);
    for (let index = 0; index < totalPages; index++) {
      this.listPage.push(index + 1);
    }
  }

  navigateToPage(numPage) {
    this.currentPage = numPage;
    this.pagingBar.navigateToPage(this.currentPage);
  }
}
