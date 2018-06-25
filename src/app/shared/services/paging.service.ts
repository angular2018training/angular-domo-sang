import { Injectable } from "@angular/core";
import { TdDataTableSortingOrder, ITdDataTableSortChangeEvent, IPageChangeEvent, ITdDataTableColumn, TdDataTableService } from "@covalent/core";
import * as _ from 'lodash';
import { SYSTEM } from "../../core/constants/system.constant";

export class Paging {
  filteredData: any[] = [];
  filteredTotal: number = 0;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 0;
  pageSizes: number[] = SYSTEM.PAGE_SIZES;
  pageSize: number = this.pageSizes[0];
  sortOrderDefault: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Ascending;

  sortBy: string = '';
  columns: any[] = [];
  data: any[] = [];
  configDataFunction;

  constructor(private _dataTableService: TdDataTableService) {
  }

  public setSortBy(attribute) {
    this.sortBy = attribute;
  }

  public setColumns(columns) {
    this.columns = columns;
  }

  public setData(data) {
    this.data = data;
  }

  public setTotalElements(total) {
    this.filteredTotal = total;
  }

  public setConfigDataFunction(func) {
    this.configDataFunction = func;
  }

  public setCurrentPage(index) {
    this.currentPage = index;
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    if (this.sortBy === sortEvent.name) {
      this.sortOrder = this.sortOrder === TdDataTableSortingOrder.Ascending ? TdDataTableSortingOrder.Descending : TdDataTableSortingOrder.Ascending;
    } else {
      this.sortBy = sortEvent.name;
      this.sortOrder = this.sortOrderDefault;
    }

    // this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
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
    newData = this._dataTableService.filterData(this.configDataFunction(newData), this.searchTerm, true, excludedColumns);
    // this.filteredTotal = newData.length;
    // newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    // newData = this._dataTableService.pageData(newData, this.fromRow, (this.currentPage + 1) * this.pageSize);
    this.filteredData = newData;
  }

  /**
   * return do need to query data again?
   * @param pagingEvent 
   */
  page(pagingEvent: IPageChangeEvent): boolean {
    let currentPage = this.currentPage;
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page - 1;
    this.pageSize = pagingEvent.pageSize;

    return currentPage !== this.currentPage;
  }
}