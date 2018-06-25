import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { TenantManagementService } from '../../tenant-management.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../../core/components/breadcrumb/breadcrumb.module';
import * as NAV_CONSTANT from '../../../../core/constants/navigation.constant';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TenantUserDialog } from '../../component/tenant-user-dialog/tenant-user.dialog';
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM } from '../../../../core/constants/system.constant';
import { TenantUserCreateDialog } from '../../component/tenant-user-create-dialog/tenant-user-create.dialog';
import { LOCAL_MESSAGE } from '../../../../core/constants/message';

@Component({
  selector: "app-user-tenant-page",
  templateUrl: "./user-tenant.page.html",
  styleUrls: ["./user-tenant.page.scss"]
})
export class UserTenantPage implements OnInit {
  @ViewChild("pagingBar") pagingBar;
  @Input("tenantInfo") tenantInfo;
  tenantModel = {
    id: null,
    name: null,
    email: null,
    phone: null,
    address: null,
    postalCode: null,
    confirmNewPassword: null
  };
  id = Number(this.activatedRoute.snapshot.queryParams["id"]);
  selectedUser: number;

  data: any[] = [];
  dataUser = {};
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = "";
  fromRow: number = 1;
  currentPage: number = 1;
  totalPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = "id";
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  formCurrentPage = new FormControl();
  listPage: number[];
  // rightContent = 'tenantDetail';
  // clientId;
  @ViewChild("search") searchEle: ElementRef;
  constructor(
    private router: Router,
    private _AuthService: AuthService,
    private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _TenantManagementService: TenantManagementService,
    private _BreadcrumbService: BreadcrumbService,
    public dialog: MatDialog
  ) {
    // this.clientId = this.activatedRoute.snapshot.queryParams['id'];
    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }

