import { ChartService } from './../../chart.service';
import { Component, OnInit, Input } from '@angular/core';
import { API_CONFIGURATION } from '../../../core/constants/server.constant';
import { CHART_ID, CHART_COLORS } from '../../../core/constants/chart.constant';

@Component({
    selector: 'ch006',
    templateUrl: './ch006.component.html',
    styleUrls: ['./ch006.component.scss']
})
export class Ch006Component implements OnInit {

    @Input() floorId;
    @Input() clientBusinessUnitId?;
    @Input() fromDate;
    @Input() toDate;
    @Input() clientId;
    @Input() buildingId;

    title = CHART_ID.CH006.TITLE;

    color = {
        above: CHART_COLORS.COLOR6.ORANGE[2],
        below: CHART_COLORS.COLOR6.ORANGE[4]
    }

    progressCharts = [];
    meetingRoomRateList;

    calledAPI = false;

    constructor(private chartService: ChartService) { }

    ngOnInit() {
    }

    ngOnChanges() {
        if (!this.calledAPI) {
            this.getChartData();
        }
    }

    getConfig(label, progressColor) {
        return {
            title: {
                fontSize: 20,
                label: label,
                color: CHART_COLORS.COLOR6.ORANGE[6]
            },
            label: {
                fontSize: 30,
                color: this.color.below
            },
            width: '100%',
            height: '100px',
            progressColor: progressColor,
            unprogressColor: CHART_COLORS.COLOR6.ORANGE[6],
            margin: {
                top: 20,
                right: 30,
                bottom: 30,
                left: 30
            },
            strokeWidth: 8,
            legend: {
                show: false
            }
        }
    }

    getChartData() {
        if (!this.floorId || !this.fromDate || !this.toDate) {
            return;
        }

        let body = {
            type: 6,
            floorId: this.floorId,
            buildingId: this.buildingId,
            clientId: this.clientId,
            clientBusinessUnitId: this.clientBusinessUnitId,
            fromDate: this.fromDate,
            toDate: this.toDate
            // "type": 6,
            // "floorId": 27830,
            // clientBusinessUnitId: this.clientBusinessUnitId,
            // "fromDate": "2018-03-27 00:00:00",
            // "toDate": "2018-04-06 23:59:59"
        }

        if (!body.clientBusinessUnitId) {
            delete body.clientBusinessUnitId;
        }

        this.calledAPI = true;
        this.chartService.getChartData(API_CONFIGURATION.URLS.CHART.CH901, body).then((respone: any) => {
            if (respone) {
                respone = respone.meetingRoomRateList.length > 0 ? respone : {
                    "meetingRoomRateList": [
                        {
                            "meetingRoomType": "1 - 4 Pax",
                            "count": 2,
                            "optimalRate": 50,
                            "occupyRate": 50
                        },
                        {
                            "meetingRoomType": "5 - 8 Pax",
                            "count": 4,
                            "optimalRate": 65,
                            "occupyRate": 55
                        },
                        {
                            "meetingRoomType": "9 - 12 Pax",
                            "count": 6,
                            "optimalRate": 25,
                            "occupyRate": 45
                        },
                        {
                            "meetingRoomType": "13 Pax",
                            "count": 7,
                            "optimalRate": 85,
                            "occupyRate": 75
                        }
                    ]
                }

                this.meetingRoomRateList = respone.meetingRoomRateList;

                this.progressCharts = [];

                if (respone.meetingRoomRateList && respone.meetingRoomRateList.length > 0) {
                    respone.meetingRoomRateList.forEach((element, i) => {
                        this.progressCharts.push({
                            above: {
                                data: [
                                    {
                                        label: 'UP',
                                        value: element.occupyRate
                                    }
                                ],
                                chartId: 'progressChart_' + i,
                                config: this.getConfig(element.meetingRoomType + ' (' + element.count + ')', this.color.above)
                            },
                            below: {
                                data: [
                                    {
                                        label: 'UP',
                                        value: element.optimalRate
                                    }
                                ],
                                chartId: 'progressChart_' + i,
                                config: this.getConfig(element.meetingRoomType + ' (' + element.count + ')', this.color.below)
                            }
                        });
                    });
                }
            }
        });

    }

}
