import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FloorEditDialogComponent } from "../floor-edit-dialog/floor-edit-dialog.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { BuildingManagementService } from "../../building-management.service";
import { BuildingsPage } from "../../pages/buildings/buildings.page";
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { BuildingManagementPage } from '../../pages/building-management/building-management.page';

@Component({
  selector: 'app-floor-information',
  templateUrl: './floor-information.component.html',
  styleUrls: ['./floor-information.component.scss']
})
export class FloorInformationComponent implements OnInit {
  @Input() floorId: any;
  buildingId = Number(this.activatedRoute.snapshot.queryParams['buildingId']);
  clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  dataFloor = {
    id: null,
    name: '',
    buildingId: null,
    floorLevel: null,
    buildingName: '',
    clientName: '',
    lastModifedDate: null
  }
  publishStatus = null;
  constructor(
    public dialog: MatDialog,
    private _UtilitiesService: UtilitiesService,
    private _BuildingManagementService: BuildingManagementService,
    private _BuildingManagementPage: BuildingManagementPage,    
    private _BuildingsPage: BuildingsPage,
    private activatedRoute: ActivatedRoute,
    private router: Router,    
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.publishStatus = this._BuildingManagementPage.clientDetail.publishStatus;
    }, 200);
  }
  getFloorDetail(buildingId, floorId) {
    let params = {
      buildingid: buildingId
    }
    return this._BuildingManagementService.getFloorById(floorId, params).then(result => {
      if (result) {
        this.dataFloor = result;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.floorId) {
      this.getFloorDetail(this.buildingId, this.floorId);
    }
  }

  editFloor() {
    const dialogRef = this.dialog.open(FloorEditDialogComponent, {
      width: '650px',
      disableClose: true,
      data: this.dataFloor
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFloorDetail(this.buildingId, this.floorId);
        this._BuildingsPage.reloadData();
      }
    });
  }
  /* confirm delete floor */
  deleteFloorConfirm() {
    this._UtilitiesService.showConfirmDialog('tags.floorManagement.confirm.deleteFloor', (res) => {
      if (res) {
        this.deleteFloor(this.dataFloor.id).then((err) => {
          if (err) {
            /*  move to the screen of the next building or previous building */
            const indexBuilding = _.findIndex(this._BuildingsPage.data, (o) => { return o.id == this.buildingId; });
            if (this._BuildingsPage.data[indexBuilding + 1]) {
              this._BuildingsPage.selectedBuilding = this._BuildingsPage.data[indexBuilding + 1].id;
            } else if (this._BuildingsPage.data[indexBuilding - 1]) {
              this._BuildingsPage.selectedBuilding = this._BuildingsPage.data[indexBuilding - 1].id;
            } else {
              this._BuildingsPage.selectedBuilding = null;
              this.router.navigate(['/client-management/buildings'], { queryParams: { clientId: this.clientId } });
            }
            this._BuildingsPage.selectedFloor = null;
            this._BuildingsPage.reloadData();
          } else {
            /*  move to the screen of the next floor of current building or previous floor */
            this._BuildingsPage.data.forEach((item) => {
              if (item.id == this.buildingId) {
                const indexFloor = _.findIndex(item.floors, (o) => { return o['id'] == this.dataFloor.id; });
                if (item.floors[indexFloor + 1]) {
                  this._BuildingsPage.selectedFloor = item.floors[indexFloor + 1].id;
                } else if (item.floors[indexFloor - 1]) {
                  this._BuildingsPage.selectedFloor = item.floors[indexFloor - 1].id;
                } else {
                  this._BuildingsPage.selectedFloor = null;
                }
              }
            })
            this._BuildingsPage.reloadData();
          }
        });
      }
    });
  }
  /* request delete floor */
  deleteFloor(id) {
    let params = {
      buildingid: this.dataFloor.buildingId
    }
    return this._BuildingManagementService.deleteFloor(id, params).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
      }
    }, error => {
      if (error) {
        let errorCode = null;
        error.fieldErrors.forEach(element => {
          if (element.code == 1073) {
            errorCode = element.code;
          }
        });
        return errorCode;
      }
    });
  }
}
