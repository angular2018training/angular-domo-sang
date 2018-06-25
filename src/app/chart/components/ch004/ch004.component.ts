import { Component, OnInit, Input } from '@angular/core';
import { CHART_COLORS } from './../../../core/constants/chart.constant';
import { ChartService } from './../../chart.service';
import { API_CONFIGURATION } from '../../../core/constants/server.constant';
import { CHART_ID } from '../../../core/constants/chart.constant';
import { D3Utils } from '../../chart.util';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'ch004',
  templateUrl: './ch004.component.html',
  styleUrls: ['./ch004.component.scss']
})
export class Ch004Component implements OnInit {
  @Input() floorId;
  @Input() buildingId;
  @Input() clientId;
  @Input() clientBusinessUnitId;
  @Input() fromDate;
  @Input() toDate;
  @Input() showDescription;

  data : any = null;
  isCustomized : boolean = false;

  stackedBar = {
    data: {
        data: [],
        key: null,
        customizeData: []
    },
    chartId: 'ch004',
    config: {
      width:800,
      height: 400,
      margin: {top: 20, right: 80, bottom: 150, left: 40},
      color: [
        CHART_COLORS.COLOR6.BLUE[1],
        CHART_COLORS.COLOR6.BLUE[2],
        CHART_COLORS.COLOR6.BLUE[7],
      ],
      padding: {
        inner: 0.1,
        outer: 0,
        align: 0
      }
    }
  }
  constructor(private chartService: ChartService) { }

  ngOnChanges() {
    this.getChartData();
  }

  ngAfterViewChecked() {
    if (d3.select("svg#" + this.stackedBar.chartId).empty())
      return;
    if (!this.isCustomized) {
      this.customizeXAxis();
      this.drawBorder();
      this.isCustomized = true;
    }
  }

  ngOnInit() {}

  getChartData() {
    if (!this.floorId || !this.fromDate || !this.toDate) {
        return;
    }

    let body = {
        type: 4,
        floorId: this.floorId, //22946,//8001
        clientBusinessUnitId: this.clientBusinessUnitId,
        buildingId: this.buildingId,
        clientId: this.clientId,
        fromDate:  this.fromDate,//"2018-03-03 00:00:00",
        toDate: this.toDate,//"2018-04-24 00:00:00" //'2018-04-24 00:00:00'
    }

    if (!body.clientBusinessUnitId) {
      delete body.clientBusinessUnitId;
    }
    this.chartService.getChartData(API_CONFIGURATION.URLS.CHART.CH004, body).then(response => {
        if (response) {
          if (response.utilisationOfWorkPoints.length == 0) response = this.getExampleData()
          this.data = _.cloneDeep(response.utilisationOfWorkPoints);

          this.stackedBar.data.data = [];
          //Set data
          this.stackedBar.data.key = "businessUnit";

          let selectedKeys = ["businessUnit", "rateEmptyFullHalfDayAway", "rateIntermitentAway", "rateOccupied"];
          response.utilisationOfWorkPoints.forEach(element => {
                  this.stackedBar.data.data.push(element);
          });
          this.stackedBar.data.data.forEach(d => {
              D3Utils.getListKeys(this.stackedBar.data.data, selectedKeys).forEach (key => delete d[key]);
          })
          this.stackedBar.data.customizeData = [
            {
              key: 'rateOccupied',
              displayName: 'Occupied'
            },
            {
              key: 'rateIntermitentAway',
              displayName: 'Intermittently Away'
            },
            {
              key: 'rateEmptyFullHalfDayAway',
              displayName: 'Empty / Full Day Away/ Half Day Away'
            },
          ];
        }
    });
  }

  private customizeXAxis() : void {
    //Customize Axis Text
    let me = this;
    let texts = d3.select("svg#" + this.stackedBar.chartId).select(".x-axis").selectAll('text')['_groups'][0];
    let listElement = [];
    let maxLength = 0;
    [].forEach.call(texts, function(element, i) {
      listElement.push(element);
    });

    listElement.reverse().forEach((element) => {
      if (element.textContent.length > maxLength) maxLength = element.textContent.length;
      element.textContent += "(" + this.data[this.data.findIndex(x => x.businessUnit === element.textContent)].numberOfWorkPoint + ")";
    })

    //Custom x-axis
    let dy = (maxLength >= 10 ? 2 : 1) + "em";
    d3.select("svg#" + this.stackedBar.chartId).select(".x-axis").select('path').remove();
    d3.select("svg#" + this.stackedBar.chartId).select(".x-axis")
                .selectAll('text')
                .attr("transform", "rotate(-45)")
                .attr('fill', '#616362')
                .attr('dy', dy)
                .attr('dx', '-2em');
  }

