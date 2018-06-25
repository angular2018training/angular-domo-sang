import { ContextMenuComponent } from 'ngx-contextmenu';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { DndModule } from 'ng2-dnd';
import { QuillModule } from 'ngx-quill';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlideComponent } from '../../shared/components/slide/slide.component';
import { ProjectsManagementService } from './projects-management.service';
import { ProjectsManagementRoutingModule } from './projects-management.routing';
import { ProjectsManagementPage } from './pages/projects-management/projects-management.page';
import { DashBoardPage } from './pages/project-dashBoard/pages/dash-board/dash-board.page';
import { AppendixPage } from './pages/project-dashBoard/pages/appendix/appendix.page';
import { KeyFindingsPage } from './pages/project-dashBoard/pages/key-findings/key-findings.page';
import { PreviewReportComponent } from './pages/project-dashBoard/pages/preview-report/preview-report.component';

import { DashBoardComponent } from './pages/project-dashBoard/components/dash-board/dash-board.component';
import { ProjectAddPage } from './pages/project-add/project-add.page';
import { ProjectEditPage } from './pages/project-edit/project-edit.page';
import { SlidePropertiesComponent } from './pages/project-dashBoard/pages/slide-properties/slide-properties.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { CancelDialogComponent } from './components/cancel-dialog/cancel-dialog.component';
import { ProjectDashBoardService } from './pages/project-dashBoard/project-dashBoard.service';
import { ContextMenuModule } from 'ngx-contextmenu';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    SharedModule,
    ProjectsManagementRoutingModule,
    FlexLayoutModule,
    Ng2DragDropModule.forRoot(),
    DndModule.forRoot(),
    Daterangepicker,
    QuillModule,
    ContextMenuModule,
    ContextMenuModule.forRoot(),
    NgSelectModule
  ],
  providers: [
    ProjectsManagementService,
    ProjectDashBoardService
  ],
  declarations: [
    SlideComponent,
    ProjectsManagementPage,
    ProjectAddPage,
    ProjectEditPage,
    DashBoardComponent,
    DashBoardPage,
    AppendixPage,
    KeyFindingsPage,
    SlidePropertiesComponent,
    PreviewReportComponent,
    CancelDialogComponent
  ],
  entryComponents: [
    CancelDialogComponent
  ]
})
export class ProjectsManagementModule { }
