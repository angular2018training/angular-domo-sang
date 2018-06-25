import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatSelectModule, MatSidenavModule, MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatExpansionModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatStepperModule, MatAutocompleteModule, MatSlideToggleModule, MatCardModule, MatGridListModule, MatSliderModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CovalentDataTableModule, CovalentPagingModule, CovalentLoadingModule, CovalentFileModule } from '@covalent/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { DndModule } from 'ng2-dnd';

// Common components
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { DropdownButton } from './components/dropdown-button/dropdown-button.component';
import { SelectLanguageComponent } from './components/select-language/select-language.component';
// Services
import { CommonService } from './services/common.service';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { ImportComponent, ImportDialog } from './components/import/import.component';
import { ExportComponent } from './components/export/export.component';
import { NgDatepickerModule } from 'ng2-datepicker';

import { RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { SliderModule } from './components/slider/slider.module';
import { CommonDialogComponent } from './components/dialog/common-dialog.component';
import { MultilSelectComponent } from './components/multil-select/multil-select.component';
import { ConfirmEqualValidatorDirective } from './components/confirm-password/confirm-equal-validator.directive';
import { RootConfirmEqualValidatorDirective } from './components/root-confirm-password/confirm-equal-validator.directive';
import { DatexPipe } from './components/datex/datex.pipe';
import { ChartModule } from '../chart/chart.module';

@NgModule({
  declarations: [
    PageHeaderComponent,
    DropdownButton,
    SelectLanguageComponent,
    ImportComponent,
    ExportComponent,
    ImportDialog,
    CommonDialogComponent,
    MultilSelectComponent,
    ConfirmEqualValidatorDirective,
    RootConfirmEqualValidatorDirective,
    DatexPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule, MatTabsModule,
     MatSelectModule, MatSidenavModule, 
     MatIconModule, MatButtonModule, 
     MatTooltipModule, MatMenuModule, 
     MatExpansionModule, MatDialogModule, 
     MatInputModule, MatFormFieldModule, 
     MatCheckboxModule, MatDatepickerModule, 
     MatNativeDateModule, MatRadioModule, 
     MatAutocompleteModule, MatSlideToggleModule, 
     MatCardModule, MatGridListModule, MatSliderModule,
     MatSelectModule,
    FlexLayoutModule,
    CovalentDataTableModule, CovalentPagingModule, CovalentLoadingModule, CovalentFileModule,
    RouterModule,
    NgDatepickerModule,
    RecaptchaModule.forRoot(),
    TranslateModule.forChild(),
    ChartModule,
    SliderModule,
    DndModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatStepperModule, MatTabsModule, 
    MatSelectModule, MatSidenavModule, 
    MatIconModule, MatButtonModule, 
    MatTooltipModule, MatMenuModule, 
    MatExpansionModule, MatDialogModule, 
    MatInputModule, MatFormFieldModule, 
    MatCheckboxModule, MatDatepickerModule, 
    MatNativeDateModule, MatRadioModule, 
    MatAutocompleteModule, MatSlideToggleModule, 
    MatCardModule, MatGridListModule, MatSliderModule,
    MatSelectModule,
    FlexLayoutModule,
    CovalentDataTableModule, CovalentPagingModule, CovalentLoadingModule, CovalentFileModule,
    RouterModule,
    TranslateModule,
    NgDatepickerModule,
    RecaptchaModule,
    SliderModule,
    DndModule,
    // components
    PageHeaderComponent,
    DropdownButton,
    SelectLanguageComponent,
    ImportComponent,
    ExportComponent,
    CommonDialogComponent,
    MultilSelectComponent,
    DatexPipe,
    ChartModule,
    ConfirmEqualValidatorDirective,
    RootConfirmEqualValidatorDirective
  ],
  providers: [
    CommonService,
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'en', // TODO: Will change following to language
    },
  ],
  entryComponents: [
    ImportDialog
  ]
})
export class SharedModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: SharedModule,
  //     providers: [ CommonService ]
  //   };
  // }
}