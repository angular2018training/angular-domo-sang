/**
 * Class for container that contains many layer to draw a chart
 */
import * as d3 from 'd3';
import { ChartConfig, ChartData } from '../interfaces';
import { Layer } from '../layers/layer';
import { D3Utils} from '../../chart.util';

 export class Container {
    // Size of SVG
    config : ChartConfig;
    area : any;

    // d3-Scale
    xScale : any;
    yScale : any;
    zScale : any;

    //Data
    data : ChartData;

    // Array of layer in container
    private layers : Layer[];

    // Components of chart
    legend : any;

    constructor(selector : string, config : ChartConfig, data : ChartData) {
        // Initial value for svg's size
        this.config = config;

        //Create area to draw chart
        this.area = d3.select(selector)
                      .append('g')
                      .attr('width', this.config.size.width - this.config.margin.left - this.config.margin.right)
                      .attr('height', this.config.size.height - this.config.margin.top - this.config.margin.bottom)
                      .attr('transform', "translate(" + this.config.margin.left + "," + this.config.margin.top + ")")

        // Initial value for scale
        this.xScale = d3.scaleBand()
                .rangeRound([0, this.config.size.width - this.config.margin.right - this.config.margin.left])
                .paddingInner(this.config.padding.inner)
                .paddingOuter(this.config.padding.outer)
                .align(this.config.padding.align);
        this.yScale = d3.scaleLinear()
                .rangeRound([this.config.size.height - this.config.margin.bottom, 0]);
        this.zScale = d3.scaleOrdinal(this.config.color);

        // Initial Data
        this.data = data;
        if (this.data.keys == null)
            this.data.keys = Object.getOwnPropertyNames(this.data.content[0]).sort();
        if (this.data.keys.indexOf(this.data.mainKey) > -1)
            this.data.keys.splice(this.data.keys.indexOf(this.data.mainKey), 1);

        //Draw default components
        this.prepareLegend();
    };

    //Set layer of the chart
    public setLayer(layers : Layer[]) {
        this.layers = layers;
    }

    public draw(data, keysExclude : string[] = []) : void {
        this.layers.forEach(element => {
            element.render(this)
        });
    }

    /**
     * Methods to set Scale when customize its
     */

    public setXScale(xScale : any)  : void {
        this.xScale = xScale;
    }

    public setYScale(yScale : any)  : void {
        this.yScale = yScale;
    }

    public setZScale(zScale : any)  : void {
        this.zScale = zScale;
    }

    private prepareLegend(): void {
        this.legend = this.area.append("g")
                                .attr('class', 'legend')
                                .attr("font-family", "sans-serif")
                                .attr("font-size", 14)
                                .attr("text-anchor", "start")
                                .attr("alignment-baseline", "central")
    }
 }