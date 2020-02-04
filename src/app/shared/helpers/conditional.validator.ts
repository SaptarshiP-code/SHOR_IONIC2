import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function Lessthen10(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];

        if (control.errors && !control.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value < 10) {
           // console.log("less then 10");
            control.setErrors({ lessthen10: true });
        } else {
            control.setErrors(null);
        }
    }
}