
import { FormControl } from '@angular/forms';
import { UserService } from './../../../../core/services/user.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { ClientService } from '../../client-management.service';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { EditClientAdministrationDialog } from '../../components/edit-client-administration-dialog/edit-client-administration.dialog';
import { Client } from '_debugger';
import { ClientCreatePage } from '../client-create/client-create.page'

@Component({
  selector: 'app-client-management',
  templateUrl: './client-management.page.html',
  styleUrls: ['./client-management.page.scss']
})
export class ClientManagementPage implements OnInit {
  // ViewChild help paging Bar inject in to this component
  @ViewChild('pagingBar') pagingBar;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _ClientService: ClientService,
    private userService: UserService
  ) {
    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }

  @ViewChild('search') searchEle: ElementRef;

  ngOnInit() {
    this.getListClient();

    this.userService.removeTenantId();

    // handle search input
    Observable.fromEvent(this.searchEle.nativeElement, 'keyup')
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        this.search(this.searchEle.nativeElement.value);
      });
  }

  changeLanguage() {
    this._UtilitiesService.translateValue(this.listTitle, null).subscribe(value => {
      for (let i = 0; i < this.listTitle.length; i++) {
        this.columns[i].label = value[this.listTitle[i]];
      }
    });
  }

  listTitle = [
    'tags.clientManagement.id',
    'tags.clientManagement.clientName',
    'tags.clientManagement.partnerName',
    'tags.clientManagement.address',
    'tags.clientManagement.province',
    'tags.clientManagement.country',
    'tags.clientManagement.phone',
    'tags.clientManagement.email',
    'tags.clientManagement.enterpriseType',
    'tags.clientManagement.industryType',
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'id', label: '', filter: true, sortable: true },
    { name: 'name', label: '', filter: true, sortable: true },
    { name: 'tenantName', label: '', filter: true, sortable: true },
    { name: 'address', label: '', filter: true, sortable: true },
    { name: 'provinceName', label: '', filter: true, sortable: true },
    { name: 'countryName', label: '', filter: true, sortable: true },
    { name: 'phone', label: '', filter: true, sortable: true },
    { name: 'email', label: '', filter: true, sortable: true },
    { name: 'enterpriseEngName', label: '', filter: true, sortable: true },
    { name: 'industryEngName', label: '', filter: true, sortable: true },
  ];

  data: any[] = [];
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = 'id';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  selectedClient: number;
  isClient = true;
  totalPage: number = 1;
  publicStatus: null;
  
  listPage: number[];
  fromCurrentPage = new FormControl();
  
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
    this.fromRow = 1;
    this.currentPage = 1;
    this.filter();
    this.pagingBar.navigateToPage(1);
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.totalPage = Math.ceil(this.filteredTotal / this.pageSize);
    this.filter();
  }
  

  filter(): void {
    if (this.searchTerm == '' || (this.searchTerm !== '' && this.searchTerm.trim() !== '')) {
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
    } else {
      this.filteredData = [];
    }
      // update array pages
      this.updateListPages();
  }

  onRowClick(row) {
    this.userService.setTenantId(row.tenantId);

    this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: row.id } });
  }

  onCreateClick() {
    this.router.navigate(['/client-management/client-create']);
  }

  onEditClick(row, event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDeleteClick(row, event) {
    this.userService.setTenantId(row.tenantId);
    
    event.preventDefault();
    event.stopPropagation();
    this._UtilitiesService.showConfirmDialog('Are you sure you want to delete ' + row.name +'?', (res => {
      if (res) {
        this._UtilitiesService.showConfirmDialog('Are you sure you really want to delete  ' + row.name +'?', (res => {
          if (res) {
            if (row.publishStatus !== 1) {
              this.deleteClient(row.id).then(() => {
                // Filered Data length is the number of client in current page. 
                // filteredData.length -1 < 1 is about to check if number of client in current page = 0
                if (this.filteredData && this.filteredData.length - 1 < 1) {
                  this.currentPage = this.currentPage > 1 ? (this.currentPage - 1) : 0;
                }
                this.pagingBar.navigateToPage(this.currentPage);
                this.getListClient();
              });
            }
            else {
              this._UtilitiesService.showError('This Client is published');
            }
          }
        }));
      }
    }));
  }
  /* request delete client */
  deleteClient(data) {
    let params = {
    }
    return this._ClientService.deleteClient(data).then(result => {
      if (result) {
        this._UtilitiesService.showSuccess('Deleted successfully');
      }
    });
  }

  getListClient() {
    let param = {}

    return this._ClientService.getAllClient().then(result => {
      if (result) {
        this.data = result;
        this.filter();
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

