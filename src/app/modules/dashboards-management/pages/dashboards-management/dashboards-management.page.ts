import { AuthService } from './../../../../core/services/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { ChartAddDialogComponent } from "../../components/chart-add-dialog/chart-add-dialog.component";
import { LayoutEditDialogComponent } from "../../components/layout-edit-dialog/layout-edit-dialog.component";

@Component({
  selector: 'app-dashboards-management',
  templateUrl: './dashboards-management.page.html',
  styleUrls: ['./dashboards-management.page.scss']
})
export class DashboardsManagementPage implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _UtilitiesService: UtilitiesService,
    private authService: AuthService
  ) { 

    this.authService.updatePasswordExpired();
  }
  dashboards = [
    {
      id: 1,
      label: 'Dashboard 001'
    },
    {
      id: 2,
      label: 'Dashboard 002'
    },
    {
      id: 3,
      label: 'Dashboard 003'
    },
    {
      id: 4,
      label: 'Dashboard 004'
    }
  ]

  ngOnInit() {
  }
  createDashboard() {
    this.router.navigate(['/dashboards-management/create']);
  }
  editDashboard() {
    this.router.navigate(['/dashboards-management/edit']);
  }
  addChart(event) {
    const dialogRef = this.dialog.open(ChartAddDialogComponent, {
      width: '90vw',
      height: '90vh',
      disableClose: true,
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  editLayout() {
    const dialogRef = this.dialog.open(LayoutEditDialogComponent, {
      width: '50vw',
      height: '350px',
      disableClose: true,
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  deleteBuilding(event){
    event.preventDefault();
    event.stopPropagation();
    this._UtilitiesService.showConfirmDialog('tags.message.confirmDelete', (res) => { });
  }
}
