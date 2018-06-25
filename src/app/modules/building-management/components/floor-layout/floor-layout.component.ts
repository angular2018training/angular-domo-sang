import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as $ from 'jquery';
import { BuildingManagementService } from "../../building-management.service";
import { UtilitiesService } from "../../../../core/services/utilities.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-floor-layout',
  templateUrl: './floor-layout.component.html',
  styleUrls: ['./floor-layout.component.scss']
})
export class FloorLayoutComponent implements OnInit {
  @ViewChild('search') searchEle: ElementRef;
  buildingId = Number(this.activatedRoute.snapshot.queryParams['buildingId']);
  clientId = Number(this.activatedRoute.snapshot.queryParams['clientId']);
  @Input() floorId: any;
  cy: any;
  dragEvent = null;
  config = {
    width: 0,
    height: 0,
    sizeNode: 30,
    zoomEnable: true,
    curentZoom: 1,
    minZoom: 0.2,
    maxZoom: 2,
    wheelSensitivity: 0.05,
    pan: {
      x: 10,
      y: 10
    },
  }
  sensorsInLayout = [];
  /* data temp */
  data = {
    base64: ''
  }
  /* end */

  constructor(
    private _BuildingManagementService: BuildingManagementService,
    private _UtilitiesService: UtilitiesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.floorId) {
      this.getSensorList();
    }
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
    return this._BuildingManagementService.getSensorsPlace(this.floorId, params).then(result => {
      if (result) {
        this.data = result;
        this.sensorsInLayout = result.sensorsInLayout;
        this.config.height = result.imageHeight;
        this.config.width = result.imageWidth;
        setTimeout(() => {
          this.generateLayout();
        }, 200);
      }
    });
  }
  editSensorPlacement() {
    this.router.navigate(['/setup-sensor-placement'], { queryParams: { clientId: this.clientId, floorId: this.floorId, buildingId: this.buildingId } });
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
    // this.initEvent();
    this.ungrabifyNode();
    this.cy.viewport({
      // pan: { x: 0, y: 0 },
      zoom: this.cy.zoom()
    });
  }

  /* config node data */
  /* config node data */
  configElements() {
    let elements = [];
    if (this.data.base64) {
      elements = [
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
          locked: false,
          classes: 'node-parent',
          position: { x: 0, y: 0 }
        },
        {
          group: 'nodes',
          data: { id: 'nfree1', parent: 'nparent', },
          position: { x: 0, y: 0 },
          classes: 'node-free',
          locked: false,
        },
        {
          group: 'nodes',
          data: { id: 'nfree2', parent: 'nparent' },
          position: { x: this.config.width, y: this.config.height },
          classes: 'node-free',
          locked: false,
        }
      ];
    }

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
          'width': this.config.width,
          'height': this.config.height,
        }
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
      pan: this.config.pan,
      // layoutDimensions: false
    }
    return layout;
  }

  /* init Event */
  initEvent() {
    this.cy.on('zoom', (event) => {
      if (event.target.zoom() == event.target.minZoom()) {
        // this.cy.center();
      }
    });
  }
  /* Disallow the user to grab the nodes. */
  ungrabifyNode() {
    this.cy.nodes().nonorphans()
      .on('grab', function () {
        this.ungrabify();
      })
      .on('free', function () {
        this.grabify();
      });
  }
}
