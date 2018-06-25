import { Ch003Component } from './components/ch003/ch003.component';
import { ChartComponent } from './pages/chart/chart.component';
import { Ch006Component } from './components/ch006/ch006.component';
import { ChartService } from './chart.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { HeatMapComponent } from './pages/heat-map/heat-map.component';
import { Ch901Component } from './components/ch901/ch901.component';
import { LineStackedAreaComponent } from './pages/line-stacked-area/line-stacked-area.component';
import { PieChartComponent } from './pages/pie-chart/pie-chart.component';
import { ProgressChartComponent } from './pages/progress-chart/progress-chart.component';
import { StackedColumnComponent } from './pages/stacked-column/stacked-column.component';
import { StackedBarComponent } from './pages/stacked-bar/stacked-bar.component';
import { Ch002Component } from './components/ch002/ch002.component';
import { Ch004Component } from './components/ch004/ch004.component';
import { Ch008Component } from './components/ch008/ch008.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        // NgxChartsModule
        // SharedModule
    ],
    declarations: [
        StackedColumnComponent,
        StackedBarComponent,
        PieChartComponent,
        ProgressChartComponent,
        HeatMapComponent,
        LineStackedAreaComponent,
        ChartComponent,
        Ch901Component,
        Ch006Component,
        Ch003Component,
        Ch002Component,
        Ch004Component,
	Ch008Component
    ],
    exports: [
        StackedColumnComponent,
        StackedBarComponent,
        PieChartComponent,
        ProgressChartComponent,
        HeatMapComponent,
        LineStackedAreaComponent,
        ChartComponent,
        Ch901Component,
        Ch006Component,
        Ch003Component,
        Ch002Component,
        Ch004Component,
	Ch008Component
    ],
    providers: [
        ChartService
    ]
})
export class ChartModule {
    /* make sure ChartModule is imported only by one NgModule the AppModule */
    // constructor(
    //     @Optional() @SkipSelf() parentModule: ChartModule
    // ) {
    //     if (parentModule) {
    //         throw new Error('ChartModule is already loaded. Import only in AppModule');
    //     }
    // }
}
