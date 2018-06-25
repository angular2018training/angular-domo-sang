import { API_CONFIGURATION } from "./server.constant";

export const CHART_TYPE = {
    PIE_CHART: 'pie-chart',
    HEAT_MAP: 'heat-map',
    PROGRESS_CHART: 'progress-chart'
}

export const CHART_ID = {
    CH001: {
        ID: 1,
        API: API_CONFIGURATION.URLS.CHART.CH001,
        TYPE: CHART_TYPE.PIE_CHART
    },
    CH002: {
        ID: 2,
        API: API_CONFIGURATION.URLS.CHART.CH002
    },
    CH003: {
        ID: 3,
        API: API_CONFIGURATION.URLS.CHART.CH003,
        TITLE: 'The trend of Absolute Peak Utilization by time',
        LEGEND: {
            AVG_PEAK: 'Average Daily Peak Utilization',
            ABS_PEAK: 'Absolute Peak Utilization'
        }
    },
    CH004: {
        ID: 4,
        API: API_CONFIGURATION.URLS.CHART.CH004
    },
    CH005: {
        ID: 5,
        API: API_CONFIGURATION.URLS.CHART.CH005
    },
    CH006: {
        ID: 6,
        API: API_CONFIGURATION.URLS.CHART.CH006,
        TYPE: CHART_TYPE.PROGRESS_CHART,
        TITLE: 'Utilization rate and optimal rate by meeting room type'
    },
    CH007: {
        ID: 7,
        API: API_CONFIGURATION.URLS.CHART.CH007
    },
    CH008: {
        ID: 8,
        API: API_CONFIGURATION.URLS.CHART.CH008
    },
    CH009: {
        ID: 9,
        API: API_CONFIGURATION.URLS.CHART.CH009
    },
    CH010: {
        ID: 10,
        API: API_CONFIGURATION.URLS.CHART.CH010
    },
    CH011: {
        ID: 11,
        API: API_CONFIGURATION.URLS.CHART.CH011
    },
    CH012: {
        ID: 12,
        API: API_CONFIGURATION.URLS.CHART.CH012
    },
    CH013: {
        ID: 13,
        API: API_CONFIGURATION.URLS.CHART.CH013
    },
    CH014: {
        ID: 14,
        API: API_CONFIGURATION.URLS.CHART.CH014
    },
    CH015: {
        ID: 15,
        API: API_CONFIGURATION.URLS.CHART.CH015
    },
    CH016: {
        ID: 16,
        API: API_CONFIGURATION.URLS.CHART.CH016
    },
    CH017: {
        ID: 17,
        API: API_CONFIGURATION.URLS.CHART.CH017
    },
    CH018: {
        ID: 18,
        API: API_CONFIGURATION.URLS.CHART.CH018
    },
    CH019: {
        ID: 19,
        API: API_CONFIGURATION.URLS.CHART.CH019
    },
    CH0120: {
        ID: 20,
        API: API_CONFIGURATION.URLS.CHART.CH020
    },
    CH021: {
        ID: 21,
        API: API_CONFIGURATION.URLS.CHART.CH021
    },
    CH0122: {
        ID: 22,
        API: API_CONFIGURATION.URLS.CHART.CH022
    },
    CH023: {
        ID: 23,
        API: API_CONFIGURATION.URLS.CHART.CH023
    },
    CH024: {
        ID: 24,
        API: API_CONFIGURATION.URLS.CHART.CH024
    },
    CH025: {
        ID: 25,
        API: API_CONFIGURATION.URLS.CHART.CH025
    },
    CH026: {
        ID: 26,
        API: API_CONFIGURATION.URLS.CHART.CH026
    },
    CH027: {
        ID: 27,
        API: API_CONFIGURATION.URLS.CHART.CH027
    },
    CH028: {
        ID: 28,
        API: API_CONFIGURATION.URLS.CHART.CH028
    },
    CH901: {
        ID: 29,
        API: API_CONFIGURATION.URLS.CHART.CH901,
        TYPE: CHART_TYPE.HEAT_MAP,
        TITLE: 'Seat-level Heatmap'
    },
    CH902: {
        ID: 30,
        API: API_CONFIGURATION.URLS.CHART.CH902
    },
    CH903: {
        ID: 31,
        API: API_CONFIGURATION.URLS.CHART.CH903
    }
}

