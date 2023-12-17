export interface IcsField {
  name?: string;
  type?:
    | 'text'
    | 'number'
    | 'boolean'
    | 'date'
    | 'time'
    | 'datetime'
    | 'file'
    | 'image'
    | 'select';
  required?: boolean;
  unit?: 'mm' | 'kg' | 'm' | 's' | 'min' | 'h' | 'd' | '°C' | '°F' | '°K';
  description?: string;
  readonly?: boolean;
  hidden?: boolean;
}

// Deprecated
export interface DynamicFormFieldGroup {
  status: IcsField;
  name: IcsField;
  assetName: IcsField;
  assetNumber: IcsField;
  category: IcsField;
  manufacturer: IcsField;
  serialNumber: IcsField;
  creationDate: IcsField;
  year: IcsField;
  busSystem: IcsField;
}
