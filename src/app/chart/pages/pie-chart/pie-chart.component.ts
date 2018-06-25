import { D3Utils } from './../../chart.util';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

    @Input() id;
    @Input() data: any[];
    @Input() config;

    defaultColors = ['gray', 'green', 'brown', 'orange', 'red', 'yellow', 'blue'];

    element = {
        chart: null,
        g: null,
        chartTitle: null,
        chartArc: null,
        chartLabelArc: null,
        legend: null
        // chartLabel: null
    };

    margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 30
    }

    ngOnInit() {
        this.config.strokeColor = this.config.strokeColor || 'white';

        this.config.label.color = this.config.label.color || 'white';

        if (this.config.legend) {
            this.config.legend.show = this.config.legend.show !== undefined ? this.config.legend.show : true;
        } else {
            this.config.legend = {
                show: true
            }
        }

        // this.config.colors = this.config.colors || d3.schemeCategory20c;

        // this.drawChart();
    }

    ngAfterViewInit() {
        this.drawChart();
    }

    drawChart() {
        let me = this;
        let totalValue = me.data.reduce((total, element) => {
            return element.value + total;
        }, 0);

        // var strokeColor = 'white';
        // Get graph element
        let graph = d3.select('#' + this.id);

        // Append SVG elements
        graph
            .append('svg')
            .attr('width', this.config.width)
            .attr('height', this.config.height);


        // Define variables
        this.element.chart = graph.select('svg')
        let chartSize = D3Utils.getComputedSize(this.element.chart),
            radius = Math.min(chartSize.width, chartSize.height) / 2;

        this.element.g = this.element.chart.append('g');

        var color = this.config.colors ? d3.scaleOrdinal(this.config.colors) : d3.scaleOrdinal(d3.schemeCategory10);

        // Generate a pie chart
        var pie = d3.pie().value(function (d) {
            return d.value;
        });

        // Define arcs for pie wedges
        this.element.chartArc = d3.arc() // generates an arc (vòng cung)
            .outerRadius(radius - 40) // outer radius = r
            .innerRadius(0); // inner radius = 0: pie chart, else donut chart

        // Add labels in wedges
        this.element.chartLabelArc = d3.arc()
            .outerRadius(radius - 40).innerRadius(radius - 100);

        let tooltip = d3.select('#' + this.id + 'Tooltip');

        let chartLabel = this.element.g.selectAll('arc')
            .data(pie(me.data))
            .enter()
            .append('g')
            // Add tooltip when mouse over
            .on('mousemove', function (d) {
                tooltip.style('left', d3.event.offsetX + 40 + 'px');
                tooltip.style('top', d3.event.offsetY + 60 + 'px');
                tooltip.style('display', 'inline-block');
                tooltip.html('<b>' + (d.data.label) + '</b><br>' + (d.data.value * 100 / totalValue).toFixed(0) + '%')
            })
            // Remove tooltip when mouse out
            .on('mouseout', function (d) {
                tooltip.style('display', 'none');
            });

        this.element.legend = d3.select('#' + me.id + 'Legend').append('svg')
            .attr('width', this.config.width)
        // .attr('height', this.config.height);

        chartLabel.append('path')
            .attr('d', this.element.chartArc)
            .attr('fill', function (d, i) {

                // Add legend
                let g = me.element.legend.append('g');

                // Add color
                g.append('circle')
                    .attr('cx', function (d, j) {
                        return 15;
                    })
                    .attr("cy", function (d, j) {
                        return 15 + i * 20;
                    })
                    .attr("r", function (d, j) {
                        return 7.5;
                    })
                    .attr('fill', color(d.data.label));

                // Add Label
                g.append('text')
                    .attr('x', 30)
                    .attr('y', function (d) { return 15 + i * 20 })
                    .attr('dy', ".35em")
                    .attr('fill', 'black')
                    .attr('text-anchor', 'start')
                    .text(d.data.label)

                return color(d.data.label);
            })
            .attr('stroke', this.config.strokeColor);

        chartLabel.append('text')
            .attr('transform', function (d) {
                var midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
                return 'translate(' + (me.element.chartLabelArc.centroid(d)[0] + 2) + ',' + (me.element.chartLabelArc.centroid(d)[1] + 3) + ') rotate(-90) rotate(' + (midAngle * 180 / Math.PI) + ')';
            })
            .attr('fill', me.config.label.color)
            .attr('text-anchor', 'middle')
            .text(function (d) {
                return (d.data.value * 100 / totalValue).toFixed(0) + '%';
            });

        // let chartElement = g.node().getBoundingClientRect();s

        this.element.chartTitle = this.element.chart.append('g')
            .append('text')
            .text(this.config.title.label)
            .attr('fill', this.config.title.color)
            .attr('font-size', this.config.title.fontSize);





        this.onResize();
    }

    /**
     * Re-calculate chart position
     */
    @HostListener('window:resize', ['$event'])
    onResize() {
        let chartSize = D3Utils.getComputedSize(this.element.chart),
            radius = (Math.min(chartSize.width, chartSize.height) / 2);

        // Define arcs for pie wedges
        this.element.chartArc.outerRadius(radius) // outer radius = r
            .innerRadius(0); // inner radius = 0: pie chart, else donut chart

        // Add labels in wedges
        this.element.chartLabelArc
            .outerRadius(radius).innerRadius(radius - 40);

        // Set position for chart title
        let chartTitleSize = D3Utils.getComputedSize(this.element.chartTitle);
        this.element.chartTitle.attr('transform', 'translate(' + ((chartSize.width / 2) - (chartTitleSize.width / 2)) + ','
            + (this.config.title.fontSize + this.margin.top) + ')')

        this.element.g.attr('transform', 'translate(' + (chartSize.width / 2) + ',' + (radius + this.config.title.fontSize + this.margin.top) + ')');

        // Set position for chart (right center)
        d3.select('#' + this.id + 'Legend').attr('style', 'left: ' + ((chartSize.width / 2) + radius) + 'px; bottom: 0')
    }
}
