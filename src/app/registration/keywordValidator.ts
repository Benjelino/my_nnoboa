import { AbstractControl } from "@angular/forms";

export function ValidateUrl(control: AbstractControl) {
  const RESERVED_NAMES = ["root", "admin", "webmaster", "username", "password"];

  if (RESERVED_NAMES.some((x) => x == control?.value)) {
    return {
      reservedName: true,
    };
  }

  return null;
}
