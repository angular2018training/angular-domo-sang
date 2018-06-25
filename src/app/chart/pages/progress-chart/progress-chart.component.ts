import { element } from 'protractor';
import { D3Utils } from './../../chart.util';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
    selector: 'progress-chart',
    templateUrl: './progress-chart.component.html',
    styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit {

    @Input() id;
    @Input() data: any[];
    @Input() config;

    scaleOrdinal;
    // margin = {
    //     top: 10,
    //     right: 30,
    //     bottom: 30,
    //     left: 30
    // }

    defaultColor = {
        progressColor: 'green',
        unprogressColor: 'gray'
    }

    element = {
        chart: null,
        chartTitle: null,
        chartLabel: null,
        g: null
    };

    ngOnInit() {

        // Set default color
        this.config.progressColor = this.config.progressColor || this.defaultColor.progressColor;
        this.config.unprogressColor = this.config.unprogressColor || this.defaultColor.unprogressColor;

        this.scaleOrdinal = d3.scaleOrdinal([this.config.progressColor, this.config.unprogressColor]);

        if (!this.data || this.data.length < 1) {
            this.data = this.data || [];
            this.data.push({
                label: 'Empty',
                value: 0
            })
        }
        this.data.push({
            label: 'Empty',
            value: 100 - this.data[0].value
        });

        if (this.config && this.config.label && !this.config.label.color) {
            this.config.label.color = this.config.progressColor;
        }

        if (this.config && this.config.title && !this.config.title.color) {
            this.config.title.color = this.config.progressColor;
        }

        if (this.config.legend) {
            this.config.legend.show = this.config.legend.show !== undefined ? this.config.legend.show : true;
        } else {
            this.config.legend = {
                show: true
            }
        }

        // this.config.legend.show = this.config.legend.show ? this.config.legend.show : false;


    }

    ngAfterViewInit() {
        this.drawChart();
    }

    drawChart() {
        let me = this;

        // Get graph element
        let graph = d3.select('#' + me.id);

        // Append SVG elements
        graph.append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        // Define variables
        this.element.chart = graph.select('svg')
        let chartSize = D3Utils.getComputedSize(this.element.chart),
            radius = (Math.min(chartSize.width, chartSize.height) / 2);

        this.element.g = this.element.chart.append('g');

        // Generate a pie chart
        let pie = d3.pie().value(function (d) {
            return d.value;
        }).sort(null);

        var path = d3.arc()
            .outerRadius(radius) // outer radius = r
            .innerRadius(radius - this.config.strokeWidth) // inner radius = 0: pie chart, else donut chart;

        var arc = this.element.g.selectAll('arc')
            .data(pie(me.data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arc.append('path')
            .attr('d', path)
            .attr('fill', function (d, i) {
                return me.scaleOrdinal(d.data.label);
            });

        this.element.chartLabel = this.element.chart.append('g')
            .append('text')
            .text(me.data[0].value + '%')
            .attr('fill', this.config.label.color)
            .attr('font-size', this.config.label.fontSize + 'px');

        // this.element.chartTitle = this.element.chart.append('g')
        //     .append('text')
        //     .text(this.config.title.label)
        //     .attr('fill', this.config.title.color)
        //     .attr('font-size', this.config.title.fontSize + 'px');


        this.onResize();
    }

    /**
     * Re-calculate chart position
     */
    @HostListener('window:resize', ['$event'])
    onResize() {
        let chartSize = D3Utils.getComputedSize(this.element.chart),
            radius = (Math.min(chartSize.width, chartSize.height) / 2);

        // Set position for chart title
        // let chartTitleSize = D3Utils.getComputedSize(this.element.chartTitle);
        // this.element.chartTitle.attr('transform', 'translate(' + ((chartSize.width / 2) - (chartTitleSize.width / 2)) + ','
        //     + (this.config.title.fontSize + this.margin.top) + ')')

        // Set position for chart
        this.element.g.attr('transform', 'translate(' + (chartSize.width / 2) + ',' + (radius) + ')');

        // Set position for chart label
        let chartLabelSize = D3Utils.getComputedSize(this.element.chartLabel);
        this.element.chartLabel.attr('transform', 'translate(' + ((chartSize.width / 2) - (chartLabelSize.width / 2))
            + ',' + (chartSize.height / 2 + chartLabelSize.height / 2 - 5) + ')');
    }
}
