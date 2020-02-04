import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function SpecialCharacter(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];

        if (control.errors && !control.errors.SpecialCharactersExist) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        // set error on matchingControl if validation fails
        if (format.test(control.value)) {
            console.log("characters exist");
            control.setErrors({ SpecialCharactersExist: true });
        } else {
            console.log("characters exist else part");
            control.setErrors(null);
        }
    }
}