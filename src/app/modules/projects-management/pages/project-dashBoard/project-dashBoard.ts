import { NgModule, Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';

import { Ng2DragDropModule } from 'ng2-drag-drop';
import { DndModule } from 'ng2-dnd';
import { QuillModule } from 'ngx-quill';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ProjectDashBoardRouting } from './project-dashBoard.routing';
import { ProjectDashBoardService } from './project-dashBoard.service';
// import { DashBoardPage } from './pages/dash-board/dash-board.page';
// import { KeyFindingsPage } from './pages/key-findings/key-findings.page';
// import { AppendixPage } from './pages/appendix/appendix.page';
// import { PreviewReportComponent } from './pages/preview-report/preview-report.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ProjectDashBoardRouting,
    FlexLayoutModule,
    Ng2DragDropModule.forRoot(),
    DndModule.forRoot(),
    QuillModule
  ],
  declarations: [
  ],
   providers: [
    ProjectDashBoardService
  ],
  entryComponents: [
  ],
})

export class ProjectDashBoard { }
