import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { AdminService } from '../../admin-management.service';
import { Observable } from 'rxjs/Observable';
import { BreadcrumbService } from '../../../../core/components/breadcrumb/breadcrumb.module';
import { AuthService } from '../../../../core/services/auth.service';
import * as NAV_CONSTANT from '../../../../core/constants/navigation.constant';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditAdminManagementDialog } from '../../components/edit-admin-management-dialog/edit-admin-management.dialog';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM } from '../../../../core/constants/system.constant';




@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.page.html',
  styleUrls: ['./admin-management.page.scss']
})
export class AdminManagementPage implements OnInit {
  clientId;
  @ViewChild('search') searchEle: ElementRef;

  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  constructor(private router: Router,private _AuthService: AuthService,private activatedRoute: ActivatedRoute, private _UtilitiesService: UtilitiesService, private _dataTableService: TdDataTableService, private _AdminService: AdminService, private _BreadcrumbService: BreadcrumbService, public dialog: MatDialog) {
    this.clientId = this.activatedRoute.snapshot.queryParams['id'];
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
    'tags.userManagement.email',
    'tags.userManagement.name',
    'tags.userManagement.status',
    'tags.userManagement.role',
    'tags.userManagement.lastLogin',
    'tags.userManagement.createdDate',
  ];

  columns: ITdDataTableColumn[] = [
    { name: 'email', label: '', filter: true, sortable: true },
    { name: 'name', label: '', filter: true, sortable: true },
    { name: 'status', label: '', filter: true, sortable: true },
    { name: 'role', label: '', filter: true, sortable: true },
    { name: 'lastLogin', label: '', filter: true, sortable: true },
    { name: 'createdDate', label: '', filter: true, sortable: true },
    // { name: 'action', label: 'Action', width: 100 }
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
        "email": "user01@hitachi.com",
        "name": "User 001",
        "status": "Active",
        "role": "Admin",
        "lastLogin": "02/02/2017",
        "createdDate": "02/25/2017",
      },
      {
        "email": "user02@hitachi.com",
        "name": "User 002",
        "status": "Active",
        "role": "Consultant",
        "lastLogin": "02/02/2017",
        "createdDate": "02/25/2017",
      },
      {
        "email": "user03@hitachi.com",
        "name": "User 003",
        "status": "Active",
        "role": "Consultant",
        "lastLogin": "02/02/2017",
        "createdDate": "02/25/2017",
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

  onFormSubmit() {
    // console.log(isRemember);
    let url = this._AuthService.getCreateNewUserUrl();
    console.log('Redirect Url:' + url);
    this.router.navigateByUrl(url);
  }

  onRowClick(row, event) {
    event.preventDefault();
    event.stopPropagation();

    this.showAddDialog(row);
  }

  onEditClick(row, event) {
    event.preventDefault();
    event.stopPropagation();

    this.showAddDialog(row);
  }

  onDeleteClick(row, event) {
    event.preventDefault();
    event.stopPropagation();
    this._UtilitiesService.showConfirmDialog('tags.message.confirmDelete', (res) => { });
  }
  showAddDialog(model = null) {
    const dialogRef = this.dialog.open(EditAdminManagementDialog, {
      width: '650px',
      disableClose: true,
      data: {
        model: model
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  createNewProject() {
    this.router.navigate(['administrator/add']);
  }

}

