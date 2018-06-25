import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardsManagementRoutingModule } from './dashboards-management.routing';
import { DashboardsManagementPage } from './pages/dashboards-management/dashboards-management.page';
import { DashboardCreatePage } from './pages/dashboard-create/dashboard-create.page';
import { DashboardEditPage } from './pages/dashboard-edit/dashboard-edit.page';
import { ChartAddDialogComponent } from './components/chart-add-dialog/chart-add-dialog.component';
import { LayoutEditDialogComponent } from './components/layout-edit-dialog/layout-edit-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    DashboardsManagementRoutingModule
  ],
  declarations: [DashboardsManagementPage, DashboardCreatePage, DashboardEditPage, ChartAddDialogComponent, LayoutEditDialogComponent],
  providers: [],
  entryComponents: [
    ChartAddDialogComponent,
    LayoutEditDialogComponent
  ]
})
export class DashboardsManagementModule { }
