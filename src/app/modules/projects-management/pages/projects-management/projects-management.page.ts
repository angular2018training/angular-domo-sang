import { UserService } from './../../../../core/services/user.service';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { ProjectsManagementService } from '../../projects-management.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LOCAL_MESSAGE } from '../../../../core/constants/message';
import { error } from 'protractor';

@Component({
  selector: 'app-projects-management',
  templateUrl: './projects-management.page.html',
  styleUrls: ['./projects-management.page.scss']
})
export class ProjectsManagementPage implements OnInit {
  @ViewChild('search') searchEle: ElementRef;
  @ViewChild('pagingBar') pagingBar;
  constructor(private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
    private _ProjectsManagementService: ProjectsManagementService,
    private router: Router,
    private userService: UserService
  ) {
    // set language
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }

  dataClients = {
    id: null,
    publishStatus: null
  }
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '', filter: true, sortable: true },
    { name: 'clientName', label: '', filter: true, sortable: true },
    { name: 'buildingName', label: '', filter: true, sortable: true },
    { name: 'floorLevel', label: '', filter: true, sortable: true },
  ];
  building: any[] = [];
  data: any[] = [];
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  totalPage: number = 1;
  pageSizes: number[] = [5, 10, 25, 50];
  pageSize: number = this.pageSizes[3];
  sortBy: string = 'projectName';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  listPage: number[];
  fromCurrentPage = new FormControl();


  ngOnInit() {
    this._UtilitiesService.showLoading();
    this.getListProject();
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

  listTitle = [
    // 'tags.projectsManagement.id',
    'tags.projectsManagement.reportingName',
    'tags.projectsManagement.targetClient',
    'tags.projectsManagement.targetBuilding',
    'tags.projectsManagement.targetFloor',
  ];

  getListClient() {
    let param = {}

    return this._ProjectsManagementService.getAllClient().then(result => {
      if (result) {
        this.dataClients = result;
        this.filter();
      }
    });
  }

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
  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
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
  }


  onDeleteClick(row, event) {
    event.preventDefault();
    event.stopPropagation();
    this.getProjectDetail(row.id).then(() => {
      this._UtilitiesService
        .translateValueByKey(LOCAL_MESSAGE["24"], { projectName: row.name })
        .subscribe(value => {
          this._UtilitiesService.showConfirmDialog(value, (res) => {
            if (res) {
              this.deleteProject(row.id).then(result => {
                if (this.filteredData && this.filteredData.length - 1 < 1) {
                  this.currentPage = this.currentPage > 1 ? (this.currentPage - 1) : 0;
                  this.filter();
                }
                this.pagingBar.navigateToPage(this.currentPage);
                this.getListProject();
              })
            }
          });
        });    
    }, error => {
      this._UtilitiesService
        .translateValueByKey(LOCAL_MESSAGE["93"])
        .subscribe(value => {
          this._UtilitiesService.showConfirmDeletedDialog(value, res => {
            this.getListProject();
          });
        });
    })
     
  }
  deleteProject(data) {
    return this._ProjectsManagementService.deleteProject(data).then(result => {
      this._UtilitiesService.showSuccess('Deleted successfully');
    });
  }

  reloadData() {
    this.getListProject().then(() => {
      if (this.selectedRows) {
        this.getProjectDetail(this.selectedRows);
      } else {
        this.data = [];
      }
    });
  }

  getProjectDetail(id) {
    return this._ProjectsManagementService.getProjectById(id).then(result => {
      if (result) {
        this.data = result;
      }
    });
  }

  getListProject() {
    let param = {};
    return this._ProjectsManagementService.getAllProject(this.data).then(result => {
      if (result) {
        this.data = result;
        console.log(this.data);
        this.filter();
      }
    });
  }

  createNewProject() {
    this.router.navigate(['/projects-management/add']);
  }

  viewDetailProject(id) {
    this.getProjectDetail(id).then(() => {
      this.router.navigate(['/projects-management/project-dash-board'], { queryParams: { projectId: id } });
    }, error =>{
      this._UtilitiesService
        .translateValueByKey(LOCAL_MESSAGE["93"])
        .subscribe(value => {
          this._UtilitiesService.showConfirmDeletedDialog(value, res => {
            this.getListProject();
          });
        });
    })
    
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
