import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsManagementService } from '../../projects-management.service';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import * as moment from 'moment';
import { BreadcrumbService } from '../../../../core/components/breadcrumb/breadcrumb.service';

import { CancelDialogComponent } from '../../components/cancel-dialog/cancel-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SYSTEM, PATTERNS } from '../../../../core/constants/system.constant';
@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.page.html',
  styleUrls: ['./project-add.page.scss']
})
export class ProjectAddPage implements OnInit {
  fieldCreateProject = {
    id: '',
    name: '',
    client: null,
    building: null,
    floor: null,
    timeTo: '',
    timeFrom: ''
  };
  projectName = PATTERNS.VALIDATE_LEADING_SPACE ;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  constructor(private router: Router,
    private _ProjectsManagementService: ProjectsManagementService,
    private _UtilitiesService: UtilitiesService,
    private breadcrumbService: BreadcrumbService,
    private daterangepickerOptions: DaterangepickerConfig,
    public dialog: MatDialog
  ) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: true,
      linkedCalendars: true,
      autoUpdateInput: false,
      showCustomRangeLabel: true,
      ranges: {
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      },
    };
    this.breadcrumbService.addFriendlyNameForRouteRegex('projects-management/add', 'Create');
  }
  clientError = false;
  buildingError = false;
  isDateRange = false;
  clients: any[] = []
  buildings: any[] = []
  floors: any[] = []
  createProjectForm = new FormGroup({
    name: new FormControl(this.fieldCreateProject.name, [
      Validators.required,
      Validators.maxLength(100),
    ]
    ),
    clients: new FormControl(this.fieldCreateProject.client,[Validators.required]),
    buildings: new FormControl(this.fieldCreateProject.building,[Validators.required]),
    floors: new FormControl(),
    timeTo: new FormControl(),
    timeFrom: new FormControl('',Validators.required),
  });

  get clientsControl() { return this.createProjectForm.get('clientsControl'); }
  get timeFrom() { return this.createProjectForm.get('timeFrom'); }
  get timeTo() { return this.createProjectForm.get('timeTo'); }
  get name() { return this.createProjectForm.get('name'); }

  public daterange: any = {};

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    // locale: { format: 'YYYY-MM-DD' },
    // alwaysShowCalendars: false,
  };

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    

    // any object can be passed to the selected event and it will be passed back here
    //debugger
    this.isDateRange = false;
    datepicker.start = value.start._d;
    datepicker.end = value.end._d;

    this.fieldCreateProject.timeFrom = value.start;
    this.fieldCreateProject.timeTo = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;

    this.fieldCreateProject.timeFrom = value.start._d;
    this.fieldCreateProject.timeTo = value.end._d;

    console.log(this.fieldCreateProject.timeFrom);
    console.log(this.fieldCreateProject.timeTo);
  }

  ngOnInit() {
    this.getListClient();
  }

  onSaveProject() {
    const request = this.prepareCreateProject();
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      //this.createAction(request);

      this._ProjectsManagementService.createProject(request).then(result => {
        if (result) {
          this._UtilitiesService.showSuccessMessageAPI(result);
          this.fieldCreateProject.id = result.id;
          this.router.navigate(['/projects-management/project-dash-board'], { queryParams: { projectId: this.fieldCreateProject.id } });
        }

      });
    }
    //this.router.navigate(['/projects-management/project-dash-board']);
  }

  cancelDialog() {
    this._UtilitiesService.showConfirmDialog('tags.message.confirm.quit', (res) => {
      if (res) {
        this.router.navigate(['/projects-management']);
      }
    })
  }

  prepareCreateProject() {
    let request = {
      name: this.fieldCreateProject.name,
      clientId: this.fieldCreateProject.client,
      buildingId: this.fieldCreateProject.building,
      floorId: this.fieldCreateProject.floor,
      timeFrom: this.fieldCreateProject.timeFrom,
      timeTo: this.fieldCreateProject.timeTo,
    }
    return request;
  }

  inputValidation() {
    let errorInput = [];
    if (!this.fieldCreateProject.timeFrom) {
      errorInput.push('tags.projectsManagement.message36');
    }

    this.fieldCreateProject.name = this.fieldCreateProject.name.trim();
    /* validate data */
    if (!this.fieldCreateProject.name) {
      errorInput.push('tags.message.invalid.inputt');
    }
    return errorInput;
  }

  createAction(request) {
    return this._ProjectsManagementService.createProject(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        //this.router.navigate(['/projects-management/project-dash-board']);
      }
    });
  }

  getListClient() {
    let params = {
      publishstatus: 1
    }
    return this._ProjectsManagementService.getPublishClient(params).then(result => {
      if (result) {
        this.clients = result;
      }
    });
  }

  getBuildingList() {
    //clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
    const params = {
      clientid: this.fieldCreateProject.client
    };
    return this._ProjectsManagementService.getBuildingByClientId(params).then(result => {
      if (result) {
        this.buildings = result;
      }
    });
  }

  getFloorList() {
    //clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
    const params = {
      buildingid: this.fieldCreateProject.building
    };
    return this._ProjectsManagementService.getFloorByBuildingId(params).then(result => {
      if (result) {
        this.floors = result;
      }
    });
  }

  onChangeClient() {
    if (this.fieldCreateProject.client){
      this.getBuildingList();
    }else{
      this.buildings = [];
      this.floors = [];
    }
    this.fieldCreateProject.building = null;
    this.fieldCreateProject.floor = null;
  }
  onChangeBuilding() {
    if (this.fieldCreateProject.building){
      this.getFloorList();
    }else{
      this.floors = [];
    }
    this.fieldCreateProject.floor = null;
  }
}
