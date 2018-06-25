import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BuildingManagementService } from '../../building-management.service';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LOCAL_MESSAGE } from './../../../../core/constants/message';
@Component({
  selector: 'app-meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss']
})
export class MeetingRoomComponent implements OnInit {
   /* data table */
   columns: ITdDataTableColumn[] = [
    { name: 'fileName', label: '', filter: true, sortable: true },
    { name: 'uploadBy', label: '', filter: true, sortable: true },
    { name: 'date', label: '', filter: true, sortable: true, format: this.convertDataToDate},
  ];

  @ViewChild('pagingBar') pagingBar;
  data: any[] = [];
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = 'fileName';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  totalPage: number = 1;

  listPage: number[];
  fromCurrentPage = new FormControl();

  /* data upload */
  clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  files = null;
  fileId;
  createData = {
    fileName: '',
  }
  constructor(private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _WorkForceDataService: BuildingManagementService,
    private router: Router
  ) {
    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }


  ngOnInit() {
    this._UtilitiesService.showLoading();
    this.getBookingRoomData();
    this.filter();
    setTimeout(() => {
      this._UtilitiesService.hideLoading();
    }, 500);
  }

  listTitle = [
    'tags.workForceData.fileName',
    'tags.workForceData.uploadedBy',
    'tags.workForceData.uploadedDate',
  ];

  changeLanguage() {
    this._UtilitiesService.translateValue(this.listTitle, null).subscribe(value => {
      for (let i = 0; i < this.listTitle.length; i++) {
        this.columns[i].label = value[this.listTitle[i]];
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
    this.totalPage = Math.ceil(this.filteredTotal/this.pageSize);
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
    this.getFileName();
    // update array pages
    this.updateListPages();
  }

  onDownloadClick(file) {
    return this._WorkForceDataService.downloadBookingData(file.id).then(result => {
      let a = file.fileName;

      let b = a.split('.');
      let extension = b[b.length - 1];

      let type: string = 'application/pdf';

      switch (extension) {
        case 'csv':
          type = 'text/csv';
          break;
        case 'xls':
          type = 'application/pdf';
          break;
        case 'xlsx':
          type = 'application/vnd.ms-excel';
          break;
        default:
          break;
      }

      if (result) {
        let workforce = new Blob([result],
          {
            type: type
          });
        FileSaver.saveAs(workforce, file.fileName);
      }
    });
  }
  /*upload*/
  @ViewChild('fileInput') fileInput;
  selectEvent(files: FileList | File): void {
     if (files ) {
      this.files = files;
    }
  }

  uploadFile() {
    if (this._WorkForceDataService.publishClientStatus != 1){
      let request = this.prepareCreateData();
      this.createAction(request);  
    } else {
      this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['130']).subscribe(value => {
      this._UtilitiesService.showError(value);
        })
    }

  }
  createAction(request) {
    return this._WorkForceDataService.createBookingData(this.clientId, request).then(result => {
      if (result) {
        this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['133']).subscribe(value => {
        this._UtilitiesService.showSuccess(value);
          })
        this.fileId = result.id;
        this.reloadData();
        this.files = null;
      }
    });
  }
  reloadData() {
    this.getBookingRoomData();
  }
  cancelEvent(): void {
  }
  getBookingRoomData() {
    return this._WorkForceDataService.getAllBookingData(this.clientId).then(result => {
      if (result) {
        this.fileId = result.id;
        this.data = result;
        this.handelData(this.data);
        this.filter();
      }
    });
  }

  prepareCreateData() {
    if (this.files) {
    let formData = new FormData();
    formData.append('file', this.files);

    return formData;
    }
  }
  /* convert json */
  handelData(data) {
    if (!this._UtilitiesService.isEmpty(data)) {
      data.forEach(element => {
        element.files = [];
	      });
    }
  }

  onDeleteClick(file) {
    if (this._WorkForceDataService.publishClientStatus != 1) {
      this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['46']).subscribe(value => {
        this._UtilitiesService.showConfirmDialog(value, (res => {
          if (res) {
            this.deleteBookingData(file.id).then(() => {
              this.reloadData();
            });
          }
        }));
      })

    } else {
      this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['130']).subscribe(value => {
        this._UtilitiesService.showError(value);
      })
    }
  }
  /* request delete workforcedata */
  deleteBookingData(fileId) {
    return this._WorkForceDataService.deleteBookingData(fileId).then(result => {
      if (result) {
        this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['9']).subscribe(value => {
          this._UtilitiesService.showSuccess(value);
        })
      }
    });
  }
  clearSelectedFile() {
    this.files = null;
  }
  getFileName() {
    this.filteredData.forEach(element => {
      let splitedFileName = element.fileName.split("\\");
      element.fileName = splitedFileName[splitedFileName.length - 1];
    })
  }
  convertDataToDate(data) {
    return moment(data).format('MM/DD/YYYY');
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
