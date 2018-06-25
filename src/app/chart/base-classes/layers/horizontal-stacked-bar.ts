import * as d3 from 'd3';
import { VerticalStackedBar } from './vertical-stacked-bar';
import { Container } from '../containers/container';

export class HorizontalStackedBar extends VerticalStackedBar{
    /**
     * This class's extended from VerticalStackedBar but it mus a new x, y, z Scale for to make the chart  be horizontal
     */
    private yKey : string; //Key to get value of y-Axis

    constructor(xDomain, yDomain, yKey) {
        super(xDomain, yDomain, null);
        this.yKey = yKey;
    }

    /**
     *
     * @param barSpace Space betweens 2 bar;
     */
    public render(container : Container) : void {
        this.setDomain(container);
        var that = this;
        //Draw
        var g = container.area.append('g').attr('class', 'chart');
        var rect = g.selectAll('g')
                    .append('g')
                    .data(d3.stack().keys(container.data.keys)(container.data.content))
                    .enter().append('g')
                    .attr('class', d => 'stacked-bar ' + d.key)
                    .attr('fill', d => container.zScale(container.data.keys.indexOf(d.key)))
                    .attr('data-id', function(d) { return d.key; });

        //Draw stacked bar
        rect.selectAll('rect')
            .data(d => d)
            .enter().append('rect')
            .attr('x', d => container.xScale(d[0]))
            .attr('y', d => container.yScale(d.data[this.yKey]))
            .attr("height", container.yScale.bandwidth)
            .attr("width", d => {
                let width = container.xScale(d[1]) - container.xScale(d[0]) - container.config.barSpace;
                if (width < 0)
                    return 0;
                return width;
            });

        this.drawText(container);
    }

    /**
     *
     * Re-config for x,y, z scale
     */
    public setDomain(container : Container) : void {
        container.setXScale(
            d3.scaleLinear()
            .rangeRound([0, container.config.size.width - container.config.margin.left - container.config.margin.right])
            .domain(this.xDomain));
        container.setYScale(
            d3.scaleBand()
            .rangeRound([container.config.size.height - container.config.margin.bottom - container.config.margin.top, 0])
            .paddingInner(container.config.padding.inner)
            .paddingOuter(container.config.padding.outer)
            .align(container.config.padding.align)
            .domain(this.yDomain));
        container.zScale.domain(container.data.keys.length)
    }
}