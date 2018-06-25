import { Component, OnInit, Input } from '@angular/core';
import { Container } from '../../base-classes/containers/container';
import { XAxisLayer } from '../../base-classes/layers/x-axis-layer';
import { YAxisLayer } from '../../base-classes/layers/y-axis-layer';
import { HorizontalStackedBar } from '../../base-classes/layers/horizontal-stacked-bar';
import { D3Utils } from '../../chart.util';
import { ChartConfig, ChartData } from '../../base-classes/interfaces'
import * as d3 from 'd3';

@Component({
  selector: 'stacked-bar',
  templateUrl: './stacked-bar.component.html',
  styleUrls: ['./stacked-bar.component.scss']
})
export class StackedBarComponent implements OnInit {
    @Input() id;
    @Input() data;
    @Input() config;

    chartConfig : ChartConfig;
    chartData : ChartData;

    constructor() { }

    ngOnInit() {
        // Default value
        this.chartConfig = {
            size: this.config.size ? this.config.size : {width: 800, height: 400},
            margin: this.config.margin ? this.config.margin : {top: 20, right: 80, bottom: 300, left: 40},
            padding: this.config.padding ? this.config.padding : {inner: 0.1, outer: 0, align: 0},
            color: this.config.color ? this.config.color : d3.schemeCategory10,
            textColor: this.config.textColor ? this.config.textColor : ["#000000"],
            barSpace: this.config.barSpace ? this.config.barSpace : 0,
        }

        this.chartData = {
            content: this.data.data,
            mainKey: this.data.key,
            keys: this.data.keys ? this.data.keys : null,
        }
    }

    ngAfterViewInit() {
        var stackedBarChart = new Container(
            'svg#' + this.id,
            this.chartConfig,
            this.chartData,
        );
        // Config range for x,y
        let xRange = [0, d3.max(D3Utils.getArrMaxValue(this.chartData.content, stackedBarChart.data.keys))];

        if (!this.data.data[0][this.data.key])
            var yRange = [this.chartData.mainKey];
        else
            var yRange : string[]  = this.chartData.content.map((d : any) => d[this.chartData.mainKey]);

        //Draw base chart
        stackedBarChart.setLayer([
            new HorizontalStackedBar(
                xRange,
                yRange,
                this.data.key,
            ),
        ]);
        stackedBarChart.draw(this.data.data);
        if (this.config.yAxis) {
            stackedBarChart.setLayer([
                new YAxisLayer(
                    yRange,
                ),
            ]);
            stackedBarChart.draw(this.data.data);
        }

        //Customize chart
        //name of data when display on UI
        this.drawLegend(stackedBarChart, this.data.customizeData);
        this.customizeTooltip(stackedBarChart, this.data.customizeData);
        this.customizeText(stackedBarChart);
    }

    /**
     *
     * @param container
     * @param customizeData the Data is use to show on UI
     */
    private customizeTooltip(container : Container, customizeData : any[]) : void {
        let tooltip = d3.select("div#" + this.id+ "-tooltip");
        let rect = container.area.selectAll('g.stacked-bar');
        rect.selectAll('rect, text')
            .on("mouseover", function() { tooltip.style("display", null); })
            .on("mouseout", function() { tooltip.style("display", "none"); })
            .on("mousemove", function(d) {
                var xPosition = (d3.event.layerX + 10) + "px";
                var yPosition = (d3.event.layerY - 30) + "px";
                tooltip.style('left', xPosition)
                       .style('top', yPosition)
                tooltip.html(function() {
                    let index = customizeData.findIndex(x => x.key == d3.event.target.parentNode.getAttribute("data-id"));
                    let label = customizeData[index].displayName + " : ";
                    return label + (d[1] - d[0]) + "%";
                });
            });
    }

    private customizeText(container : Container) : void {
        let textScale : any;
        textScale = d3.scaleOrdinal(this.chartConfig.textColor);
        textScale.domain(this.chartConfig.textColor.length);

        let rect = container.area.selectAll('g.stacked-bar');
        rect.selectAll('text')
            .text(function(d) {
                if (d[1] - d[0] > 5)
                return d[1] - d[0] + '%';
            })
            .attr('fill', function() {
                return textScale(+this.parentNode.getAttribute("data-idx"));
            })
            .style("font-weight", "bold")
            .attr('y', d => {
                if (d.data[this.data.key])
                    var yValue = d.data[this.data.key];
                else 
                    var yValue = this.data.key
                return container.yScale(yValue) + container.yScale.bandwidth() / 2
            })
            .attr('x', d => container.xScale(d[1]) + (container.xScale(d[0]) - container.xScale(d[1]))/2)
    }

    // /* Will draw the legend */
    private drawLegend(container : Container, customizeData : any[]): void {
        let data = customizeData.slice().reverse();
        let legend = container.legend.attr("transform", function () {
                                        return "translate(" + container.config.size.width / 4 + "," + (+this.parentNode.getAttribute('height') + 10) + ")";
                        })
                        .selectAll("g")
                        .data(data)
                        .enter().append("g")
                        .attr("transform", (d, i) => "translate(0," + i * 25 + ")");

        legend.append("rect")
                        .data(data)
                        .attr('x', 0).attr('y', 0)
                        .attr("width", 15).attr('height', 15)
                        .attr("fill", d => container.zScale(container.data.keys.indexOf(d.key)));

        legend.append("circle")
                        .data(data)
                        .attr('cx', 0).attr('cy', 0)
                        .attr("r", 0)
                        .attr("alignment-baseline", "central")
                        .attr("fill", d => container.zScale(container.data.keys.indexOf(d.key)));

        legend.append("text")
                        .attr('x', 25).attr('y', 11)
                        .attr("alignment-baseline", "central")
                        .text(d =>d.displayName );
    }
}
