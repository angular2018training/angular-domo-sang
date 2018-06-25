import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { } from './../../../core/constants/system.constant';
import * as _ from "lodash";


@Component({
    selector: 'multil-select',
    templateUrl: './multil-select.component.html',
    styleUrls: ['./multil-select.component.scss']
})
export class MultilSelectComponent implements OnInit {
    @Input() listDataObject
    @Input() name;
    @Input() tagName: string;
    @ViewChild('form') Form: any
    @Input() selectedObjectModel;
    @Output('selectEvent') change = new EventEmitter<object>();
    selectedObject = [];
    private listDataObjectClone = [];
    search;

    constructor() {


    }


    ngOnInit() {
        this.listDataObjectClone = Object.assign([], this.listDataObject);
    }

    searchDataByName(name) {
        var temp = [];
        this.listDataObject = [];
        var lengthListDataObjectClone = this.listDataObjectClone.length;
        for (var i = 0; i < lengthListDataObjectClone; i++) {
            if (this.listDataObjectClone[i].name.toLowerCase().indexOf(name) !== -1) {
                temp.push(this.listDataObjectClone[i]);
            }
        }
        this.listDataObject = temp;
    }

    clickItem(item) {
        if (this.selectedObject.length == 0) {
            this.selectedObject.push(item)
            return;
        }
        var isExist = false;
        var indexSelected;
        var lengthSelectedObjectList = this.selectedObject.length;
        for (var i = 0; i < lengthSelectedObjectList; i++) {
            if (this.selectedObject[i].id === item.id) {
                isExist = true;
                indexSelected = i;
                break;
            }
        }
        if (isExist) {
            this.selectedObject.splice(indexSelected, 1);
        } else {
            this.selectedObject.push(item);
        }
    }

    reCheckItem(index) {
        this.selectedObject.splice(index, 1);
        this.Form.controls.selectedObject.setValue(this.selectedObject);
    }

    closePopup() {
        this.selectedObjectModel = this.selectedObject;
        this.listDataObject = Object.assign([], this.listDataObjectClone);
        this.change.emit({ data: this.selectedObjectModel });
    }






}