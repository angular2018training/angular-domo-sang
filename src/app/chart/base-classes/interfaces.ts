/**
 * Object to store margin's value
 */

export interface Margin {
    top : number;
    right : number;
    bottom : number;
    left : number;
}

export interface Size {
    width : number;
    height : number;
}

export interface Padding {
    inner : number;
    outer : number;
    align : number;
}

export interface ChartConfig {
    size : Size;
    margin : Margin;
    padding : Padding;
    color : any[];
    textColor : any[],
    barSpace : number
}

export interface ChartData {
    content : any[];
    mainKey : string, //Main keys to show data on chart,
    keys : string[] //List keys contain data to draw
}
