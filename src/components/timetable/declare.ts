interface TimeTableInterface {
  monFirst?: boolean;
  format?: (year: string | number, month: string | number) => any[];
  weeks: string[];
  tableMode: 'month' | 'week' | 'monthRange';
  lunar?: any;
  useSwipe: boolean;
  tableIndex?: number;
  timestamp?: number;
  year?: string | number
  month?: string | number
  day?: string | number
  begin?: string;
  end?: string;
  completion: boolean;
  holidays?: {[key: string]: string};
  tileContent: {className?: string, tileContent?: string}[];
  remarks: {[key: string]: string};
  selectMode: 'select' | 'multi' | 'range' | 'multiRange';
  selectDate?: string | string[] | {start?: string, end?: string} | {start?: string, end?: string}[]
  disabled: string[];
};

interface SwipeInterface {
  initialSlide?: number;
  auto?: number;
  speed: number;
  loop?: boolean;
}

interface SlideInterface {
  className?: string;
}

type startType = {
  x: number;
  y: number;
  time: number;
}

type deltaType = {
  x: number;
  y: number;
}

export {
  SwipeInterface,
  SlideInterface,
  startType,
  deltaType,
  TimeTableInterface,
}
