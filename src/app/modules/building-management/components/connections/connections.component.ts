import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import { ITdDataTableColumn, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, TdDataTableService, IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit {
  @Input('dataConnection') data: any;
  /* column */
  columns: ITdDataTableColumn[] = [
    { name: 'id', label: 'tags.floorManagement.sensorList.no', filter: true, sortable: true, width: 150 },
    { name: 'sensorService', label: 'tags.floorManagement.sensorList.sensorService', filter: true, sortable: true },
    { name: 'url', label: 'tags.floorManagement.sensorList.url', filter: true, sortable: true },
    { name: 'user', label: 'tags.floorManagement.sensorList.user', filter: true, sortable: true },
  ];
  /* data table */
  filteredData: any[];
  filteredTotal: number;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSizes: number[] = [5, 10, 15, 20];
  pageSize: number = this.pageSizes[0];
  sortBy: string = 'id';
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
