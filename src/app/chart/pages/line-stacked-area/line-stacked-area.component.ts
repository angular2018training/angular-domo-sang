import { D3Utils } from './../../chart.util';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as moment from 'moment';
import { LinePlusStackedAreaChart } from './line-plus-stacked-area';
import { MockDataChart } from './mock-data';
import { CHART_ID, CHART_COLORS } from '../../../core/constants/chart.constant';
import * as _ from 'lodash';

@Component({
    selector: 'line-stacked-area',
    templateUrl: './line-stacked-area.component.html',
    styleUrls: ['./line-stacked-area.component.scss']
})
export class LineStackedAreaComponent implements OnInit {

    @Input() id; // Chart ID;
    @Input() data; // Chart Data

    title = CHART_ID.CH003.TITLE;
    legend = {
        avg_peak: {
            text: CHART_ID.CH003.LEGEND.AVG_PEAK,
            color: CHART_COLORS.COLOR6.BLUE[3],
        },
        abs_peak: {
            text: CHART_ID.CH003.LEGEND.ABS_PEAK,
            color: CHART_COLORS.COLOR6.BLUE[3],
        },
    };

    backupData;
    lineStackedAreaChart;

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.backupData = _.cloneDeep(this.data);

            this.lineStackedAreaChart = new LinePlusStackedAreaChart(this.id);
            if (this.data && this.data.area && this.data.area.length > 0) {
                this.lineStackedAreaChart.updateChart(this.data);
            }
        }, 500);
    }

    /**
     * Re-calculate chart position
     */
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.lineStackedAreaChart.init();
        this.lineStackedAreaChart.updateChart(this.backupData);
    }
}
