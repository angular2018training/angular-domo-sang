import { Component, OnInit, ViewChild, ElementRef, Inject, Input, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-meeting-spaces',
  templateUrl: './meeting-spaces.component.html',
  styleUrls: ['./meeting-spaces.component.scss']
})
export class MeetingSpacesComponent implements OnInit {
  @Input('dataMeetingSpaces') data: any;
  columns: ITdDataTableColumn[] = [
    { name: 'placeID', label: 'tags.floorManagement.locations.placeID', filter: true, sortable: true, width: 150 },
    { name: 'placeName', label: 'tags.floorManagement.locations.roomName', filter: true, sortable: true },
    { name: 'placeType', label: 'tags.floorManagement.locations.roomName', filter: true, sortable: true },
    { name: 'capacity', label: 'tags.floorManagement.locations.capacity', filter: true, sortable: true },
  ];
  filteredData: any[] = [];
  filteredTotal: number;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 15, 20];
  pageSize: number = this.pageSizes[0];
  sortBy: string = 'placeID';
  selectedRows: any[] = [];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  constructor(
    private _UtilitiesService: UtilitiesService,
    private _dataTableService: TdDataTableService,
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && (changes.data.currentValue !== changes.data.previousValue)) {
      this.filter();
    }
  }
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    if (this.sortBy === sortEvent.name) {
      this.sortOrder = this.sortOrder === TdDataTableSortingOrder.Ascending ? TdDataTableSortingOrder.Descending : TdDataTableSortingOrder.Ascending;
    } else {
      this.sortBy = sortEvent.name;
      this.sortOrder = this.sortOrderDefault;
    }
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }
  filter(): void {
    let newData: any[] = this.data;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return !column.filter;
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

}
