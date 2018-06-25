import { CHART_COLORS } from './../../../core/constants/chart.constant';
import { D3Utils } from './../../chart.util';
import * as d3 from 'd3';

export class StackedAreaChart {
    containerId: string

    data: any
    svg: any
    graphContainer: any
    axisGraphicElement: any
    areaGraphicElement: any
    xScale: any
    yScale: any
    xAxis: any
    yAxis: any
    axisLeft: any
    axisBottom: any
    area: Function
    lineStroke: any
    stack: any
    margin: any
    width: number
    height: number

    formatTime: any
    colors: any
    displayYAxis: boolean

    constructor(containerId, displayYAxis=false) {
        this.containerId = containerId
        this.displayYAxis = displayYAxis
        this.margin = { top: 10, right: 70, bottom: 20, left: 20 }
        this.formatTime = d3.timeFormat("%H/%M")
        this.colors = {
            'suggestion': CHART_COLORS.COLOR6.BLUE[3],
            'avg_peak_utilisation': CHART_COLORS.COLOR6.BLUE[3],
            'absolute_peak_utilization': CHART_COLORS.COLOR6.BLUE[3],
            'peak_utilization': CHART_COLORS.COLOR6.BLUE[5],
            'unusage': CHART_COLORS.COLOR6.BLUE[6],
            'stroke': '#FFF',
        }

        this.init()
    }

    init() {
        var self = this, margin = this.margin, container = D3Utils.getContainer(this.containerId)
        var containerBounding = container.node().getBoundingClientRect(), margin = this.margin

        // clear container
        container.selectAll('*').remove()

        this.width = Math.max(containerBounding.width - margin.left - margin.right, 500)
        this.height = Math.max(containerBounding.height - margin.top - margin.bottom, 200)

        this.xScale = d3.scaleTime()
            .range([0, self.width - margin.right])
        this.yScale = d3.scaleLinear()
            .range([self.height, 0])

        this.xAxis = d3.axisBottom(self.xScale)
            .ticks(20)
            .tickFormat(self.formatTime)
        this.yAxis = d3.axisLeft(self.yScale)

        this.svg = container.append('svg')
            .attr('width', self.width + margin.left + margin.right)
            .attr('height', self.height + margin.top + margin.bottom)

        this.graphContainer = this.svg.append('g')
            .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')')

        // Axis container
        this.axisGraphicElement = this.graphContainer.append('g')
            .attr('class', 'axis-container')

        // Area container
        this.areaGraphicElement = this.graphContainer.append('g')
            .attr('class', 'area-container')

        this.stack = d3.stack()

        this.area = d3.area()
            .x(function (d) { return self.xScale(d.data.time) })
            .y0(function (d) { return self.yScale(d[0]) })
            .y1(function (d) { return self.yScale(d[1]) })

        this.lineStroke = d3.line()
            .x(function (d) { return self.xScale(d.data.time) })
            .y(function (d) { return self.yScale(d[1]) })
    }

    updateChart(data) {
        var self = this

        this.xScale.domain(d3.extent(data, function (d) { return d.time }))
        this.yScale.domain([0, 100])
        var keys = d3.keys(data[0]).filter(item => item !== 'time')
        this.stack.keys(keys)

        var layerArea = this.areaGraphicElement.selectAll('.layer-area')
            .data(self.stack(data))
            .enter()
            .append('g')
            .attr('class', 'layer-area')

        layerArea.exit().remove()

        layerArea.append('path')
            .attr('class', 'area')
            .style('fill', function (d) { return self.colors[d.key] })
            .attr('d', self.area)

        layerArea.append('path')
            .attr('class', 'line-stroke')
            .style('stroke-width', '4px')
            .style('fill', 'none')
            .attr('d', self.lineStroke)
            .style('stroke', function (d) {
                if (keys.slice(-1)[0] === d.key) {
                    return 'none'
                }
                return self.colors['stroke']
            })

        this.axisBottom = this.appendAxisGraphic(
            self.axisGraphicElement,
            'x-axis x-axis-bottom',
            self.xAxis,
            'translate(0,' + self.height + ')'
        )

        if (this.displayYAxis) {
            this.axisLeft = this.appendAxisGraphic(
                self.axisGraphicElement,
                'y-axis y-axis-left',
                self.yAxis,
                'translate(0, 0)'
            )
        }

    }

    appendAxisGraphic(container, classes, axis, transform) {
        return container.append('g')
            .attr('class', classes)
            .attr('transform', transform)
            .call(axis)
    }
}
