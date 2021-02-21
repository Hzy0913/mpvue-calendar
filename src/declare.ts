interface CalendarInterface {
  monFirst?: boolean;
  completion?: boolean;
  useSwipe?: boolean;
  weeks?: string[];
  className?: string;
  language?: string;
  holidays: {[key: string]: string};
  tileContent: {[key: string]: any };
  remarks: {[key: string]: any };
  disabled: string[];
  begin: string[];
  end: string[];
  monthRange: string[];
  mode: 'monthRange' | 'week' | 'month';
  selectMode: 'select' | 'multi' | 'range' | 'multiRange';
  lunar: any;
  selectDate: any;
  format: (year: string, month: string) => string[];
}

export {
  CalendarInterface,
}
