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
import { CookieService } from 'ngx-cookie-service';
import { SYSTEM } from '../../../../core/constants/system.constant';
import { TenantUserCreateDialog } from '../../component/tenant-user-create-dialog/tenant-user-create.dialog';
import { TenantUserDialog } from "../../component/tenant-user-dialog/tenant-user.dialog";
import { isBoolean, isObject } from 'util';
import { LOCAL_MESSAGE } from '../../../../core/constants/message';
@Component({
  selector: "app-user-tenant-create",
  templateUrl: "./user-tenant-create.page.html",
  styleUrls: ["./user-tenant-create.page.scss"]
})
export class UserTenantCreatePage implements OnInit {
  @Input("tenantInfo") tenantInfo;
  @ViewChild("pagingBar") pagingBar;
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
    this._UtilitiesService.showLoading();
    // this.getCustomerList();
    this.filter();
    setTimeout(() => {
      this._UtilitiesService.hideLoading();
    }, 500);

    console.log(this.tenantInfo);

    // handle search input
    Observable.fromEvent(this.searchEle.nativeElement, "keyup")
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        this.search(this.searchEle.nativeElement.value);
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
    "tags.userManagement.fullname",
    "tags.userManagement.email",
    "tags.userManagement.role",
    "tags.userManagement.status",
    "tags.userManagement.createdDate",
    "tags.userManagement.lastLogin"
  ];

  columns: ITdDataTableColumn[] = [
    { name: "fullName", label: "", filter: true, sortable: true },
    { name: "email", label: "", filter: true, sortable: true },
    { name: "userTypeString", label: "", filter: true, sortable: true },
    // { name: "userType", label: "", filter: true, sortable: true },
    // { name: "accountStatus", label: "", filter: true, sortable: true },
    { name: "accountStatusString", label: "", filter: true, sortable: true },
    { name: "createdDate", label: "", filter: true, sortable: true },
    { name: "lastLogin", label: "", filter: true, sortable: true }
    // { name: 'action', label: 'Action', width: 100 }
  ];
  id = Number(this.activatedRoute.snapshot.queryParams["id"]);
  data: any[] = [];
  dataUser = {};
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = "";
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = "id";
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  selectedUser: number;
  tenantId: any;
  totalPage: number = 1;
  formCurrentPage = new FormControl();
  listPage: number[];
  mappingRole = {
    2: "Consultant",
    3: "Super Consultant"
  };

  mappingStatus = {
    1: "Enable",
    2: "Disable",
    3: "Activated",
    4: "Deactivated"
  };

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
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.fromRow = 1;
    this.currentPage = 1;
    this.filter();
    this.pagingBar.navigateToPage(1);
  }

  filter(): void {
    var self = this;
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

        newData.map(function (item) {
          if (item.language === 1) {
            item.fullName = item.firstName + " " + item.lastName;
          } else if (item.language === 2) {
            item.fullName = item.lastName + " " + item.firstName;
          }

          // Update Role
          item.userTypeString = self.mappingRole[item.userType];
          // Update Status
          item.accountStatusString = self.mappingStatus[item.accountStatus];
        });
        this.filteredData = newData;
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
  onDeleteClick(row, j, event) {
    event.preventDefault();
    event.stopPropagation();
    this._UtilitiesService
      .translateValueByKey(LOCAL_MESSAGE["38"], { userName: row.fullName })
      .subscribe(value => {
        this._UtilitiesService.showConfirmDialog(
          value,
          res => {
            if (res) {
              if (this.filteredData && this.filteredData.length - 1 < 1) {
                this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
                // if (this.filteredData.length === 1) {
                //   this.filteredData.length = 0;
                // }
              }
              this.pagingBar.navigateToPage(this.currentPage);

              let i = this.data.findIndex(e => {
                return e.email === this.filteredData[j].email;
              });

              this.data.splice(i, 1);

              // this.filteredData.splice(j, 1);
              this.filter();
            }
          }
        );
      });
  }

  createNewUser(event) {
    event.preventDefault();
    event.stopPropagation();
    this.showAddDialog();
  }

  onRowClick(row, j, event) {
    event.preventDefault();
    event.stopPropagation();
    this.showDetailDialog(row, j);
  }

  showDetailDialog(model = null, j) {
    const dialogRef = this.dialog.open(TenantUserDialog, {
      width: "800px",
      disableClose: true,
      data: {
        model: model,
        users: this.data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(
        function () {
          console.log(result);
          if (isObject(result)) {
            let i = this.data.findIndex(e => {
              return e.email === this.filteredData[j].email;
            });

            this.data[i] = result;

            this.filteredData[j] = result;
            console.log("thien", this.data);
            //update data
          }

          this.filter();
        }.bind(this),
        100
      );
    });
  }
  showAddDialog() {
    let me = this;
    const dialogRef = this.dialog.open(TenantUserCreateDialog, {
      width: "700px",
      disableClose: true,
      data: {
        tenantId: this.tenantInfo.tenantId,
        users: this.data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(function () {
        console.log(result);
        if (isObject(result)) {
          me.data.push(result);
        }
        me.filter();
      });
    });
  }

  changeStringToNumber(item) {
    if (item.userType == "Super Consultant") {
      item.userType = 3;
    }
    if (item.userType == "Consultant") {
      item.userType = 2;
    }
    if (item.accountStatus == "Enable") {
      item.accountStatus = 1;
    }
    if (item.accountStatus == "Disable") {
      item.accountStatus = 2;
    }
    if (item.accountStatus == "Activated") {
      item.accountStatus = 3;
    }
    if (item.accountStatus == "Deactivated") {
      item.accountStatus = 4;
    }
  }

  finish() {
    if (this.data && this.data.length > 0) {
      this.data.forEach(data => {
        this.changeStringToNumber(data);
      });
    }

    let request = {
      tenant: {
        name: this.tenantInfo.name,
        email: this.tenantInfo.email,
        phone: this.tenantInfo.phone,
        countryId: parseInt(this.tenantInfo.country),
        address: this.tenantInfo.address,
        postalCode: this.tenantInfo.postalCode,
        provinceId: parseInt(this.tenantInfo.province)
      },
      userList: this.data
    };

    return this._TenantManagementService.createTenant(request).then(
      result => {
        if (result) {
          this._UtilitiesService.showSuccessMessageAPI(result);
          this.router.navigate(["/tenant-management"]);
        }
      },
      error => {
        if (error) {
          this.data = error.UserList;
          this.filter();
        }
      }
    );
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
