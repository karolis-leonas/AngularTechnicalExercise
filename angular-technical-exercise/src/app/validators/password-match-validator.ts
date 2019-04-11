import {FormControl} from '@angular/forms';

export function InputMatchValidator(otherInputName: string) {
  let thisInput: FormControl;
  let otherInput: FormControl;

  return function validateOtherInputMatch(input: FormControl) {
    if (!input.parent) {
      return null;
    }

    if (!thisInput) {
      thisInput = input;
      otherInput = input.parent.get(otherInputName) as FormControl;
      if (!otherInput) {
        throw new Error('matchOtherPasswordValidate(): other input is not found in parent group');
      }
      otherInput.valueChanges.subscribe(() => {
        thisInput.updateValueAndValidity();
      });
    }

    if (!otherInput) {
      return null;
    }

    if (otherInput.value !== thisInput.value) {
      return {
        matchOther: true
      };
    }

    return null;
  }
}
