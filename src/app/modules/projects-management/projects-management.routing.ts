import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsManagementPage } from './pages/projects-management/projects-management.page';
import { ProjectAddPage } from './pages/project-add/project-add.page';
import { ProjectEditPage } from './pages/project-edit/project-edit.page';
import { DashBoardPage } from './pages/project-dashBoard/pages/dash-board/dash-board.page';
import { KeyFindingsPage } from './pages/project-dashBoard/pages/key-findings/key-findings.page';
import { AppendixPage } from './pages/project-dashBoard/pages/appendix/appendix.page';
import { DashBoardComponent } from './pages/project-dashBoard/components/dash-board/dash-board.component';
import { PreviewReportComponent } from './pages/project-dashBoard/pages/preview-report/preview-report.component';
import { AuthGuardService } from '../../core/services/auth-guard.service';

const routes: Routes = [
  {
    path: '', canActivateChild: [AuthGuardService], children: [
      { path: '', canActivateChild: [AuthGuardService], component: ProjectsManagementPage },
      { path: 'add', canActivateChild: [AuthGuardService], component: ProjectAddPage },
      { path: 'edit', canActivateChild: [AuthGuardService], component: ProjectEditPage },
      { path: 'project-dash-board', canActivateChild: [AuthGuardService], component: DashBoardComponent,
        children: [
          { path: '', canActivateChild: [AuthGuardService], redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', canActivateChild: [AuthGuardService], component: DashBoardPage },
          { path: 'key-findings', canActivateChild: [AuthGuardService], component: KeyFindingsPage },
          { path: 'appendix', canActivateChild: [AuthGuardService], component: AppendixPage },
        ]
      },
      { path: 'preview-report', component: PreviewReportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsManagementRoutingModule { }
