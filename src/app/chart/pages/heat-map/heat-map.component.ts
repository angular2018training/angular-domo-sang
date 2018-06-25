import { D3Utils } from './../../chart.util';
import { Input } from '@angular/core';
import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';
import { dataEx } from './example-data';
import * as _ from 'lodash';

@Component({
    selector: 'heat-map',
    templateUrl: './heat-map.component.html',
    styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {

    // Chart ID
    @Input() id;

    // Chart Data
    @Input() data;

    // Chart config
    @Input() config;
    @Input() imgSrc;

    // Will replace later
    defaultSize = {
        width: 1100,
        height: 580
    }

    imgSize = {
        width: '100%',
        height: '100%'
    }

    rectSize = {
        width: 1.4,
        height: 2.2
    };

    blurId = 'blurMe';

    originalData;

    ngOnInit() {

        

        // set default for rectSize
        if (this.config.rectSize) {
            this.rectSize.width = this.config.rectSize.width || this.rectSize.width;
            this.rectSize.height = this.config.rectSize.height || this.rectSize.height;
        }

        if (this.config.legend) {
            this.config.legend.show = this.config.legend.show !== undefined ? this.config.legend.show : true;
        } else {
            this.config.legend = {
                show: true
            }
        }

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.originalData = _.cloneDeep(this.data);

            this.initChart();
        }, 500);
    }

    // ngAfterViewChecked() {
    //     this.initChart();
    // }

    initChart() {
        this.data = _.cloneDeep(this.originalData);

        let me = this;
        var chartComputed = (d3.select('#' + this.id).node() as Element).getBoundingClientRect();

        this.data.forEach((e: any) => {
            // Re-calculation coordinate by screen percent
            e.x = chartComputed.width !== 0 ? (((e.x * 100 / chartComputed.width) * chartComputed.width / this.defaultSize.width) - me.rectSize.width / 2) + '%' : '0';
            e.y = chartComputed.height !== 0 ? (((e.y * 100 / chartComputed.height) * chartComputed.height / this.defaultSize.height) - me.rectSize.height / 2) + '%' : '0';

            return e;
        });

        d3.select('#' + this.id).selectAll("*").remove();

        // Generate chart by data
        this.drawChart();
    }

    /**
     * Generate chart
     */
    drawChart() {
        let me = this;

        // Append SVG element
        var svg = D3Utils.appendSvgElement(this.id, this.imgSize.width, this.imgSize.height);

        // Generate element by chart data
        var g = D3Utils.appendChartData(svg, this.data);

        // Add blur animation
        D3Utils.addBlurAnimation(g, this.blurId, this.config.blur);

        var graphComputed = (d3.select('#' + this.id).node() as Element).getBoundingClientRect();

        let tooltip = d3.select('#' + me.id + 'Tooltip');


        D3Utils.appendRect(g)
            .attr("x", function (d, i) {
                // Parse to percent
                return d.x;
            })
            .attr("y", function (d, i) {
                return d.y;
            })
            .attr("height", function (d) {
                return me.rectSize.height + '%';
            })
            .attr("width", function (d) {
                return me.rectSize.width + '%';
            })
            .attr("fill", function (d, i) {
                let color = 'gray';
                // d.value = Math.random() * (100 - 0) + 0;

                let index = _.findIndex(me.config.rangeColor, (e: any) => { return e.maxValue > d.value });

                if (index > -1) {
                    return me.config.rangeColor[index].color;
                }

                if (d.value === 100) {
                    index = _.findIndex(me.config.rangeColor, (e: any) => { return e.maxValue === 100 });

                    if (index > -1) {
                        return me.config.rangeColor[index].color;
                    }
                }

                return color;
            })
            .attr("filter", function (d, i) {
                return 'url(#' + me.blurId + ')';
            })
            .on('mousemove', function (d) {
                tooltip.style('left', d3.event.offsetX + 20 + 'px');
                tooltip.style('top', d3.event.offsetY + 5 + 'px');
                tooltip.style('display', 'inline-block');
                tooltip.html('<b>' + d.value.toFixed(2) + '%')
            })
            .on('mouseout', function (d) {
                tooltip.style('display', 'none');
            });
    }

    /**
     * Re-calculate chart position
     */
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.initChart();
    }

    onClickEvent(event) {
        console.log(event);
    }

}