  private drawBorder() : void {
    let rateEmptyFullHalfDayAway = d3.select("svg#" + this.stackedBar.chartId).select(".rateEmptyFullHalfDayAway");
    let rateOccupied = d3.select("svg#" + this.stackedBar.chartId).select(".rateOccupied");
    let width = (rateEmptyFullHalfDayAway.node() as Element).getBoundingClientRect().width;
    let y1 = 0; let y2 = 0;

    [].forEach.call(rateOccupied.selectAll('rect')['_groups'][0], function(element, i) {
      if (i == 0) y1 = element.getAttribute('height');
      if (element.getAttribute('y') < y1)
        y1 = element.getAttribute('y');
    });

    [].forEach.call(rateEmptyFullHalfDayAway.selectAll('rect')['_groups'][0], function(element) {
      if ((element.getAttribute('y') + element.getAttribute('height')) > y2)
        y2 = (+element.getAttribute('y') + +element.getAttribute('height'));
    });

    rateOccupied.append('line')
         .attr('x1', 0)
         .attr('y1', y1)
         .attr('x2', width)
         .attr('y2', y1)
         .style("stroke", "#616362")
         .style("stroke-width", "3");
    rateEmptyFullHalfDayAway.append('line')
         .attr('x1', 0)
         .attr('y1', y2)
         .attr('x2', width)
         .attr('y2', y2)
         .style("stroke", "#616362")
         .style("stroke-width", "3");
  }

  private getExampleData() : any {
    return {
      "utilisationOfWorkPoints": [
        {
          "businessUnit": "CFG",
          "numberOfWorkPoint": 1,
          "rateEmptyFullHalfDayAway": 39,
          "rateIntermitentAway": 8,
          "rateOccupied": 53
        },
        {
          "businessUnit": "CORP",
          "numberOfWorkPoint": 2,
          "rateEmptyFullHalfDayAway": 82,
          "rateIntermitentAway": 7,
          "rateOccupied": 11
        },
        {
          "businessUnit": "CS",
          "numberOfWorkPoint": 6,
          "rateEmptyFullHalfDayAway": 51,
          "rateIntermitentAway": 9,
          "rateOccupied": 40
        },
        {
          "businessUnit": "F&A",
          "numberOfWorkPoint":4,
          "rateEmptyFullHalfDayAway": 50,
          "rateIntermitentAway": 40,
          "rateOccupied": 10
        },
        {
          "businessUnit": "HCG",
          "numberOfWorkPoint":5,
          "rateEmptyFullHalfDayAway": 53,
          "rateIntermitentAway": 10,
          "rateOccupied": 37
        },
        {
          "businessUnit": "ICO",
          "numberOfWorkPoint": 6,
          "rateEmptyFullHalfDayAway": 54,
          "rateIntermitentAway": 7,
          "rateOccupied": 39
        },
        {
          "businessUnit": "ICTB",
          "numberOfWorkPoint": 7,
          "rateEmptyFullHalfDayAway": 57,
          "rateIntermitentAway": 10,
          "rateOccupied": 33
        },
        {
          "businessUnit": "IPB",
          "numberOfWorkPoint": 8,
          "rateEmptyFullHalfDayAway": 60,
          "rateIntermitentAway": 30,
          "rateOccupied": 10
        },
        {
          "businessUnit": "LECO",
          "numberOfWorkPoint": 9,
          "rateEmptyFullHalfDayAway": 30,
          "rateIntermitentAway": 20,
          "rateOccupied": 50
        },
        {
          "businessUnit": "PB",
          "numberOfWorkPoint": 10,
          "rateEmptyFullHalfDayAway": 35,
          "rateIntermitentAway": 25,
          "rateOccupied": 40
        },
        {
          "businessUnit": "RD",
          "numberOfWorkPoint": 11,
          "rateEmptyFullHalfDayAway": 30,
          "rateIntermitentAway": 40,
          "rateOccupied": 30
        },
        {
          "businessUnit": "RSB",
          "numberOfWorkPoint": 12,
          "rateEmptyFullHalfDayAway": 70,
          "rateIntermitentAway": 10,
          "rateOccupied": 20
        },
        {
          "businessUnit": "SIB",
          "numberOfWorkPoint": 13,
          "rateEmptyFullHalfDayAway": 75,
          "rateIntermitentAway": 5,
          "rateOccupied": 20
        },
        {
          "businessUnit": "ABC",
          "numberOfWorkPoint": 14,
          "rateEmptyFullHalfDayAway": 15,
          "rateIntermitentAway": 25,
          "rateOccupied": 60
        },
        {
          "businessUnit": "DEF",
          "numberOfWorkPoint": 15,
          "rateEmptyFullHalfDayAway": 75,
          "rateIntermitentAway": 15,
          "rateOccupied": 10
        },
        {
          "businessUnit": "HNF",
          "numberOfWorkPoint": 16,
          "rateEmptyFullHalfDayAway": 10,
          "rateIntermitentAway": 80,
          "rateOccupied": 10
        },
      ]
    }
  }
}
