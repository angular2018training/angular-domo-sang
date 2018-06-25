import { CHART_COLORS } from './../../../core/constants/chart.constant';
import { ChartService } from './../../chart.service';
import { Component, OnInit, Input } from '@angular/core';
import { API_CONFIGURATION } from '../../../core/constants/server.constant';
import { CHART_ID } from '../../../core/constants/chart.constant';

@Component({
    selector: 'ch901',
    templateUrl: './ch901.component.html',
    styleUrls: ['./ch901.component.scss']
})
export class Ch901Component implements OnInit {

    @Input() floorId;
    @Input() clientBusinessUnitId?;
    @Input() fromDate;
    @Input() toDate;
    @Input() clientId;
    @Input() buildingId;

    heatMap = {
        data: [],
        imgChart: null,
        chartId: 'heatMap',
        config: {
            rectSize: {
                // Percent
                width: 2.7,
                height: 7
            },
            rangeColor: [
                {
                    maxValue: 50,
                    minValue: 0,
                    label: 'Less than 50%',
                    color: CHART_COLORS.HEAT_COLOR.LOW_UTILIZATION
                },
                {
                    maxValue: 70,
                    minValue: 50,
                    label: '50% ~ 69%',
                    color: CHART_COLORS.HEAT_COLOR.MID_UTILIZATION
                },
                {
                    maxValue: 100,
                    minValue: 70,
                    label: 'More than 70%',
                    color: CHART_COLORS.HEAT_COLOR.HIGH_UTILIZATION
                }
            ],
            legend: {
                show: true
            },
            blur: 7,
            title: CHART_ID.CH901.TITLE
        }
    }

    calledAPI = false;

    constructor(private chartService: ChartService) { }

    ngOnInit() {
    }

    ngOnChanges() {
        if (!this.calledAPI) {
            this.getChartData();
        }
    }

