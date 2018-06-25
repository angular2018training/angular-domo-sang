import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as contextMenus from 'cytoscape-context-menus';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { SetupSensorPlacementService } from '../../setup-sensor-placement.service';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { TdFileInputComponent } from '@covalent/core';
import { MatDialog } from '@angular/material';
import { InformationDialogComponent } from '../../components/information-dialog/information-dialog.component';
import { ChangeSensorDialogComponent } from '../../components/change-sensor-dialog/change-sensor-dialog.component';

@Component({
  selector: 'app-setup-sensor-placement',
  templateUrl: './setup-sensor-placement.page.html',
  styleUrls: ['./setup-sensor-placement.page.scss']
})
export class SetupSensorPlacementPage implements OnInit {
  floorId = Number(this.activatedRoute.snapshot.queryParams['floorId']);
  clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  buildingId = Number(this.activatedRoute.snapshot.queryParams['buildingId']);
  @ViewChild('search') searchEle: ElementRef;

  cy: any;
  layout = null;
  dragEvent = null;
  config = {
    width: 0,
    height: 0,
    sizeNode: 30,
    zoomEnable: true,
    curentZoom: null,
    minZoom: 0.2,
    maxZoom: 2,
    wheelSensitivity: 0.01,
    pan: {
      x: 10,
      y: 10
    },
  }
  positionNodeFree1 = {
    x: 0,
    y: 0
  }

  /* data temp */
  data = {
    sensorsInLayout: [],
    sensorsNotInLayout: [],
    buildingId: null,
    clientId: null,
    base64: ''
  }
  sensorsNotInLayout = [];
  sensorsInLayout = [];
  /* end */
  /* data table */
  searchTerm: string = '';
  filteredData: any[] = this.sensorsNotInLayout;
  filteredTotal: number = this.sensorsNotInLayout.length;

