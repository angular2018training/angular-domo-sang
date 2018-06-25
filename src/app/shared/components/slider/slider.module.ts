import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SliderComponent } from './ng2-slider-component/ng2-slider.component';
import { SlideAbleDirective } from './ng2-slideable-directive/slideable.directive';
import { Ng2StyledDirective } from './ng2-styled-directive/ng2-styled.directive';


@NgModule({
    imports: [
        CommonModule

    ],
    declarations: [
        SlideAbleDirective,
        Ng2StyledDirective,
        Ng2SliderComponent
    ],
    exports: [
        SlideAbleDirective,
        Ng2StyledDirective,
        Ng2SliderComponent
    ]
})
export class SliderModule {

}