export interface Measurement {
  _id: string;
  name: string;
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'time'
    | 'datetime'
    | 'file'
    | 'image'
    | 'enum';
  required: boolean;
  unit: 'mm' | 'kg' | 'm' | 's' | 'min' | 'h' | 'd' | '°C' | '°F' | '°K';
  hidden?: boolean;
}
