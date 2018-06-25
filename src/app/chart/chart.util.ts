import * as d3 from 'd3';

export class D3Utils {

    static appendSvgElement(containerId: string, width: number | string, height: number | string) {
        return d3.select('#' + containerId)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    }

    static appendChartData(svgElement, chartData: any[]) {
        return svgElement.selectAll("g")
        .data(chartData)
        .enter()
        .append("g");
    }

    static addBlurAnimation(gElement, elementId: string, spread: number) {
        gElement.append("filter")
        .attr("id", elementId)
        .append("feGaussianBlur")
        .attr("in", 'SourceGraphic')
        .attr("stdDeviation", spread);
    }

    static appendRect(gElement) {
        return gElement.append("rect");
    }

    static getComputedSize(element) {
        return element.node().getBoundingClientRect();
    }

    static getContainer(containerId) {
        return d3.select('#' + containerId);
    }
    /**
     * Function to get list keys of data
     * @param data  -- data
     * @param keysExclude -- keys that not use to draw chart
     */
    static getListKeys(data, keysExclude : string[] = []) : string[] {
        let keys  = Object.getOwnPropertyNames(data[0]);
        for (let i = 0; i < keysExclude.length; i++) {
            if ((keys.indexOf(keysExclude[i]) > -1)) {
                keys.splice(keys.indexOf(keysExclude[i]), 1);
            }
        }
        return keys;
    }

    static getArrMaxValue(data, keys : string[]) : string[] {
        var maxValue = [];
        data.forEach(v => {
            maxValue.push(keys.map(key => {
                return v[key];
            }).reduce((a, b) => a + b, 0));
        });
        return maxValue;
    }
}