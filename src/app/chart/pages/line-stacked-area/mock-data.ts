import * as d3 from 'd3';

export class MockDataChart {
    static getLinePlusStackedAreaChart() {
        var areaData = []
        var lineData = []
        for (let index = 0; index < 10; index++) {
            var toDate = new Date('2018-04-02 12:00:00')
            toDate.setTime(toDate.getTime() + (index * 10 * 60000))
            var peak_utilization = Math.floor(Math.random() * 80)
            areaData.push({
                'time': toDate,
                'peak_utilization': peak_utilization,
                'unusage': 100 - peak_utilization
            })
        }
        var avg_peak = d3.mean(areaData, function (d) { return d.peak_utilization })
        var max_peak = d3.max(areaData, function (d) { return d.peak_utilization })
        return {
            'suggestion': 80,
            'avg_peak_utilisation': avg_peak,
            'absolute_peak_utilization': max_peak,
            'area': areaData,
        }
    }
}