import { Component, OnInit, ViewChild, ElementRef, Inject, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { UserManagementService } from '../../user-management.service';
import { Observable } from 'rxjs/Observable';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-group-authority',
  templateUrl: './group-authority.dialog.html',
  styleUrls: ['./group-authority.dialog.scss']
})
export class GroupAuthorityDialog implements OnInit {
  @HostBinding('class.full-wh') true;

  constructor(public dialogRef: MatDialogRef<GroupAuthorityDialog>, private router: Router, private _UtilitiesService: UtilitiesService, private _dataTableService: TdDataTableService, @Inject(MAT_DIALOG_DATA) public dataDialog: any) { 
    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }

  ngOnInit() {
    this._UtilitiesService.showLoading();
    this.getCustomerList();
    this.filter();
    setTimeout(() => {
      this._UtilitiesService.hideLoading();
    }, 500);
  }

  changeLanguage() {
    this._UtilitiesService.translateValue(this.listTitle, null).subscribe(value => {
      for(let i = 0; i < this.listTitle.length; i++) {
        this.columns[i].label = value[this.listTitle[i]];
      }
    });
  }

  listTitle = [
    'tags.groupManagement.id',
    'tags.groupManagement.name',
    'tags.groupManagement.authority',
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '', filter: true, sortable: true },
    { name: 'name', label: '', filter: true, sortable: true },
    { name: 'authority', label: '', filter: true, sortable: true },
  ];
  
  data: any[] = [];
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [10, 20, 30, 40];
  pageSize: number = this.pageSizes[3];
  sortBy: string = 'id';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  getCustomerList() {
    this.data = [
      {
        "id": 'GrpA',
        "name": "Group A",
        "authority": "Read & Write"
      },
      {
        "id": 'GrpB',
        "name": "Group B",
        "authority": "Read Only"
      },
      {
        "id": 'GrpC',
        "name": "Group C",
        "authority": "Read & Write"
      },
    ];
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }
  configDataSearch(data) {
    let newData = [];
    _.forEach(this.data, (item) => {
      newData.push({
        id: item.id,
        name: item.name,
        authority: item.authority
      })
    });
    return newData;
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
    newData = this._dataTableService.filterData(this.configDataSearch(newData), this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  onRowClick(row) {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
