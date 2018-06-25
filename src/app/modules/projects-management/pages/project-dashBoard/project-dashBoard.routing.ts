import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { DashBoardPage } from './pages/dash-board/dash-board.page';
import { KeyFindingsPage } from './pages/key-findings/key-findings.page';
import { AppendixPage } from './pages/appendix/appendix.page';
import { PreviewReportComponent } from './pages/preview-report/preview-report.component';
import { AuthGuardService } from '../../../../core/services/auth-guard.service';

const routes: Routes = [
   {
    path: '', canActivateChild: [AuthGuardService], component: DashBoardComponent,
    children: [
      { path: '', canActivateChild: [AuthGuardService], component: DashBoardPage },
      { path: 'dash-board', canActivateChild: [AuthGuardService], component: DashBoardPage },
      { path: 'key-findings', canActivateChild: [AuthGuardService], component: KeyFindingsPage },
      { path: 'appendix', canActivateChild: [AuthGuardService], component: AppendixPage }
    ]
  },
  { path: 'preview-report', component: PreviewReportComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectDashBoardRouting { }
