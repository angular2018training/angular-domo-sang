
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import * as _ from 'lodash';
import { BuildingManagementService } from "../../building-management.service";
import { Paging } from "../../../../shared/services/paging.service";
import { PublishConfirmDialogComponent } from '../../components/publish-confirm-dialog/publish-confirm-dialog.component';
import { ClientService } from '../../../client-management/client-management.service';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-building-management',
  templateUrl: './building-management.page.html',
  styleUrls: ['./building-management.page.scss']
})
export class BuildingManagementPage implements OnInit {
  clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  clientDetail = {
    name: '',
    publishStatus: null,
    publishDate: '',
    tenantName: ''
  };
  navLinks = [
    {
      label: 'Buildings',
      url: 'buildings',
      index: 0
    }, {
      label: 'Other Data',
      url: 'other-data',
      index: 1
    }
  ]
  listTitle = [
    'tags.buildingManagement',
    'tags.otherData'
  ]
  activeLinkIndex = 0;
  isShow = false;

  constructor(
    private router: Router,
    private _BuildingManagementService: BuildingManagementService,
    private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private _ClientService: ClientService,
    public dialog: MatDialog,
  ) {
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }

  ngOnInit() {
    this.checkRouter();
    this.getClientDetail();
  }

  changeLanguage() {
    this._UtilitiesService.translateValue(this.listTitle, null).subscribe(value => {
      for (let i = 0; i < this.listTitle.length; i++) {
        this.navLinks[i].label = value[this.listTitle[i]];
      }
    });
  }

  checkRouter() {
    let url = this.router.url;
    if (url.lastIndexOf('other-data') > 0) {
      this.activeLinkIndex = 1;
    }
    else {
      this.activeLinkIndex = 0;
    }
  }

  showClientDetail() {
    this.router.navigate(['/client-management/client-detail'], { queryParams: { clientId: this.clientId } });
  }
  changeTab(url, index) {
    this.activeLinkIndex = index;
    this.router.navigate(['/client-management/' + url], { queryParams: { clientId: this.clientId } });
  }
  publishBuilding(publishStatus) {
    let dataConfirm = {};
    if (publishStatus == 1) {
      dataConfirm = {
        message: 'When a client is unpublished, it will no longer be available for reporting projects.',
        confirm: 'Do you want to unpublish it ?'
      }
    } else {
      dataConfirm = {
        message: 'When a client published, it will then be available for reporting projects',
        confirm: 'Do you want to publish it ?'
      }
    }
    const dialogRef = this.dialog.open(PublishConfirmDialogComponent, {
      width: '450px',
      disableClose: true,
      data: dataConfirm
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (publishStatus == 1) {
          // unpublish
          this._BuildingManagementService.unpublishClient(this.clientId).then(res => {
            if (res) {
              this._UtilitiesService.showSuccess('Unpublish Successfully');
              this.clientDetail.publishStatus = 0;
             
            }
          })
        } else {
          // publish
          this._BuildingManagementService.publishClient(this.clientId).then(res => {
            if (res) {
              this._UtilitiesService.showSuccess('Publish Successfully');
              this.clientDetail.publishStatus = 1;

              this.getClientDetail();
            }
          })
        }
      }

    });
  }

  /* get client detail */
  getClientDetail() {
    return this._ClientService.getClientById(this.clientId).then(result => {
      if (result) {
        this.clientDetail = result;
        this._BuildingManagementService.publishClientStatus = result.publishStatus;
      }
    });
  }
}
