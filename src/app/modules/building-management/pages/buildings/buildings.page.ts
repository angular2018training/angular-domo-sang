import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { BuildingManagementPage } from '../../pages/building-management/building-management.page';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { BuildingManagementService } from "../../building-management.service";
import { Observable } from 'rxjs/Observable';
import { TdDataTableSortingOrder, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.page.html',
  styleUrls: ['./buildings.page.scss']
})
export class BuildingsPage implements OnInit {
  @ViewChild('search') searchEle: ElementRef;
  /* data response */
  clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  data: any[] = [];
  dataBuilding = {};
  timezones = [];
  /* data table */
  searchTerm: string = '';
  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  rightContent = 'buildingDetail';
  selectedBuilding = Number(this.activatedRoute.snapshot.queryParams['buildingId']);
  selectedFloor = Number(this.activatedRoute.snapshot.queryParams['floorId']);
  selectedIndex = this.activatedRoute.snapshot.queryParams['selectedIndex'];
  publishStatus = null;

  constructor(
    private BuildingManagementPage: BuildingManagementPage,
    private _UtilitiesService: UtilitiesService,
    private _BuildingManagementService: BuildingManagementService,
    private _dataTableService: TdDataTableService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.reloadData();
    setTimeout(() => {
      this.publishStatus = this.BuildingManagementPage.clientDetail.publishStatus;
    }, 200);
    // handle search input
    Observable.fromEvent(this.searchEle.nativeElement, 'keyup')
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        this.search(this.searchEle.nativeElement.value);
      });
  }
  reloadData() {
    this.getBuildingList().then(() => {
      if (this.selectedBuilding && !this.selectedFloor) {
        this.showBuildingDetail(this.selectedBuilding);
      } else if (this.selectedBuilding && this.selectedFloor) {
        this.showSubMenu(this.selectedBuilding, true);
        this.showFloorDetail(this.selectedBuilding, this.selectedFloor);
      } else {
        this.dataBuilding = {};
        this.rightContent = 'buildingDetail';
      }
    });
  }
  /* search building */
  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }
  /* filter data */
  filter(): void {
    let newData: any[] = this.data;
    let newData1 = _.filter(newData, (o) => {
      return _.toLower(o.name).indexOf(this.searchTerm) >= 0;
    });
    let newData2 = _.filter(newData, (o) => {
      return _.filter(o.floors, (e) => {
        return _.toLower(e.name).indexOf(this.searchTerm) >= 0;
      }).length > 0;
    });
    newData = _.uniq(_.concat(newData1, newData2));
    this.filteredTotal = newData.length;
    this.filteredData = newData;
  }

  showSubMenu(idBuilding, status) {
    this.filteredData.forEach((b) => {
      if (b.id == idBuilding) {
        if (b.floors.length == 0 && !b.isShow) {
          const warning = this._UtilitiesService.changeLanguage(['tags.message.notFound']);
          this._UtilitiesService.showWarning(warning[0]);
        }
        b.isShow = status;
      }
    })
  }

  /* get list builing by client id */
  getBuildingList() {
    const params = {
      clientid: this.clientId
    };
    return this._BuildingManagementService.getBuildingByClientId(params).then(result => {
      if (result) {
        this.data = result;
        this.handelData(this.data);
        this.filter();
        if (this.data.length > 0 && !this.selectedBuilding) {
          this.selectedBuilding = this.data[0].id
        }
      }
    });
  }
  /* convert json */
  handelData(data) {
    data.forEach(element => {
      element.isShow = false;
    });
  }
  /* navigate to create building page */
  createBuilding() {
    this.getTimeZones();
    this.rightContent = 'create';
    this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: this.clientId } });
  }
  /* navigate to edit building page */
  editBuilding(data) {
    this.dataBuilding = data;
    this.getTimeZones();
    this.rightContent = 'edit';
  }
  /* show building detail when click on building */
  showBuildingDetail(buildingId, isReload = null) {
    this.selectedBuilding = buildingId;
    this.selectedFloor = null;
    this.rightContent = 'buildingDetail';
    // this.getBuildingDetail(this.selectedBuilding);
    this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: this.clientId, buildingId: this.selectedBuilding } });
    if (isReload) {
      this.getBuildingList();
    }
  }

  /* show floor detail */
  showFloorDetail(buildingId, floorId, isReload = null) {
    this.selectedFloor = floorId;
    this.selectedBuilding = buildingId;
    this.rightContent = 'floorDetail';
    // this.getFloorDetail(this.selectedBuilding, this.selectedFloor);
    this.router.navigate(['/client-management/buildings'], {
      queryParams: {
        clientId: this.clientId,
        buildingId: this.selectedBuilding,
        floorId: this.selectedFloor,
        selectedIndex: this.selectedIndex ? this.selectedIndex : null
      }
    });
    if (isReload) {
      this.getBuildingList().then(() => {
        this.showSubMenu(this.selectedBuilding, true);
      });
    }
    this.selectedIndex = null;
  }

  /* get timezones */
  getTimeZones() {
    return this._BuildingManagementService.getTimeZones().then(result => {
      if (result) {
        this.timezones = result;
      }
    });
  }
  // checkBuildingExit(idBuilding){
  //   /*  move to the screen of the next building or previous building */
  //   const indexBuilding = _.findIndex(this.data, (o) => { return o.id == idBuilding });
  //   if (this.data[indexBuilding + 1]) {
  //     this.selectedBuilding = this.data[indexBuilding + 1].id;
  //   } else if (this.data[indexBuilding - 1]) {
  //     this.selectedBuilding = this.data[indexBuilding - 1].id;
  //   } else {
  //     this.selectedBuilding = null;
  //     this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: this.clientId } });
  //   }
  //   this.reloadData();
  // }
 }