    getChartData() {
        if (!this.floorId || !this.fromDate || !this.toDate) {
            return;
        }

        let body = {
            type: 901,
            floorId: this.floorId,//22946
            buildingId: this.buildingId,
            clientId: this.clientId,
            clientBusinessUnitId: this.clientBusinessUnitId,
            fromDate: this.fromDate,
            toDate: this.toDate //'2018-04-24 00:00:00'
        }

        if (!body.clientBusinessUnitId) {
            delete body.clientBusinessUnitId;
        }

        this.calledAPI = true;

        this.chartService.getChartData(API_CONFIGURATION.URLS.CHART.CH901, body).then(respone => {
            if (respone) {
                respone.sensors = respone.sensors && respone.sensors.length > 0 ? respone.sensors : [{
                    "posX": 210,
                    "posY": 138,
                    "rate": 10
                },
                {
                    "posX": 210,
                    "posY": 181,
                    "rate": 20
                },
                {
                    "posX": 182,
                    "posY": 181,
                    "rate": 30
                },
                {
                    "posX": 210,
                    "posY": 229,
                    "rate": 40
                },
                {
                    "posX": 209,
                    "posY": 274,
                    "rate": 50
                },
                {
                    "posX": 180,
                    "posY": 275,
                    "rate": 10
                },
                {
                    "posX": 249,
                    "posY": 276,
                    "rate": 60
                },
                {
                    "posX": 278,
                    "posY": 276,
                    "rate": 70
                },
                {
                    "posX": 279,
                    "posY": 229,
                    "rate": 80
                },
                {
                    "posX": 247,
                    "posY": 228,
                    "rate": 90
                },
                {
                    "posX": 246,
                    "posY": 181,
                    "rate": 100
                },
                {
                    "posX": 901,
                    "posY": 22946,
                    "rate": 10
                },
                {
                    "posX": 280,
                    "posY": 181,
                    "rate": 20
                },
                {
                    "posX": 278,
                    "posY": 137,
                    "rate": 30
                },
                {
                    "posX": 246,
                    "posY": 137,
                    "rate": 40
                },
                {
                    "posX": 316,
                    "posY": 135,
                    "rate": 50
                },
                {
                    "posX": 347,
                    "posY": 138,
                    "rate": 60
                },
                {
                    "posX": 901,
                    "posY": 22946,
                    "rate": 70
                },
                {
                    "posX": 347,
                    "posY": 183,
                    "rate": 80
                },
                {
                    "posX": 901,
                    "posY": 22946,
                    "rate": 90
                },
                {
                    "posX": 315,
                    "posY": 181,
                    "rate": 100
                },
                {
                    "posX": 315,
                    "posY": 229,
                    "rate": 10
                },
                {
                    "posX": 349,
                    "posY": 230,
                    "rate": 20
                },
                {
                    "posX": 348,
                    "posY": 274,
                    "rate": 30
                },
                {
                    "posX": 901,
                    "posY": 22946,
                    "rate": 40
                },
                {
                    "posX": 314,
                    "posY": 276,
                    "rate": 50
                },
                {
                    "posX": 387,
                    "posY": 276,
                    "rate": 60
                },
                {
                    "posX": 415,
                    "posY": 278,
                    "rate": 70
                },
                {
                    "posX": 416,
                    "posY": 231,
                    "rate": 80
                },
                {
                    "posX": 385,
                    "posY": 229,
                    "rate": 90
                },
                {
                    "posX": 386,
                    "posY": 184,
                    "rate": 100
                },
                {
                    "posX": 415,
                    "posY": 183,
                    "rate": 10
                },
                {
                    "posX": 416,
                    "posY": 137,
                    "rate": 20
                },
                {
                    "posX": 385,
                    "posY": 139,
                    "rate": 30
                },
                {
                    "posX": 451,
                    "posY": 137,
                    "rate": 40
                },
                {
                    "posX": 481,
                    "posY": 138,
                    "rate": 50
                },
                {
                    "posX": 481,
                    "posY": 182,
                    "rate": 60
                },
                {
                    "posX": 452,
                    "posY": 181,
                    "rate": 70
                },
                {
                    "posX": 452,
                    "posY": 227,
                    "rate": 80
                },
                {
                    "posX": 480,
                    "posY": 229,
                    "rate": 90
                },
                {
                    "posX": 481,
                    "posY": 274,
                    "rate": 100
                },
                {
                    "posX": 452,
                    "posY": 274,
                    "rate": 100
                },
                {
                    "posX": 518,
                    "posY": 274,
                    "rate": 100
                },
                {
                    "posX": 549,
                    "posY": 276,
                    "rate": 100
                },
                {
                    "posX": 550,
                    "posY": 231,
                    "rate": 100
                },
                {
                    "posX": 518,
                    "posY": 230,
                    "rate": 100
                },
                {
                    "posX": 519,
                    "posY": 182,
                    "rate": 100
                },
                {
                    "posX": 550,
                    "posY": 184,
                    "rate": 100
                },
                {
                    "posX": 552,
                    "posY": 136,
                    "rate": 100
                },
                {
                    "posX": 520,
                    "posY": 136,
                    "rate": 100
                },
                {
                    "posX": 585,
                    "posY": 135,
                    "rate": 100
                },
                {
                    "posX": 615,
                    "posY": 137,
                    "rate": 100
                },
                {
                    "posX": 615,
                    "posY": 183,
                    "rate": 100
                },
                {
                    "posX": 586,
                    "posY": 182,
                    "rate": 100
                },
                {
                    "posX": 586,
                    "posY": 229,
                    "rate": 100
                },
                {
                    "posX": 617,
                    "posY": 229,
                    "rate": 100
                },
                {
                    "posX": 617,
                    "posY": 275,
                    "rate": 100
                },
                {
                    "posX": 588,
                    "posY": 276,
                    "rate": 100
                },
                {
                    "posX": 138,
                    "posY": 162,
                    "rate": 100
                },
                {
                    "posX": 654,
                    "posY": 138,
                    "rate": 0
                },
                {
                    "posX": 684,
                    "posY": 137,
                    "rate": 0
                },
                {
                    "posX": 685,
                    "posY": 185,
                    "rate": 0
                },
                {
                    "posX": 655,
                    "posY": 183,
                    "rate": 0
                },
                {
                    "posX": 654,
                    "posY": 232,
                    "rate": 0
                },
                {
                    "posX": 683,
                    "posY": 230,
                    "rate": 0
                },
                {
                    "posX": 684,
                    "posY": 275,
                    "rate": 0
                },
                {
                    "posX": 654,
                    "posY": 273,
                    "rate": 0
                },
                {
                    "posX": 721,
                    "posY": 275,
                    "rate": 0
                },
                {
                    "posX": 750,
                    "posY": 276,
                    "rate": 0
                },
                {
                    "posX": 751,
                    "posY": 229,
                    "rate": 0
                },
                {
                    "posX": 719,
                    "posY": 228,
                    "rate": 0
                },
                {
                    "posX": 719,
                    "posY": 183,
                    "rate": 0
                },
                {
                    "posX": 749,
                    "posY": 182,
                    "rate": 0
                },
                {
                    "posX": 751,
                    "posY": 137,
                    "rate": 0
                },
                {
                    "posX": 720,
                    "posY": 135,
                    "rate": 0
                },
                {
                    "posX": 786,
                    "posY": 136,
                    "rate": 0
                },
                {
                    "posX": 817,
                    "posY": 135,
                    "rate": 0
                },
                {
                    "posX": 816,
                    "posY": 182,
                    "rate": 0
                },
                {
                    "posX": 788,
                    "posY": 182,
                    "rate": 0
                },
                {
                    "posX": 787,
                    "posY": 228,
                    "rate": 0
                },
                {
                    "posX": 818,
                    "posY": 228,
                    "rate": 0
                },
                {
                    "posX": 819,
                    "posY": 273,
                    "rate": 0
                },
                {
                    "posX": 788,
                    "posY": 272,
                    "rate": 0
                },
                {
                    "posX": 855,
                    "posY": 275,
                    "rate": 0
                },
                {
                    "posX": 884,
                    "posY": 278,
                    "rate": 0
                },
                {
                    "posX": 885,
                    "posY": 227,
                    "rate": 0
                },
                {
                    "posX": 852,
                    "posY": 228,
                    "rate": 0
                },
                {
                    "posX": 856,
                    "posY": 179,
                    "rate": 0
                },
                {
                    "posX": 885,
                    "posY": 182,
                    "rate": 0
                },
                {
                    "posX": 885,
                    "posY": 134,
                    "rate": 0
                },
                {
                    "posX": 852,
                    "posY": 134,
                    "rate": 0
                },
                {
                    "posX": 921,
                    "posY": 133,
                    "rate": 0
                },
                {
                    "posX": 953,
                    "posY": 136,
                    "rate": 0
                },
                {
                    "posX": 952,
                    "posY": 179,
                    "rate": 0
                },
                {
                    "posX": 919,
                    "posY": 178,
                    "rate": 0
                },
                {
                    "posX": 924,
                    "posY": 228,
                    "rate": 0
                },
                {
                    "posX": 951,
                    "posY": 227,
                    "rate": 0
                },
                {
                    "posX": 949,
                    "posY": 271,
                    "rate": 0
                },
                {
                    "posX": 920,
                    "posY": 275,
                    "rate": 0
                },
                {
                    "posX": 992,
                    "posY": 275,
                    "rate": 0
                },
                {
                    "posX": 1019,
                    "posY": 274,
                    "rate": 0
                },
                {
                    "posX": 1019,
                    "posY": 227,
                    "rate": 0
                },
                {
                    "posX": 987,
                    "posY": 225,
                    "rate": 0
                },
                {
                    "posX": 986,
                    "posY": 179,
                    "rate": 0
                },
                {
                    "posX": 1018,
                    "posY": 185,
                    "rate": 0
                },
                {
                    "posX": 1018,
                    "posY": 139,
                    "rate": 0
                },
                {
                    "posX": 994,
                    "posY": 139,
                    "rate": 0
                },
                {
                    "posX": 1054,
                    "posY": 136,
                    "rate": 0
                },
                {
                    "posX": 1085,
                    "posY": 135,
                    "rate": 0
                },
                {
                    "posX": 1084,
                    "posY": 181,
                    "rate": 0
                },
                {
                    "posX": 1056,
                    "posY": 181,
                    "rate": 0
                },
                {
                    "posX": 1057,
                    "posY": 229,
                    "rate": 0
                },
                {
                    "posX": 1088,
                    "posY": 229,
                    "rate": 0
                },
                {
                    "posX": 1085,
                    "posY": 271,
                    "rate": 0
                },
                {
                    "posX": 1058,
                    "posY": 273,
                    "rate": 0
                },
                {
                    "posX": 1056,
                    "posY": 321,
                    "rate": 0
                },
                {
                    "posX": 1086,
                    "posY": 321,
                    "rate": 0
                },
                {
                    "posX": 1082,
                    "posY": 366,
                    "rate": 0
                },
                {
                    "posX": 1057,
                    "posY": 365,
                    "rate": 0
                },
                {
                    "posX": 1019,
                    "posY": 364,
                    "rate": 0
                },
                {
                    "posX": 1019,
                    "posY": 318,
                    "rate": 0
                },
                {
                    "posX": 989,
                    "posY": 319,
                    "rate": 0
                },
                {
                    "posX": 990,
                    "posY": 372,
                    "rate": 0
                },
                {
                    "posX": 949,
                    "posY": 369,
                    "rate": 0
                },
                {
                    "posX": 951,
                    "posY": 323,
                    "rate": 0
                },
                {
                    "posX": 923,
                    "posY": 322,
                    "rate": 0
                },
                {
                    "posX": 923,
                    "posY": 369,
                    "rate": 0
                }
                ];
                this.heatMap.data = [];

                if (respone.sensors && respone.sensors.length > 0) {
                    respone.sensors.forEach(e => {
                        this.heatMap.data.push({
                            x: e.posX,
                            y: e.posY,
                            value: e.rate //Math.random() * (100 - 0) + 0
                        });
                    });
                }
                this.heatMap.imgChart = respone.base64 || 'assets/img/LayoutImageV2.png';
            }
        });

    }

}
