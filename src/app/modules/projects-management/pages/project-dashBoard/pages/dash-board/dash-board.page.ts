import { BreadcrumbService } from './../../../../../../core/components/breadcrumb/breadcrumb.service';
import { UtilitiesService } from './../../../../../../core/services/utilities.service';
import { ChartService } from './../../../../../../chart/chart.service';
import { ProjectsManagementService } from './../../../../projects-management.service';
import { CHART_ID } from './../../../../../../core/constants/chart.constant';
import { API_CONFIGURATION } from './../../../../../../core/constants/server.constant';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { error } from 'protractor';
import { LOCAL_MESSAGE } from '../../../../../../core/constants/message';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.page.html',
  styleUrls: ['./dash-board.page.scss']
})
export class DashBoardPage implements OnInit {
  projectId;
  project = {
    floorId: null,
    timeFrom: null,
    timeTo: null,
    clientId: null,
    buildingId: null,
  };
  data: any[] = [];
  constructor(private projectsManagementService: ProjectsManagementService,
    private activatedRoute: ActivatedRoute,
    private _UtilitiesService: UtilitiesService,
    private router: Router, ) {
    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
  }

  ngOnInit() {
    this.getProjectDetail(this.projectId).then(() => {
      this.project = this.projectsManagementService.projectInfo;
    })
    
  }


   getProjectDetail(id) {
     return this.projectsManagementService.getProjectById(id).then(result => {
       if (result) {
         this.data = result;
       }
     }, error => {
       this._UtilitiesService
         .translateValueByKey(LOCAL_MESSAGE["93"])
         .subscribe(value => {
           this._UtilitiesService.showConfirmDeletedDialog(value, res => {
             this.router.navigate(['/projects-management']);
           });
         });
     });
  }
}
