/**
 * Class to draw stacked bar
 */
import * as d3 from 'd3';
import { Layer } from './layer';
import { Container } from '../containers/container';

export class VerticalStackedBar extends Layer{
    xDomain : any[];
    yDomain : any[];
    private xKey : string;

    constructor(xDomain, yDomain, xKey) {
        super();
        this.xDomain = xDomain;
        this.yDomain = yDomain;
        this.xKey = xKey; //Key to get value of x-Axis
    }

    public render(container : Container) : void {
        this.setDomain(container);
        var that = this;
        //Draw bar follow container's data
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
            .attr('x', d => container.xScale(d.data[this.xKey]))
            .attr('y', d => container.yScale(d[1]))
            .attr("height", d => {
                let height = container.yScale(d[0]) - container.yScale(d[1]) - container.config.barSpace;
                if (height < 0)
                    return 0;
                return height;
            })
            .attr("width", container.xScale.bandwidth());

        this.drawText(container);
    }

    /**
     *
     * Set domain for x, y, z scale
     */
    public setDomain(container : Container) : void {
        container.xScale.domain(this.xDomain);
        container.yScale.domain(this.yDomain).nice();
        container.zScale.domain(container.data.keys.length)
    }

    /**
     *
     * Draw basic text
     */

    public drawText(container : Container) : void {
        let rect = container.area.selectAll('g.stacked-bar');
        rect.selectAll('text')
            .data(d => d)
            .enter().append('text')
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central");
    }
}