import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsManagementService } from '../../projects-management.service';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SYSTEM, PATTERNS } from '../../../../core/constants/system.constant';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.page.html',
  styleUrls: ['./project-edit.page.scss']
})
export class ProjectEditPage implements OnInit {
  projectId = Number(this.activatedRoute.snapshot.queryParams['projectId']);
  fieldEditProject = {
    id: '',
    name: '',
    clientId: null,
    buildingId: null,
    buildingName: '',
    floorId: null,
    timeTo: '',
    timeFrom: ''
  };
  projectName = PATTERNS.VALIDATE_LEADING_SPACE ;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  constructor(private router: Router,
    private _ProjectsManagementService: ProjectsManagementService,
    private _UtilitiesService: UtilitiesService,
    private daterangepickerOptions: DaterangepickerConfig,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.daterangepickerOptions.settings = {
      locale: { format: 'YYYY-MM-DD' },
      alwaysShowCalendars: true,
      linkedCalendars: true,
      autoUpdateInput: false,
      showCustomRangeLabel: true,
      ranges: {

        "Last 7 Days": [
          "2018-03-23T09:10:00.675Z",
          "2018-03-29T09:10:00.675Z"
        ],
        "Last 30 Days": [
          "2018-02-28T09:10:00.675Z",
          "2018-03-29T09:10:00.675Z"
        ],
        "This Month": [
          "2018-02-28T17:00:00.000Z",
          "2018-03-31T16:59:59.999Z"
        ],
        "Last Month": [
          "2018-01-31T17:00:00.000Z",
          "2018-02-28T16:59:59.999Z"
        ]
      },
    };
  }
   clientError = false;
  buildingError = false;
  clients_data: any[] = [];
  clients: any[] = []
  buildings: any[] = []
  floors: any[] = []
  editProjectForm = new FormGroup({
    name: new FormControl(this.fieldEditProject.name, [
      Validators.required,
      Validators.maxLength(100),
    ]
    ),
    clients: new FormControl(),
    buildings: new FormControl(),
    floors: new FormControl(),
    timeFrom: new FormControl(),
    timeTo: new FormControl(),
  });

  get name() { return this.editProjectForm.get('name'); }

  public daterange: any = {};

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    // locale: { format: 'YYYY-MM-DD' },
    // alwaysShowCalendars: false,
  };

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    //debugger
    datepicker.start = value.start._d;
    datepicker.end = value.end._d;

    this.fieldEditProject.timeFrom = value.start;
    this.fieldEditProject.timeTo = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;

    this.fieldEditProject.timeFrom = value.start._d;
    this.fieldEditProject.timeTo = value.end._d;
    console.log(this.fieldEditProject.timeFrom);
    console.log(this.fieldEditProject.timeTo);
  }

  ngOnInit() {
    this.getDetailProject(this.projectId);
    this.getListClient();
    //this.getBuildingList();

  }

  getListClient() {
    return this._ProjectsManagementService.getAllClient().then(result => {
      if (result) {
        this.clients = result;
      }
    });
  }
  getDetailProject(id) {
    return this._ProjectsManagementService.getProjectById(id).then(result => {
      if (result) {
        this.fieldEditProject = result;
        console.log(this.fieldEditProject);
        const params = {
          clientid: this.fieldEditProject.clientId
        };
        this._ProjectsManagementService.getBuildingByClientId(params).then(result => {
          if (result) {
            this.buildings = result;
            console.log(this.fieldEditProject.buildingId);
          }
        });
        const params2 = {
          buildingid: this.fieldEditProject.buildingId
        };
        this._ProjectsManagementService.getFloorByBuildingId(params2).then(result => {
          if (result) {
            this.floors = result;
            console.log(this.fieldEditProject.floorId);
          }
        });
      }
    });

  }

  onSaveProject() {
    const request = this.prepareCreateProject();
    let errorInput = [];
    errorInput = this.inputValidation();
    if (errorInput.length > 0) {
      this._UtilitiesService.validationWarningDisplay(errorInput);
    } else {
      this.createAction(request);
    }
    //this.router.navigate(['/projects-management/project-dash-board']);
  }

  cancelDialog() {
    this._UtilitiesService.showConfirmDialog('tags.message.confirm.quit', (res) => {
      if (res) {
        this.router.navigate(['/projects-management/project-dash-board'], { queryParams: { projectId: this.fieldEditProject.id } });
      }
    })
  }

  prepareCreateProject() {
    let request = {
      id: this.fieldEditProject.id,
      name: this.fieldEditProject.name,
      clientId: this.fieldEditProject.clientId,
      buildingId: this.fieldEditProject.buildingId,
      floorId: this.fieldEditProject.floorId,
      timeFrom: this.fieldEditProject.timeFrom,
      timeTo: this.fieldEditProject.timeTo,
    }
    return request;
  }

  inputValidation() {
    let errorInput = [];
    if (!this.fieldEditProject.name) {
      errorInput.push('tags.message.required.field');
    } if (!this.fieldEditProject.timeFrom) {
      errorInput.push('tags.projectsManagement.message36');
    }
    return errorInput;
  }

  createAction(request) {
    return this._ProjectsManagementService.editProject(request).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        this.router.navigate(['/projects-management/project-dash-board'], { queryParams: { projectId: this.fieldEditProject.id } });
      }
    });
  }

  getBuildingList() {
    //clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
    const params = {
      clientid: this.fieldEditProject.clientId
    };
    return this._ProjectsManagementService.getBuildingByClientId(params).then(result => {
      if (result) {
        this.buildings = result;
      //   if (this.buildings.length > 0)
      //     this.fieldEditProject.buildingId = this.buildings[0].id;
      //     this.getFloorList();
      }
    });
  }

  getFloorList() {
    //clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
    const params = {
      buildingid: this.fieldEditProject.buildingId
    };
    return this._ProjectsManagementService.getFloorByBuildingId(params).then(result => {
      if (result) {
        this.floors = result;
      //   if (this.floors.length > 0)
      //     this.fieldEditProject.floorId = this.floors[0].id
      }
    });
  }

  onChangeClient() {
    if (this.fieldEditProject.clientId){
      this.getBuildingList();
    }else{
      this.buildings = [];
      this.floors = [];      
    }
    this.fieldEditProject.buildingId = null;
    this.fieldEditProject.floorId = null;
  }
  onChangeBuilding() {
    if (this.fieldEditProject.buildingId){
      this.getFloorList();
    }else{
      this.floors = [];
    }
    this.fieldEditProject.floorId = null;
  }
}
