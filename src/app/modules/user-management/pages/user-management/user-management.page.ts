import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { UserManagementService } from '../../user-management.service';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { GroupAuthorityDialog } from '../../components/group-authority-dialog/group-authority.dialog';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss']
})
export class UserManagementPage implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, private _UtilitiesService: UtilitiesService, private _dataTableService: TdDataTableService, private _UserManagementService: UserManagementService) { 
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
    'tags.userManagement.id',
    'tags.userManagement.username',
    'tags.userManagement.email',
    'tags.userManagement.role',
    'tags.userManagement.groupAuth'
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '', filter: true, sortable: true, width: 150 },
    { name: 'username', label: '', filter: true, sortable: true },
    { name: 'email', label: '', sortable: true },
    { name: 'role', label: '', sortable: true },
    { name: 'groupAuth', label: '', sortable: true },
  ];
  
  data: any[] = [];
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [10, 20, 30, 40];
  pageSize: number = this.pageSizes[0];
  sortBy: string = 'id';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  getCustomerList() {
    this.data = [
      {
        "id": 'user011',
        "username": "Justin Timberlake",
        "email": 'op01@hitachi.com',
        "role": 'Client User',
        "groupAuth": 'GrpA',
      }
    ];
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

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }
  configDataSearch(data) {
    let newData = [];
    _.forEach(this.data, (item) => {
      newData.push({
        id: item.id,
        username: item.username,
        email: item.email,
        role: item.role,
        groupAuth: item.groupAuth,
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
    // this.router.navigate(['/facility/detail'], { queryParams: { id: row.id } });
  }

  deleteFacility(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onGroupClick(row) {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(GroupAuthorityDialog, {
      minWidth: '600px',
      minHeight: '300px',
      data: {
        title: 'User011 - Justin Timberlake'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
