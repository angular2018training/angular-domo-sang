import { Component, OnInit, Input } from '@angular/core';
import { CHART_COLORS } from './../../../core/constants/chart.constant';
import { ChartService } from './../../chart.service';
import { API_CONFIGURATION } from '../../../core/constants/server.constant';
import { CHART_ID } from '../../../core/constants/chart.constant';
import { D3Utils } from '../../chart.util';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'ch002',
  templateUrl: './ch002.component.html',
  styleUrls: ['./ch002.component.scss']
})
export class Ch002Component implements OnInit {
  @Input() floorId;
  @Input() clientBusinessUnitId;
  @Input() buildingId;
  @Input() clientId;
  @Input() fromDate;
  @Input() toDate;
  @Input() showDescription;

  data : any = null;
  isCustomized : boolean = false;

  stackedBar = {
    data: {
        data: [],
        key: null,
        customizeData: [],
        keys: null,
    },
    chartId: 'ch002',
    config: {
      width: 800,
      height: 300,
      margin: {top: 20, right: 80, bottom: 200, left: 40},
      color: [
        CHART_COLORS.COLOR6.BLUE[1],
        CHART_COLORS.COLOR6.BLUE[2],
        CHART_COLORS.COLOR6.BLUE[7],
      ],
      padding: {inner: 0.1, outer: 0, align: 0},
      barSpace: 3,
    }
  }
  constructor(private chartService: ChartService) { }

  ngOnChanges() {
    this.getChartData();
  }

  ngOnInit() {}

  ngAfterViewChecked() {
    if (d3.select("svg#" + this.stackedBar.chartId).empty())
      return;
    if (!this.isCustomized) {
      this.customizeLegend();
      this.drawBorder();
      this.isCustomized = true;
    }
  }

  getChartData() {
    if (!this.floorId || !this.fromDate || !this.toDate) {
        return;
    }
    let body = {
        type: 2,
        floorId: this.floorId,//this.floorId,//8203
        clientBusinessUnitId: this.clientBusinessUnitId,
        fromDate: this.fromDate, //"2018-03-03 10:00:00", //this.fromDate,
        toDate: this.toDate //"2018-03-03 10:00:00", //this.toDate //'2018-04-24 00:00:00'
      }
    if (!body.clientBusinessUnitId) {
      delete body.clientBusinessUnitId;
    }
    this.chartService.getChartData(API_CONFIGURATION.URLS.CHART.CH002, body).then(response => {
      if (response) {
            if (!response) response = this.getExampleData();
            this.data = _.cloneDeep(response);
            this.stackedBar.data.data = [];
            //Set data
            this.stackedBar.data.key = "Seat";

            let selectedKeys = ["rateOfAnchoredSeat", "rateOfSemiMobileSeat", "rateOfMobileSeat"];
            this.stackedBar.data.keys = selectedKeys;

            this.stackedBar.data.data.push(response);
            this.stackedBar.data.data.forEach(d => {
                D3Utils.getListKeys(this.stackedBar.data.data, selectedKeys).forEach (key => delete d[key]);
            })
            this.stackedBar.data.customizeData = [
              {
                key: 'rateOfMobileSeat',
                displayName: 'Mobile Seats',
                count: this.data.numberOfMobileSeat
              },
              {
                key: 'rateOfSemiMobileSeat',
                displayName: 'Semi Mobile Seats',
                count: this.data.numberOfSemiMobileSeat
              },
              {
                key: 'rateOfAnchoredSeat',
                displayName: 'Anchored Seats',
                count: this.data.numberOfAnchoredSeat
              },
            ]
        }
    });
  }

  private customizeLegend() : void {
    let me = this;
    let texts = d3.select("svg#" + this.stackedBar.chartId).selectAll(".legend").selectAll('text')['_groups'][0];
    let listElement = [];
    [].forEach.call(texts, function(element, i) {
      listElement.push(element);
    });

    listElement.reverse().forEach((element, i) => {
      element.textContent = me.stackedBar.data.data[0][me.stackedBar.data.customizeData[i].key] + '% ' + element.textContent + ' (' + me.stackedBar.data.customizeData[i].count + ')';
    })
  }

  private drawBorder() : void {
    let chart = d3.select("svg#" + this.stackedBar.chartId).select(".chart");
    let chartBounding = (chart.node() as Element).getBoundingClientRect();
    chart.append('rect')
         .attr('x', -3)
         .attr('y', -3)
         .attr('width', chartBounding['width'] + 6)
         .attr('height', chartBounding['height'] + 6)
         .style("stroke", "grey")
         .style("fill", "none")
         .style("stroke-width", "1");
  }

  private getExampleData() : any {
      return {
        "totalAssignedSeat": 4,
        "numberOfMobileSeat": 2,
        "rateOfMobileSeat": 50,
        "numberOfSemiMobileSeat": 1,
        "rateOfSemiMobileSeat": 25,
        "numberOfAnchoredSeat": 1,
        "rateOfAnchoredSeat": 25
    };
  }
}
