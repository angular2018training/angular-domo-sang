/**
 * Class to draw y-axis
 */
import * as d3 from 'd3';
import { Layer } from './layer';
import { Container } from '../containers/container';

export class YAxisLayer extends Layer{
    private isRight : boolean;
    private domain : any[];

    constructor(domain, isRight=false) {
        super();
        this.isRight = isRight; //Position of y-axis @ true: right -- false: left
        this.domain = domain;
    }
    public render(container : Container) : void {
        container.yScale.domain(this.domain);

        if (this.isRight) {
            let yAxis = container.area.append("g")
                                      .attr("class", "axis y-axis")
                                      .call(d3.axisRight(container.yScale).tickSize(0));
            yAxis.attr("transform", "translate(" + (container.config.size.width - container.config.margin.right - container.config.margin.left) + ",0)");
        }
        else {
            let yAxis = container.area.append("g")
                                      .attr("class", "axis y-axis")
                                      .call(d3.axisLeft(container.yScale).tickSize(0));
        }
    }
}
