import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const dateAfterValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const startDate = new Date(control.get("startDate").value);
  const endDate = new Date(control.get("endDate").value);

  return startDate && endDate && endDate >= startDate
    ? { dateAfter: true }
    : null;
};
