export interface Option {
  option: string;
  weight: number;
}

export type AlertType = 'error' | 'success' | 'alert';

export interface AlertItem {
  id: number;
  message: string;
  type: AlertType;
}

export interface GenPassOptions {
  numOptions: number;
  passwordLength: number;
  segmentCount: number;
  useSegments: boolean;
  useCustomList: boolean;
  replaceChars: boolean;
  isAdvanced: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  passwordAmount: number;
}
