export interface Options {
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export interface FormControlObject {
  key: string;
  type: string;
  options: Options;
}
