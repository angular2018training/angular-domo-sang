import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UtilitiesService } from "../../../../core/services/utilities.service";
import {
  ITdDataTableColumn,
  TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent,
  TdDataTableService,
  IPageChangeEvent
} from "@covalent/core";
import * as _ from "lodash";
import { TenantManagementService } from "../../tenant-management.service";
import { Observable } from "rxjs/Observable";
import { FormControl } from "@angular/forms";
import { LOCAL_MESSAGE } from "../../../../core/constants/message";

@Component({
  selector: "app-tenant-management",
  templateUrl: "./tenant-management.page.html",
  styleUrls: ["./tenant-management.page.scss"]
})
export class TenantManagementPage implements OnInit {
  @ViewChild("pagingBar") pagingBar;
  @ViewChild("search") searchEle: ElementRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _TenantManagementService: TenantManagementService,
    private router: Router
  ) {
    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }

  columns: ITdDataTableColumn[] = [
    { name: "id", label: "", filter: true, sortable: true },
    { name: "name", label: "", filter: true, sortable: true },
    { name: "address", label: "", filter: true, sortable: true },
    { name: "email", label: "", filter: true, sortable: true },
    { name: "createdDate", label: "", filter: true, sortable: true }
    // { name: 'action', label: 'Action', width: 100 }
  ];

  data: any[] = [];
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = "";
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = "projectName";
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  dataTenant = {};
  totalPage: number = 1;
  selecteTenant: number;
  totalElements: number;
  country = [];

  listPage: number[];
  formCurrentPage = new FormControl();

  ngOnInit() {
    // this._UtilitiesService.showLoading();
    // this.getCustomerList();
    this.reloadData();
    this.filter();
    setTimeout(() => {
      this._UtilitiesService.hideLoading();
    }, 500);

    // handle search input
    Observable.fromEvent(this.searchEle.nativeElement, "keyup")
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        this.search(this.searchEle.nativeElement.value);
      });
  }
  reloadData() {
    this.getListTenant().then(() => {
      if (this.selecteTenant) {
        this.getListTenant();
      } else {
        this.dataTenant = {};
      }
    });
  }
  // getUserList() {
  //   return this._TenantDetailService.getUserByTenantId(this.tenantID).then(result => {
  //     if (result) {
  //       this.data = result;
  //       this.filter();
  //     }
  //   });
  // }
  getTenantDetail() {
    return this._TenantManagementService.getTenantById(null).then(result => {
      if (result) {
        this.dataTenant = result;
      }
    });
  }
  getListTenant() {
    return this._TenantManagementService.getTenantList(null).then(result => {
      if (result) {
        this.data = result.content;
        this.selecteTenant = this.data.length > 0 ? this.data[0].id : null;
        this.totalElements = result.totalElements;

        this._TenantManagementService
          .getTenantListSize(this.totalElements)
          .then(result => {
            if (result) {
              this.data = result.content;
              this.selecteTenant =
                this.data.length > 0 ? this.data[0].id : null;

              this.filter();
            }
          });
      }
    });
  }
  listTitle = [
    "tags.tenantManagement.tenantID",
    "tags.tenantManagement.tenantName",
    "tags.tenantManagement.tenantAddress",
    "tags.tenantManagement.tenantEmail",
    "tags.tenantManagement.createdDate"
  ];

  changeLanguage() {
    this._UtilitiesService
      .translateValue(this.listTitle, null)
      .subscribe(value => {
        for (let i = 0; i < this.listTitle.length; i++) {
          this.columns[i].label = value[this.listTitle[i]];
        }
      });
  }
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
        // update array pages
        this.updateListPages();
      }  
    } else {
      this.filteredData = [];
    }
  }

  onDeleteClick(row, event) {
    event.preventDefault();
    event.stopPropagation();
    this._TenantManagementService.getTenantById(row.id).then(result => {
      if (result.status === 1) {
        this._UtilitiesService
          .translateValueByKey(LOCAL_MESSAGE["23"], { partnerName: row.name })
          .subscribe(value => {
            this._UtilitiesService.showConfirmDialog(value, res => {
              if (res) {
                this.deleteTenant(row.id).then(() => {
                  if (this.filteredData && this.filteredData.length - 1 < 1) {
                    this.currentPage =
                      this.currentPage > 1 ? this.currentPage - 1 : 0;
                    if (this.filteredData.length === 1) {
                      this.filteredData.length = 0;
                    }
                  }
                  this.pagingBar.navigateToPage(this.currentPage);

                  this.getListTenant();
                });
              }
            });
          });
      } else {
        this._UtilitiesService
          .translateValueByKey(LOCAL_MESSAGE["93"])
          .subscribe(value => {
            this._UtilitiesService.showConfirmDeletedDialog(value, res => {
              this.getListTenant();
            });
          });
      }
    });
  }
  deleteTenant(data) {
    return this._TenantManagementService.deleteTenant(data).then(result => {
      if (result) {
        this._UtilitiesService
          .translateValueByKey(LOCAL_MESSAGE["9"])
          .subscribe(value => {
            this._UtilitiesService.showSuccess(value);
          });
      }
    });
  }
  createNewTenant() {
    this.router.navigate(["/tenant-management/add"]);
    this._TenantManagementService.tenantInfo = null;
  }

  //get ID tenant for User
  onRowClick(row) {
    // this.getCountry()
    this._TenantManagementService.getTenantById(row.id).then(result => {
      if (result.status === 1) {
        this.router.navigate(["/tenant-management/tenant-detail"], {
          queryParams: { id: row.id }
        });
      } else {
        this._UtilitiesService
          .translateValueByKey(LOCAL_MESSAGE["93"])
          .subscribe(value => {
            this._UtilitiesService.showConfirmDeletedDialog(value, res => {
              this.getListTenant();
            });
          });
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
