import { StackedAreaChart } from "./stacked-area";
import * as d3 from 'd3';

export class LinePlusStackedAreaChart extends StackedAreaChart {
    line: any
    shape: any
    lineGraphicElement: any
    shapeGraphicElement: any

    constructor(containerId) {
        super(containerId)
    }

    init() {
        super.init()
        var self = this

        // Area container
        this.lineGraphicElement = this.graphContainer.append('g')
            .attr('class', 'line-container')

        this.shapeGraphicElement = this.graphContainer.append('g')
            .attr('class', 'shape-container')

        this.line = d3.line()
            .x(function (d) { return self.xScale(d.data.time) })
            .y(function (d) { return self.yScale(d[1] - d[0]) })

        this.shape = d3.symbol()
            .type(d3.symbolStar)
            .size(400)
    }

    updateChart(data) {
        var self = this
        var areaData = data['area']
        super.updateChart(areaData)

        var lineData = []
        var keys = d3.keys(data).filter(key => key !== 'area')
        areaData.map(function (item) {
            var tmp_data = {
                'time': item.time,
            }
            keys.map(function (key) {
                return tmp_data[key] = data[key]
            })
            lineData.push(tmp_data)
        })

        self.stack.keys(keys)
        var pathLine = this.lineGraphicElement.selectAll('.path-line')
            .data(self.stack(lineData))
            .enter()
            .append('g')
            .attr('class', 'path-line')

        pathLine.append('path')
            .attr('class', 'line')
            .style('stroke-width', '3px')
            .style('stroke-dasharray', function (d) {
                if (d.key === 'suggestion') {
                    return ('12, 12')
                }
                return 'none'
            })
            .style('fill', 'none')
            .attr('d', self.line)
            .style('stroke', function (d) {
                if (d.key === 'absolute_peak_utilization') {
                    return 'none'
                }
                return self.colors[d.key]
            })

        pathLine.append('text')
            .datum(function (d) { return d })
            .attr('transform', function (d) {
                var len = lineData.length
                return 'translate(' + self.xScale(d[len - 1].data.time) + ',' + (self.yScale(d[len - 1].data[d.key]) - 12) + ')'
            })
            .attr('x', 10)
            .style("text-anchor", "start")
            .style("font-size", "25px")
            .attr('fill-opacity', 1)
            .style('display', function (d) {
                if (d.key === 'suggestion') {
                    return 'block'
                }
                return 'none'
            })
            .text('Suggestion')

        pathLine.append('text')
            .datum(function (d) { return d })
            .attr('transform', function (d) {
                var len = lineData.length
                return 'translate(' + self.xScale(d[len - 1].data.time) + ',' + (self.yScale(d[len - 1].data[d.key]) + 12) + ')'
            })
            .attr('x', 10)
            .attr('dy', '.35em')
            .style("text-anchor", "start")
            .style("font-size", "25px")
            .attr('fill-opacity', 1)
            .style('display', function (d) {
                if (d.key === 'suggestion') {
                    return 'block'
                }
                return 'none'
            })
            .text(data['suggestion'] + '%')

        var shapeData = []
        areaData.map(function (item) {
            if (item.peak_utilization == data['absolute_peak_utilization']) {
                shapeData.push({
                    'time': item.time,
                    'value': data['absolute_peak_utilization']
                })
            }
        })
        var pathShape = this.shapeGraphicElement.selectAll('.path-shape')
            .data(shapeData)
            .enter()
            .append('g')
            .attr('class', 'path-shape')

        pathShape.append('path')
            .attr('class', 'shape')
            .attr('d', self.shape)
            .attr('transform', function (d, i) {
                return 'translate(' + self.xScale(d.time) + ', ' + self.yScale(d.value) + ')'
            })
            .style('fill', self.colors['absolute_peak_utilization'])
            .style('stroke', self.colors['stroke'])
    }
}
