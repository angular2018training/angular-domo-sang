import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[appRootConfirmEqualValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: RootConfirmEqualValidatorDirective,
        multi: true
    }]
})

export class RootConfirmEqualValidatorDirective implements Validator {
    @Input() appRootConfirmEqualValidator:  string;
    validate(control: AbstractControl): { [key: string]: any} | null {
        const controlToCompare = control.parent.get(this.appRootConfirmEqualValidator);
        if (controlToCompare.value !== control.value){
            controlToCompare.setErrors({
                 'notEqual' : true
            });
        }else if (controlToCompare.value == control.value){
            controlToCompare.setErrors({
                 'notEqual' : false
            });            
        }

        return null;
    }
}