  listTitle = [
    'tags.setupSensorPlacement.information',
    'tags.setupSensorPlacement.change',
    'tags.setupSensorPlacement.delete',
  ];
  contextMenu = {
    'tags.setupSensorPlacement.information': 'Information',
    'tags.setupSensorPlacement.change': 'Change',
    'tags.setupSensorPlacement.delete': 'Delete'
  }
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private _SetupSensorPlacementService: SetupSensorPlacementService,
    private _UtilitiesService: UtilitiesService
  ) {
    this.changeLanguage();
    this._UtilitiesService.getLanguageChangeEvent().subscribe(() => {
      this.changeLanguage();
    });
  }
  changeLanguage() {
    this._UtilitiesService.translateValue(this.listTitle, null).subscribe(value => {
      for (let i = 0; i < this.listTitle.length; i++) {
        this.contextMenu[this.listTitle[i]] = value[this.listTitle[i]];
      }
    });
  }
  ngOnInit() {
    Observable.fromEvent(this.searchEle.nativeElement, 'keyup')
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(() => {
        this.search(this.searchEle.nativeElement.value);
      });
  }
  ngOnDestroy() {
    $('.setPosContextMenu').css({
      'display': 'none',
    })
  }
  onResize(e) {
    console.log(e);
  }

  /* init Cytoscape */
  ngAfterViewInit() {
    this.getSensorList();
  }
  /* get data sensor */
  getSensorList() {
    const params = {
      buildingid: this.buildingId,
      layout: true
    };
    return this._SetupSensorPlacementService.getSensorsPlace(this.floorId, params).then(result => {
      if (result) {
        this.data = result;
        this.config.height = result.imageHeight;
        this.config.width = result.imageWidth;
        this.sensorsInLayout = result.sensorsInLayout;
        this.sensorsNotInLayout = result.sensorsNotInLayout;
        this.filter();
        setTimeout(() => {
          if (this.sensorsInLayout.length > 0 || result.base64) {
            this.generateLayout();
          }
        }, 200);
      }
    });
  }
  /* search building */
  search(searchTerm: string): void {
    this.searchTerm = _.toLower(searchTerm);
    this.filter();
  }
  filter(): void {
    let newData: any[] = this.sensorsNotInLayout;
    let newData1 = _.filter(newData, (o) => {
      return _.toLower(o.sensorType).indexOf(this.searchTerm) >= 0;
    });
    let newData2 = _.filter(newData, (o) => {
      return _.filter(o.sensorsList, (e) => {
        return _.toLower(e.sensorName).indexOf(this.searchTerm) >= 0;
      }).length > 0;
    });
    newData = _.uniq(_.concat(newData1, newData2));
    newData = _.orderBy(newData, ['sensorType'], ['asc']);
    this.filteredTotal = newData.length;
    this.filteredData = newData;
  }
  /* drag and drop */
  dataTranfer(sensor) {
    return sensor;
  }
  /* back to floor layout */
  backToFloorLayoutConfirm() {
    this._UtilitiesService.showConfirmDialog('Are you sure you want back to floor layout ?', (res) => {
      if (res) {
        this.backToFloorLayout();
      }
    });
  }
  backToFloorLayout() {
    this.router.navigate(['client-management/buildings'], {
      queryParams: {
        clientId: this.data.clientId,
        buildingId: this.data.buildingId,
        floorId: this.floorId,
        selectedIndex: 1
      }
    })
  }
  /* confirm clean sensor */
  cleanAllSensorConfirm() {
    this._UtilitiesService.showConfirmDialog('tags.setupSensorPlacement.confirmClean', (res) => {
      if (res) {
        this.onCleanAll();
      }
    });
  }
  /* clean all */
  onCleanAll() {
    let sensorsInLayout = _.cloneDeep(this.sensorsInLayout);
    sensorsInLayout.forEach((item) => {
      this.deleteSensor(item);
    })
    this.data.base64 = '';
    this.layout = null;
    this.generateLayout();
    this.filter();
  }
  /* remove sensor on list */
  removeSensor(data) {
    this.sensorsNotInLayout.forEach((item, index) => {
      if (item.sensorType == data.sensorType) {
        _.remove(item.sensorsList, (n) => {
          return n['id'] == data.id;
        });
      }
      if (item.sensorsList.length == 0) {
        this.sensorsNotInLayout.splice(index, 1);
      }
    })
  }
  transferDataSuccess(event) {
    console.log(event);
    if (event.dragData) {
      this.createSensor(event.mouseEvent, event.dragData);
    }
  }
  /* create node */
  createSensor(mouseEvent, data) {
    this.sensorsInLayout.push({
      id: data.id,
      sensorName: data.sensorName,
      sensorType: data.sensorType,
      posX: this.config.width / 2, // posX: mouseEvent.layerX,
      posY: this.config.height / 2, // posY: mouseEvent.layerY,
      macAddress: data.macAddress,
    });
    this.removeSensor(data);
    this.generateLayout();
    this.filter();
  }

  /* confirm delete sensor */
  deleteBuildingConfirm(data) {
    this._UtilitiesService.showConfirmDialog('tags.setupSensorPlacement.confirmDelete', (res) => {
      if (res) {
        this.deleteSensor(data);
        this.generateLayout();
        this.filter();
      }
    });
  }

  /* delete sensor */
  deleteSensor(data) {
    const sensor = {
      id: Number(data.id),
      sensorName: data.sensorName,
      sensorType: data.sensorType,
      posX: null,
      posY: null,
      macAddress: data.macAddress,
    }
    this.sensorsInLayout.forEach((o, index) => {
      if (o.id == data.id) {
        /* add on list sensor */
        let sensorType = this.sensorsNotInLayout.find((o) => {
          return o.sensorType == data.sensorType;
        });
        if (sensorType) {
          sensorType.sensorsList.push(sensor);
        } else {
          this.sensorsNotInLayout.push({
            sensorType: sensor.sensorType,
            sensorsList: [sensor]
          })
        }
        /* remove on list in layout */
        this.sensorsInLayout.splice(index, 1);
      }
    })
  }
  /* save data on db */
  onSave() {
    const errorInput = this.validationInput();
    const requestBody = this.prepareData()
    this.saveAction(requestBody);
  }
  prepareData() {
    return {
      floorId: this.floorId,
      sensorsInLayout: this.sensorsInLayout
    }
  }
  saveAction(body) {
    return this._SetupSensorPlacementService.saveSensorLayout(body).then(result => {
      if (result) {
        this._UtilitiesService.showSuccessMessageAPI(result);
        if (this.layout) {
          this.changeLayout();
        } else {
          this.getSensorList();
        }
      }
    })
  }
  /* validation data */
  validationInput() {
    let errorArray = [];

    return errorArray;
  }


  changeLayout() {
    const request = this.prepareLayout();
    this.changeAction(request);
  }
  /* execute sent request create building to server */
  changeAction(request) {
    return this._SetupSensorPlacementService.changeLayout(request).then(result => {
      if (result) {
        this.getSensorList();        
      }
    });
  }

  // prepare data for create new chiller palant
  prepareLayout() {
    let formData = new FormData();
    formData.append('id', this.floorId.toString());
    if (this.layout) {
      formData.append('image', this.layout);
    }
    return formData;
  }
  @ViewChild('fileInput') inputEle: TdFileInputComponent;
  selectLayoutEvent(file): void {
    const type = ['.png', '.jpg'];
    /* validate file */
    let importError = this._UtilitiesService.validationInportFile(file, type, 5242880);
    if (importError.length > 0) {
      importError = this._UtilitiesService.changeLanguage(importError);
      this._UtilitiesService.validationWarningDisplay(importError);
    } else {
      if (this.sensorsInLayout.length > 0) {
        this.deleteAllSensorConfirm(file);
      } else {
        this.replaceLayout(file);      
      }
    }
    this.inputEle.clear();
  }

  /* confirm delete all sensor */
  deleteAllSensorConfirm(file) {
    this._UtilitiesService.showConfirmDialog('tags.floorManagement.confirm.deleteSensorList', (res) => {
      if (res) {
        this.replaceLayout(file);
      }
    });
  }
  
  replaceLayout(file) {
    /* clean all sensor */
    let sensorsInLayout = _.cloneDeep(this.sensorsInLayout);
    sensorsInLayout.forEach((item) => {
      this.deleteSensor(item);
    });
    const type = ['.png', '.jpg'];
    /* validate file */
    let importError = this._UtilitiesService.validationInportFile(file, type, 5242880);
    if (importError.length > 0) {
      this._UtilitiesService.validationWarningDisplay(importError);
    } else {
      this.layout = file;
      this.readerImage(file);
    }
    this.inputEle.clear();
  }
  /* render file to base64 */
  readerImage(file) {
    let reader = new FileReader();
    let vm = this;
    reader.readAsDataURL(file);
    reader.onload = function () {
      if (vm.sensorsInLayout.length != 0) {
        vm._UtilitiesService.showWarning('Failed to upload file')
      } else {
        vm.data.base64 = reader.result;
        var img = new Image();
        img.src = reader.result;
        img.onload = function () {
          vm.config.height = img.height;
          vm.config.width = img.width;
          vm.generateLayout()
        };
      }
    };
  }

  /* show information */
  showInformation(data = null) {
    const dialogRef = this.dialog.open(InformationDialogComponent, {
      width: '300px',
      disableClose: false,
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /* show information */
  changeSensor(target) {
    const data = target.data(),
      position = target.position()

    const dialogRef = this.dialog.open(ChangeSensorDialogComponent, {
      width: '230px',
      height: '300px',
      disableClose: true,
      data: {
        sensorsNotInLayout: this.sensorsNotInLayout
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateSensor(position, data, result);
        this.filter();
      }
    });
  }

  /* change sensor*/
  updateSensor(positionSource, sensorSource, sensorTarget) {
    this.sensorsInLayout.push({
      id: sensorTarget.id,
      sensorName: sensorTarget.sensorName,
      sensorType: sensorTarget.sensorType,
      posX: positionSource.x,
      posY: positionSource.y,
      macAddress: sensorTarget.macAddress,
    });
    this.deleteSensor(sensorSource);
    this.removeSensor(sensorTarget);
    this.generateLayout();
  }




















  generateLayout() {
    /* init size */
    // this.config.width = $("#cy").width();
    // this.config.height = $("#cy").height();

    /* init layout */
    this.cy = cytoscape({
      container: $('#cy'),
      elements: this.configElements(),
      style: this.configStyle(),
      layout: this.configLayout(),
      /* config zoom */
      wheelSensitivity: this.config.wheelSensitivity,
      zoomingEnabled: this.config.zoomEnable,
      minZoom: this.config.minZoom,
      maxZoom: this.config.maxZoom,
    });

    /* init event*/
    this.configContextMenus();
    this.initEvent();
    this.cy.viewport({
      zoom: this.config.curentZoom ? this.config.curentZoom : this.cy.zoom()
    });
    $('.setPosContextMenu').css({
      'display': 'none',
    })
  }

  /* config node data */
  configElements() {
    let elements = [
      /* node parent */
      {
        group: 'nodes',
        data: {
          id: 'nparent',
          sensorName: '',
          sensorType: '',
          macAddress: '',
          parent: ''
        },
        locked: true,
        classes: 'node-parent'
      },
      /* free node */
      {
        group: 'nodes',
        data: { id: 'nfree1', parent: 'nparent', },
        position: this.positionNodeFree1,
        classes: 'node-free',
        locked: true,
      },
      {
        group: 'nodes',
        data: { id: 'nfree2', parent: 'nparent' },
        position: { x: this.config.width + this.positionNodeFree1.x, y: this.config.height + this.positionNodeFree1.y },
        classes: 'node-free',
        locked: true,
      }
    ];

    /* generate node */
    this.sensorsInLayout.forEach(item => {
      elements.push({
        group: 'nodes',
        data: {
          id: item.id.toString(),
          sensorName: item.sensorName,
          sensorType: item.sensorType,
          macAddress: item.macAddress,
          parent: 'nparent'
        },
        position: {
          x: item.posX,
          y: item.posY
        },
        classes: 'node-sensor',
        locked: false,
      });
    });
    return elements;
  }

  /* config style fo node */
  configStyle() {
    const styles = [
      {
        selector: '#nparent',
        style: {
          'background-image': this.data.base64,
          // 'background-width': this.config.width,
          // 'background-height': this.config.height,
          'width': this.config.width,
          'height': this.config.height,
        },
      },
      {
        selector: '.node-sensor',
        style: {
          'background-image': 'url("assets/img/sensor.png")',
          'shape': 'rectangle',
          'width': this.config.sizeNode,
          'height': this.config.sizeNode,
          'background-width': this.config.sizeNode,
          'background-height': this.config.sizeNode,
          'content': 'data(sensorName)',
          'font-size': '9'
        }
      },
      {
        selector: '.node-free',
        style: {
          'opacity': '0',
          'width': 1,
          'height': 1,
        }
      }
    ];
    return styles;
  }

  /* config layout */
  configLayout() {
    let layout = {
      name: 'preset',
    }
    return layout;
  }

  /* config contextMenus */
  configContextMenus() {
    const options = {
      menuItems: [
        {
          id: 'information',
          content: this.contextMenu["tags.setupSensorPlacement.information"],
          openMenuEvents: 'cxttap',
          selector: 'node.node-sensor',
          onClickFunction: (event) => {
            this.showInformation(event.target.data());
          }
        }, {
          id: 'change',
          content: this.contextMenu["tags.setupSensorPlacement.change"],
          openMenuEvents: 'cxttap',
          selector: 'node.node-sensor',
          disabled: this.sensorsNotInLayout.length == 0,
          onClickFunction: (event) => {
            this.changeSensor(event.target);
            this.generateLayout();
          }
        }, {
          id: 'delete',
          content: this.contextMenu["tags.setupSensorPlacement.delete"],
          openMenuEvents: 'cxttap',
          selector: 'node.node-sensor',
          onClickFunction: (event) => {
            this.deleteBuildingConfirm(event.target.data());
            this.generateLayout();
            this.filter();
          }
        }
      ],
      // css classes that menu items will have
      menuItemClasses: [
        // add class names to this list
      ],
      // css classes that context menu will have
      contextMenuClasses: ['setPosContextMenu']
    };
    // options.menuItems.forEach((item, index)=>{
    //   item.content = this.listTitle[index];
    // })
    this.cy.contextMenus(options);
  }

  /* event  */
  initEvent() {
    /* drag */
    this.cy.nodes().on('drag', '.node-sensor', (e) => {
      this.updatePositionSensor(e.target.data(), e.target.position());
    });

    /* zoom */
    this.cy.on('zoom', (event) => {
      this.config.curentZoom = this.cy.zoom();
      this.cy.viewport({
        pan: this.config.pan
      });
    });
  }

  updatePositionSensor(data, position) {
    /* find sensor */
    const sensor = this.sensorsInLayout.find((e) => {
      return e.id == data.id;
    })
    /* update positon */
    sensor.posX = position.x;
    sensor.posY = position.y;
  }
}
