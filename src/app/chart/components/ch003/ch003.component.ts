import { ChartService } from './../../chart.service';
import { Component, OnInit, Input } from '@angular/core';
import { API_CONFIGURATION } from '../../../core/constants/server.constant';
import { CHART_ID } from '../../../core/constants/chart.constant';

@Component({
    selector: 'ch003',
    templateUrl: './ch003.component.html',
    styleUrls: ['./ch003.component.scss']
})
export class Ch003Component implements OnInit {

    @Input() floorId;
    @Input() clientBusinessUnitId?;
    @Input() fromDate;
    @Input() toDate;
    @Input() buildingId;
    @Input() clientId;

    calledAPI = false;
    id = 'line-stacked-area-chart';
    data = {
        suggestion: 80,
        absolute_peak_utilization: 0,
        avg_peak_utilisation: 0,
        area: [],
    };

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
            type: 3,
            floorId: this.floorId,
            clientBusinessUnitId: this.clientBusinessUnitId,
            fromDate: this.fromDate,
            toDate: this.toDate,
	    buildingId: this.buildingId,
            clientId: this.clientId
        };

        if (!body.clientBusinessUnitId) {
            delete body.clientBusinessUnitId;
        }

        this.calledAPI = true;

        this.chartService.getChartData(API_CONFIGURATION.URLS.CHART.CH003, body).then(respone => {
            if (respone && respone.peakUtilisations) {
                this.data.absolute_peak_utilization = respone.absolutePeakUtilisation;
                this.data.avg_peak_utilisation = respone.averageDailyPeakUtilisation;

                let areaData = []
                respone.peakUtilisations.map(function (item, index) {
                    let curTimeParts = item.period.split(' ')
                    let dateParts = curTimeParts[0].split('-')
                    let timeParts = curTimeParts[1].split(':')
                    let currentDate = new Date(
                        +dateParts[0],
                        +dateParts[1] + 1,
                        +dateParts[2],
                        timeParts[0],
                        timeParts[1],
                    );
                    // currentDate.setTime(currentDate.getTime() + (index * 10 * 60000));
                    areaData.push({
                        time: currentDate,
                        peak_utilization: item.value,
                        unusage: 100 - item.value,
                    });
                });

                this.data.area = areaData;
            }
        });
    }
}
