import { Component, OnInit, Input } from '@angular/core';
import { Container } from '../../base-classes/containers/container';
import { XAxisLayer } from '../../base-classes/layers/x-axis-layer';
import { YAxisLayer } from '../../base-classes/layers/y-axis-layer';
import { VerticalStackedBar } from '../../base-classes/layers/vertical-stacked-bar';
import { D3Utils } from '../../chart.util';
import { ChartConfig, ChartData } from '../../base-classes/interfaces'
import * as d3 from 'd3';

@Component({
  selector: 'stacked-column',
  templateUrl: './stacked-column.component.html',
  styleUrls: ['./stacked-column.component.scss']
})
export class StackedColumnComponent implements OnInit {
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
            padding: this.config.padding ? this.config.padding : {inner: 0.1, outer: 0, align: 0.5},
            color: this.config.color ? this.config.color : d3.schemeCategory10,
            textColor: this.config.textColor ? this.config.textColor : ["#000000"],
            barSpace: this.config.barSpace ? this.config.barSpace : 0
        }

        this.chartData = {
            content: this.data.data,
            mainKey: this.data.key,
            keys: this.data.keys ? this.data.keys : null
        }
    }

    ngAfterViewInit() {
        var stackedBarChart = new Container(
            'svg#' + this.id,
            this.chartConfig,
            this.chartData,
        );

        // Config range for x,y
        let yRange = [0,d3.max(D3Utils.getArrMaxValue(this.data.data, stackedBarChart.data.keys))];

        if (!this.data.data[0][this.data.key])
            var xRange = [this.data.key];
        else
            var xRange : any[] = this.data.data.map((d : any) => d[this.data.key]);

        stackedBarChart.setLayer([
            new XAxisLayer(xRange, this.config.xAxisPosition == "Top" ? true : false),
            new VerticalStackedBar(
                xRange,
                yRange,
                this.data.key,
            ),
        ])

        //Draw chart
        stackedBarChart.draw(this.data.data);

        //Customize chart
        this.drawLegend(stackedBarChart, this.data.customizeData);
        this.customizeTooltip(stackedBarChart, this.data.customizeData);
        this.customizeText(stackedBarChart);
    }

    private customizeText(container : Container) : void {
        // Draw text with custom color
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
            .attr('x', d => container.xScale(d.data[this.data.key]) + container.xScale.bandwidth() / 2)
            .attr('y', d => container.yScale(d[1]) + (container.yScale(d[0]) - container.yScale(d[1]))/2)
            .attr('dy', '0.5em');
    }

    private customizeTooltip(container : Container, customizeData : any[]) : void {
        let tooltip = d3.select("div#" + this.id+ "-tooltip");
        // Draw tooltip
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
    // /* Will draw the legend */
    private drawLegend(container : Container, customizeData : any[]): void {
        var xPos = 0;
        let data = customizeData.slice().reverse();

        let legend = container.legend.attr("transform", function() {
                            //Get rect of g that contains xaxis
                            let xAxisHeight = (d3.select('.x-axis').node() as Element).getBoundingClientRect().height;
                            return "translate(60," + (container.config.size.height - container.config.margin.bottom/1.5 + xAxisHeight + 2) + ") "
                        })
                        .selectAll("g")
                        .data(data)
                        .enter().append("g")
                        .attr("transform", function (d, i){
                            return "translate(" + i * container.config.size.width/3 + ",0)";
                        });

        legend.append("circle")
                .data(data)
                .attr('cx', 0).attr('cy', 0)
                .attr("r", 7.5)
                .attr("alignment-baseline", "central")
                .attr("fill", d => container.zScale(container.data.keys.indexOf(d.key)));

        legend.append("rect")
                .data(data)
                .attr('x', 0).attr('y', 0)
                .attr("width", 0).attr('height', 0)
                .attr("alignment-baseline", "central")
                .attr("fill", d => container.zScale(container.data.keys.indexOf(d.key)));

        legend.append("text")
                .attr('x', 15).attr('y', 5)
                .attr("alignment-baseline", "central")
                .text(d => d.displayName)
                .attr("font-size", d => {
                    if (d.displayName.length > 20)
                        return 12;
                    return 14;
                });                ;
    }
}
