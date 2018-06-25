import { Component, OnInit, Input } from '@angular/core';
import { CHART_COLORS } from './../../../core/constants/chart.constant';
import { ChartService } from './../../chart.service';
import { API_CONFIGURATION } from '../../../core/constants/server.constant';
import { CHART_ID } from '../../../core/constants/chart.constant';
import { D3Utils } from '../../chart.util';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'ch008',
  templateUrl: './ch008.component.html',
  styleUrls: ['./ch008.component.scss']
})
export class Ch008Component implements OnInit {
  @Input() floorId;
  @Input() buildingId;
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
        customizeData: [],
        keys: null
    },
    chartId: 'ch008',
    config: {
      width:800,
      height: 400,
      margin: {top: 20, right: 50, bottom: 150, left: 80},
      color: [
        CHART_COLORS.COLOR6.ORANGE[2],
        CHART_COLORS.COLOR6.ORANGE[4],
        CHART_COLORS.COLOR6.ORANGE[6],
      ],
      textColor: ["#000000", "#ffffff", "#ffffff"],
      padding: {inner: 0.2, outer: 0, align: 0.5},
      yAxis: true,
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
      this.customizeYAxis();
      this.customizeBar();
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
        type: 8,
        floorId: this.floorId,//8001
        buildingId: this.buildingId,
        clientBusinessUnitId: this.clientBusinessUnitId,
        fromDate: this.fromDate,
        toDate: this.toDate //'2018-04-24 00:00:00'
    }

    if (!body.clientBusinessUnitId) {
      delete body.clientBusinessUnitId;
    }
    let response = this.getExampleData();
    this.chartService.getChartData(API_CONFIGURATION.URLS.CHART.CH008, body).then(response => {
        if (response) {
            if (response.meetingRoomRateList.length == 0) response = this.getExampleData();
            this.data = _.cloneDeep(response.meetingRoomRateList);
            this.stackedBar.data.data = [];

            //Set data
            response.meetingRoomRateList.forEach(data => {
                  data["notOptimalRate"] = 100 - data.optimalRate - data.suboptimalRate;
            });
            this.stackedBar.data.data = [];
            //Set data
            this.stackedBar.data.key = "meetingRoomType";
            let selectedKeys = ["meetingRoomType", "optimalRate", "suboptimalRate", "notOptimalRate"];
            this.stackedBar.data.keys = selectedKeys;
            response.meetingRoomRateList.forEach(element => {
                      this.stackedBar.data.data.push(element);
              });
            this.stackedBar.data.data.reverse(); //Sort data
            this.stackedBar.data.data.forEach(d => {
                D3Utils.getListKeys(this.stackedBar.data.data, selectedKeys).forEach (key => delete d[key]);
            })
            this.stackedBar.data.customizeData = [
              {
                key: 'notOptimalRate',
                displayName: 'Not Optimal'
              },
              {
                key: 'suboptimalRate',
                displayName: 'Suboptimal'
              },
              {
                key: 'optimalRate',
                displayName: 'Optimal'
              },
            ];
        }
    });
  }

  private getExampleData() : any {
    return {
    "meetingRoomRateList" : [
      {
        "meetingRoomType": "1-2pax",
        "count": 1,
        "optimalRate": 30,
        "suboptimalRate": 50,
      },
      {
        "meetingRoomType": "3-4pax",
        "count": 2,
        "optimalRate": 10,
        "suboptimalRate": 60
      },
      {
        "meetingRoomType": "5-6pax",
        "count": 3,
        "optimalRate": 60,
        "suboptimalRate": 30
      },
      {
        "meetingRoomType": "7-8pax",
        "count": 4,
        "optimalRate": 80,
        "suboptimalRate": 10
      },
      {
        "meetingRoomType": "9-12pax",
        "count": 3,
        "optimalRate": 60,
        "suboptimalRate": 30
      },
      {
        "meetingRoomType": "13-pax",
        "count": 4,
        "optimalRate": 80,
        "suboptimalRate": 10
      },
    ]}};

  private customizeYAxis() : void {
    //Customize Axis Text
    let me = this;
    let texts = d3.select("svg#" + this.stackedBar.chartId).select(".y-axis").selectAll('text')['_groups'][0];
    let listElement = [];
    [].forEach.call(texts, function(element, i) {
      listElement.push(element);
    });

    listElement.reverse().forEach((element) => {
      element.textContent += " (" + this.data[this.data.findIndex(x => x.meetingRoomType === element.textContent)].count + ")";
    })

    //Custom x-axis
    d3.select("svg#" + this.stackedBar.chartId).select(".y-axis").select('path').remove();
    d3.select("svg#" + this.stackedBar.chartId).select(".y-axis")
                .selectAll('text')
                .attr('fill', '#616362')
                .attr('dy','2')
  }

  private drawBorder() : void {
    let optimalRate = d3.select("svg#" + this.stackedBar.chartId).select(".optimalRate");
    let notOptimalRate = d3.select("svg#" + this.stackedBar.chartId).select(".notOptimalRate");
    let height = (notOptimalRate.node() as Element).getBoundingClientRect().height;
    let x1 = 0; let x2 = 0;

    [].forEach.call(optimalRate.selectAll('rect')['_groups'][0], function(element, i) {
      if (i == 0) x1 = element.getAttribute('width');
      if (element.getAttribute('x') < x1)
        x1 = element.getAttribute('x');
    });

    [].forEach.call(notOptimalRate.selectAll('rect')['_groups'][0], function(element) {
      if ((element.getAttribute('x') + +element.getAttribute('width')) > x2)
        x2 = (+element.getAttribute('x') + +element.getAttribute('width'));
    });

    optimalRate.append('line')
         .attr('x1', x1)
         .attr('y1', 0)
         .attr('x2', x1)
         .attr('y2', height)
         .style("stroke", "#616362")
         .style("stroke-width", "3");
    notOptimalRate.append('line')
         .attr('x1', x2)
         .attr('y1', 0)
         .attr('x2', x2)
         .attr('y2', height)
         .style("stroke", "#616362")
         .style("stroke-width", "3");
  }

  private customizeBar() : void {
    let rects = d3.selectAll('.optimalRate').selectAll('rect');
    let listBar = rects['_groups'][0];
    let listWidth = [];
    let listHeight = [];
    let listX = [];
    let listY = [];
    let parent = this;

    [].forEach.call(listBar, function(element) {
      listWidth.push(element['attributes']['width'].value);
      listHeight.push(element['attributes']['height'].value);
      listX.push(element['attributes']['x'].value);
      listY.push(element['attributes']['y'].value);
    });
    rects.each(function(p, i) {
      d3.select("svg#" + parent.stackedBar.chartId).select('g').select('g.chart').select('g.optimalRate').append('line')
          .attr("x1", (+listX[i] + +listWidth[i])-2)
          .attr("y1", +listY[i] - 6)
          .attr("x2",  (+listX[i] + +listWidth[i])-2)
          .attr("y2", (+listY[i] + +listHeight[i] + 6))
          .attr("stroke", CHART_COLORS.COLOR6.BLUE[1])
          .attr("stroke-width", 5);
    })

    d3.select("svg#" + this.stackedBar.chartId).append('text')
    .attr('x', -(this.stackedBar.config.height/2))
    .attr('y', 10)
    .attr('transform', 'rotate(-90)')
    .text('Average Utilization')
  }
}
