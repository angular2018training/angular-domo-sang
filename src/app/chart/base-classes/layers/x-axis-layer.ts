/**
 * Class to draw x-axis
 */
import * as d3 from 'd3';
import { Layer } from './layer';
import { Container } from '../containers/container';

export class XAxisLayer extends Layer{
    private isTop : boolean; //Position of x-axis @ true: top -- false: bottom
    private domain : any[];

    constructor(domain, isTop=false) {
        super();
        this.isTop = isTop;
        this.domain = domain;
    }

    public render(container : Container) : void {
        container.xScale.domain(this.domain)
        let yPosition = container.config.size.height - container.config.margin.bottom;

        if (this.isTop) {
            let yPosition = -3;
            container.area.append("g")
                          .attr("class", "axis x-axis")
                          .attr("transform", "translate(0," + yPosition + ")")
                          .call(d3.axisTop(container.xScale).tickSize(0))
                          .attr("font-size", 14);
        } else {
            container.area.append("g")
                          .attr("class", "axis x-axis")
                          .attr("transform", "translate(0," + yPosition + ")")
                          .call(d3.axisBottom(container.xScale).tickSize(0))
                          .attr("font-size", 14);
        }
    }
}