  ngOnInit() {
    this.reloadData();
    this.filter();
    // handle search input
    Observable.fromEvent(this.searchEle.nativeElement, "keyup")
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        this.search(this.searchEle.nativeElement.value);
      });
  }
  reloadData() {
    this.getUserList().then(() => {
      if (this.selectedUser) {
        // this.getUserDetail();
      } else {
        this.dataUser = {};
      }
    });
  }

  reloadDataId(id) {
    this.selectedUser = id;
    this.getUserList().then(() => {
      if (this.selectedUser) {
        this.getUserDetailId(this.selectedUser);
        // this.rightContent = 'buildingDetail'
      } else {
        this.dataUser = {};
      }
    });
  }

  getUserDetailId(id) {
    return this._TenantManagementService.getUserById(id).then(result => {
      if (result) {
        this.dataUser = result;
      }
    });
  }
  getUserList() {
    this.data = [];
    this.filteredData = [];

    return this._TenantManagementService
      .getUserByTenantId(this.id)
      .then(result => {
        if (result) {
          this.data = result.content;
          this.filter();
        }
      });
  }
  changeLanguage() {
    this._UtilitiesService
      .translateValue(this.listTitle, null)
      .subscribe(value => {
        for (let i = 0; i < this.listTitle.length; i++) {
          this.columns[i].label = value[this.listTitle[i]];
        }
      });
  }

  listTitle = [
    "tags.userManagement.id",
    "tags.userManagement.fullname",
    "tags.userManagement.email",
    "tags.userManagement.role",
    "tags.userManagement.status",
    "tags.userManagement.createdDate",
    "tags.userManagement.lastLogin"
  ];

  columns: ITdDataTableColumn[] = [
    { name: "id", label: "", filter: true, sortable: true },
    { name: "fullName", label: "", filter: true, sortable: true },
    { name: "email", label: "", filter: true, sortable: true },
    { name: "userType", label: "", filter: true, sortable: true },
    { name: "accountStatus", label: "", filter: true, sortable: true },
    { name: "createdDate", label: "", filter: true, sortable: true },
    { name: "lastLoginDate", label: "", filter: true, sortable: true }
    // { name: 'action', label: 'Action', width: 100 }
  ];
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    if (this.sortBy === sortEvent.name) {
      this.sortOrder =
        this.sortOrder === TdDataTableSortingOrder.Ascending
          ? TdDataTableSortingOrder.Descending
          : TdDataTableSortingOrder.Ascending;
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
    this.reloadData();
  }
  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.fromRow = 1;
    this.currentPage = 1;
    this.filter();
    this.pagingBar.navigateToPage(1);
  }

  filter(): void {
    if (
      this.searchTerm == "" ||
      (this.searchTerm !== "" && this.searchTerm.trim() !== "")
    ) {
      let newData: any[] = this.data;
      let excludedColumns: string[] = this.columns
        .filter((column: ITdDataTableColumn) => {
          return !column.filter;
        })
        .map((column: ITdDataTableColumn) => {
          return column.name;
        });
      newData = this._dataTableService.filterData(
        newData,
        this.searchTerm,
        true,
        excludedColumns
      );
      if (newData && newData.length > 0) {
        this.filteredTotal = newData.length;
        newData = this._dataTableService.sortData(
          newData,
          this.sortBy,
          this.sortOrder
        );
        newData = this._dataTableService.pageData(
          newData,
          this.fromRow,
          this.currentPage * this.pageSize
        );
        this.filteredData = newData;
        this.changeNumber(newData);
        this.filteredData.map(function (item) {
          if (item.language === 1) {
            item.fullName = item.firstName + " " + item.lastName;
          } else if (item.language === 2) {
            item.fullName = item.lastName + " " + item.firstName;
          }
        });
        this.updateListPages();
      }  
    } else {
      this.filteredData = [];
    }
  }

  changeNumber(data) {
    for (let item of data) {
      item.userType = item.userType == 3 ? "Super Consultant" : "Consultant";
      if (item.accountStatus == 1) {
        item.accountStatus = "Enable";
      }
      if (item.accountStatus == 2) {
        item.accountStatus = "Disable";
      }
      if (item.accountStatus == 3) {
        item.accountStatus = "Activated";
      }
      if (item.accountStatus == 4) {
        item.accountStatus = "Deactivated";
      }
    }
  }
  onFormSubmit() {
    let url = this._AuthService.getCreateNewUserUrl();
    console.log("Redirect Url:" + url);
    this.router.navigateByUrl(url);
  }

  onRowClick(row, event) {
    this._TenantManagementService.viewUserById(row.id).then(
      result => {
        event.preventDefault();
        event.stopPropagation();
        this.showDetailDialog(row);
        this.reloadData();
      },
      err => {
       this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['93']).subscribe(value => {
          this._UtilitiesService.showConfirmDeletedDialog(value,
            res => {
              this.getUserList();
            }
          );
        })
      }
    );
  }

  onDeleteClick(row, event) {
    event.preventDefault();
    event.stopPropagation();
    this._TenantManagementService.viewUserById(row.id).then(
      result => {
        this._UtilitiesService
          .translateValueByKey(LOCAL_MESSAGE["38"], { userName: row.fullName })
          .subscribe(value => {
            this._UtilitiesService.showConfirmDialog(
              value,
              res => {
                if (res) {
                  this.deleteUser(row.id).then(() => {
                    if (this.filteredData && this.filteredData.length - 1 < 1) {
                      this.currentPage =
                        this.currentPage > 1 ? this.currentPage - 1 : 1;
                      if (this.filteredData.length === 1) {
                        this.filteredData.length = 0;
                      }
                    }
                    this.pagingBar.navigateToPage(this.currentPage);
                    this.reloadData();
                  });
                }
              }
            );
          });    
      },
      err => {
        this._UtilitiesService.translateValueByKey(LOCAL_MESSAGE['93']).subscribe(value => {
          this._UtilitiesService.showConfirmDeletedDialog(value,
            res => {
              this.getUserList();
            }
          );
        })
      }
    );
  }
  deleteUser(data) {
    return this._TenantManagementService.deleteUser(data).then(result => {
      if (result) {
        this._UtilitiesService
          .translateValueByKey(LOCAL_MESSAGE["9"])
          .subscribe(value => {
            this._UtilitiesService.showSuccess(value);
          });
      }
    });
  }
  showDetailDialog(model = null) {
    const dialogRef = this.dialog.open(TenantUserDialog, {
      width: "800px",
      disableClose: true,
      data: {
        model: model
        // tenantId: this.tenantInfo.tenantId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(
        function() {
          this.getUserList();
        }.bind(this),
        100
      );
    });
  }
  showAddDialog() {
    const dialogRef = this.dialog.open(TenantUserCreateDialog, {
      width: "700px",
      disableClose: true,
      data: {
        tenantId: this.tenantInfo.tenantId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(
        function() {
          this.getUserList();
        }.bind(this),
        100
      );
    });
  }
  createNewProject(event) {
    event.preventDefault();
    event.stopPropagation();
    this.showAddDialog();
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
