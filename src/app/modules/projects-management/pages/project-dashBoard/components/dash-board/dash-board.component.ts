import { ProjectsManagementService } from './../../../../projects-management.service';
import { BreadcrumbService } from './../../../../../../core/components/breadcrumb/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ProjectDashBoardService } from '../../project-dashBoard.service';
import { UtilitiesService } from '../../../../../../core/services/utilities.service';

import * as _ from 'lodash';
import { LOCAL_MESSAGE } from '../../../../../../core/constants/message';



@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})

export class DashBoardComponent implements OnInit {
  projectId;
  projectDetail = {
    name: ''
  };
  navLinks = [
    {
      label: 'tags.projectDashboard.dashboard',
      path: './dashboard',
      index: 0
    }, {
      label: 'tags.projectDashboard.keyFindings',
      path: './key-findings',
      index: 1
    },
    {
      label: 'tags.projectDashboard.appendix',
      path: './appendix',
      index: 2
    }
  ]
  activeLinkIndex = 0;

  constructor(
    private router: Router,
    private _ProjectDashBoardService: ProjectDashBoardService,
    private _UtilitiesService: UtilitiesService,
    private breadcrumbService: BreadcrumbService,
    private projectsManagementService: ProjectsManagementService,
    private activatedRoute: ActivatedRoute
  ) {
     this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
  }
  project = {
    name: '',
    clientName: '',
    timeFrom: '',
    timeTo: ''
  };

  ngOnInit() {
    //let url = this.router.url.split('/');

    //this.projectId = url[url.length - 2];
    //this.getProjectDetail();
    //this.checkRouter();
     this.checkRouter();
    this.getProjectDetail();
  }

  getProjectDetail() {
    this.projectsManagementService.getProjectById(this.projectId).then((response) => {
      this.project = response;
      if (response) {
        // Update Breadcrumb
        this.breadcrumbService.addFriendlyNameForRouteRegex('/projects-management/project-dash-board', response.name);
        this.breadcrumbService.addFriendlyNameForRouteRegex('/projects-management/project-dash-board/dashboard', 'Dashboard');
        this.breadcrumbService.addFriendlyNameForRouteRegex('/projects-management/project-dash-board/key-findings', 'Choices for Key Findings');
        this.breadcrumbService.addFriendlyNameForRouteRegex('/projects-management/project-dash-board/appendix', 'Choices for Appendix');

        this.projectsManagementService.projectInfo.floorId = response.floorId;
        this.projectsManagementService.projectInfo.timeFrom = response.timeFrom;
        this.projectsManagementService.projectInfo.timeTo = response.timeTo;
        this.projectsManagementService.projectInfo.buildingId = response.buildingId;
        this.projectsManagementService.projectInfo.clientId = response.clientId;
      }
    }, error => {
      this._UtilitiesService
        .translateValueByKey(LOCAL_MESSAGE["93"])
        .subscribe(value => {
          this._UtilitiesService.showConfirmDeletedDialog(value, res => {
            this.router.navigate(['/projects-management']);
          });
        });
    })
  }

  checkRouter() {
    let splitArray = _.split(this.router.url, '/');
    let extension = splitArray[splitArray.length - 1];
    
    if (extension === "appendix") {
      this.activeLinkIndex = 2;
    } else {
      this.activeLinkIndex = 0;
    }
  }

  save() {
    this.getDetailProject(this.projectId).then(result => {
      if (result) {
        //TODO: save
      }
    });
  };

  export() {
    this.getDetailProject(this.projectId).then(result => {
      if (result) {
        this.router.navigate(['/projects-management/preview-report']);
      }
    });
  };
  settings() {
    this.getDetailProject(this.projectId).then(result => {
      if (result) {
        this.router.navigate(['projects-management/edit'], { queryParams: { projectId: this.projectId } });
      }  
    });  
  };




  getDetailProject(id) {
    return this.projectsManagementService.getProjectById(id).then(result => {
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