export const CHART_COLORS = {
    COLOR6: {
        BLUE: ['rgb(46, 27, 76)', 'rgb(38, 54, 107)', 'rgb(30, 81, 137)', 'rgb(23, 107, 168)', 'rgb(15, 107, 168)',
            'rgb(7, 161, 229)', 'rgb(166, 166, 166)', 'rgb(216, 216, 216)'],
        ORANGE: ['rgb(232, 56, 40)', 'rgb(237, 90, 32)', 'rgb(241, 124, 25)', 'rgb(246, 158, 16)', 'rgb(250, 192, 8)',
            'rgb(255, 226, 0)', 'rgb(166, 166, 166)',],
        GREEN: ['rgb(18, 30, 76)', 'rgb(24, 65, 72)', 'rgb(29, 100, 68)', 'rgb(35, 134, 65)', 'rgb(40, 169, 61)',
            'rgb(46, 204, 57)', 'rgb(166, 166, 166)']
    },
    COLOR7: {
        BLUE: ['rgb(41, 20, 56)', 'rgb(35, 44, 85)', 'rgb(30, 67, 114)', 'rgb(24, 91, 143)', 'rgb(18, 114, 171)',
            'rgb(13, 138, 200)', 'rgb(7, 161, 229)', 'rgb(166, 166, 166)'],
        ORANGE: ['rgb(229, 24, 14)', 'rgb(233, 58, 12)', 'rgb(238, 91, 9)', 'rgb(242, 125, 7)', 'rgb(246, 159, 5)',
            'rgb(251, 192, 2)', 'rgb(255, 226, 0)', 'rgb(166, 166, 166)'],
        GREEN: ['rgb(18, 24, 73)', 'rgb(23, 54, 70)', 'rgb(27, 84, 68)', 'rgb(32, 114, 65)', 'rgb(37, 144, 62)',
            'rgb(41, 174, 60)', 'rgb(46, 204, 57)', 'rgb(166, 166, 166)']
    },
    COLOR8: {
        BLUE: ['rgb(41, 20, 56)', 'rgb(36, 40, 81)', 'rgb(31, 60, 105)', 'rgb(26, 80, 130)', 'rgb(22, 101, 155)',
            'rgb(17, 121, 180)', 'rgb(12, 141, 204)', 'rgb(7, 161, 229)', 'rgb(166, 166, 166)'],
        ORANGE: ['rgb(229, 24, 14)', 'rgb(233, 53, 12)', 'rgb(236, 82, 108)', 'rgb(240, 111, 8)', 'rgb(244, 139, 6)',
            'rgb(248, 168, 4)', 'rgb(251, 197, 2)', 'rgb(255, 226, 0)', 'rgb(166, 166, 166)'],
        GREEN: ['rgb(18, 24, 73)', 'rgb(22, 50, 71)', 'rgb(26, 75, 68)', 'rgb(30, 101, 66)', 'rgb(34, 127, 64)',
            'rgb(38, 153, 62)', 'rgb(42, 178, 59)', 'rgb(46, 204, 57)', 'rgb(166, 166, 166)']
    },
    COLOR9: {
        BLUE: ['rgb(35, 15, 40)', 'rgb(32, 33, 64)', 'rgb(28, 52, 87)', 'rgb(25, 70, 111)', 'rgb(21, 88, 135)',
            'rgb(18, 106, 158)', 'rgb(14, 125, 182)', 'rgb(11, 143, 205)', 'rgb(7, 161, 229)', 'rgb(166, 166, 166)'],
        ORANGE: ['rgb(255, 18, 18)', 'rgb(255, 44, 16)', 'rgb(255, 70, 14)', 'rgb(255, 96, 11)', 'rgb(255, 122, 9)',
                'rgb(255, 148, 7)', 'rgb(255, 174, 5)', 'rgb(255, 200, 2)', 'rgb(255, 226, 0)', 'rgb(166, 166, 166)'],
        GREEN: ['rgb(9, 18, 71)', 'rgb(14, 41, 69)', 'rgb(18, 65, 68)', 'rgb(23, 88, 66)', 'rgb(28, 111, 64)',
            'rgb(32, 134, 62)', 'rgb(37, 158, 61)', 'rgb(41, 181, 59)', 'rgb(46, 204, 57)', 'rgb(166, 166, 166)']
    },
    HEAT_COLOR: {
        BASE_COLOR: 'rgba(224, 224, 248, 0.4)',
        LOW_UTILIZATION: 'rgba(0, 255, 255, 0.4)',
        MID_UTILIZATION: 'rgba(255, 255, 0, 0.4)',
        HIGH_UTILIZATION: 'rgba(255, 0, 0, 0.4)'
    }
}