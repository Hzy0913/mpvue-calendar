import { computedNextMonth, computedPrevMonth, getToday, computedNextYear } from '../utils';

function date2ymd(date: string): number[] {
  const [y, m, d] = date.split('-');
  return [Number(y), Number(m), Number(d)];
}

function date2timeStamp(date: string): number {
  const [y, m, d] = date2ymd(date);
  return +new Date(y, m - 1, d);
}

function getLunarInfo(y: string, m: string, d: string, lunar: any) {
  const date = `${y}-${m}-${d}`;
  if (!lunar) {
    return { date };
  }

  const lunarInfo = lunar.solar2lunar(y, m, d) as any;
  const { Term, lMonth, lDay, lYear } = lunarInfo || {};
  const { lunarHoliday, gregorianHoliday } = lunar || {};
  const lunarValue = lunarInfo.IDayCn;
  const yearEve = lMonth === 12 && lDay === lunar.monthDays(lYear, 12) ? '除夕' : undefined;

  const lunarInfoObj = {
    date,
    lunar: Term || lunarValue,
    gregorianHoliday: gregorianHoliday?.[`${m}-${d}`],
    lunarHoliday: lunarHoliday?.[`${lMonth}-${lDay}`] || yearEve,
    isTerm: !!yearEve || lunarInfo.isTerm
  };
  return lunarInfoObj;
}

const setRemark = (function () {
  let remarksInfo: any = {};

  return function () {
    return {
      update(remarks: any = {}) {
        remarksInfo = remarks;
      },
      getRemark(date: string) {
        if (remarksInfo) {
          return {
            remark: remarksInfo[date]
          };
        }
      }
    };
  };
}());

function computedPrevDay(year: string, month: string, day: string | number): string {
  if ((Number(day) - 1) === 0) {
    const prevMonth = computedPrevMonth(month);
    if (prevMonth === 12) { //prev year
      const prevYear = Number(year) - 1;
      const prevDay = new Date(prevYear, prevMonth - 2, 0).getDate();
      return `${prevYear}-${prevMonth}-${prevDay}`;
    } else { //current year and prev month
      const prevDay = new Date(Number(year), prevMonth, 0).getDate();
      return `${year}-${prevMonth}-${prevDay}`;
    }
  } else {
    return `${year}-${month}-${Number(day) - 1}`;
  }
}

function computedNextDay(year: string, month: string, day: string): string {
  const lastDateOfCurrentMonth = new Date(Number(year), Number(month), 0).getDate(); //last date of current month

  if ((Number(day) + 1) > lastDateOfCurrentMonth) {
    const nextMonth = computedNextMonth(month);
    if (nextMonth === 1) { //next year
      const nextYear = computedNextYear(year, month);
      const nextDay = new Date(nextYear, 0, 1).getDate();
      return `${nextYear}-1-${nextDay}`;
    } else { //current year and next month
      const nextDay = new Date(Number(year), nextMonth - 1, 1).getDate();
      return `${year}-${nextMonth}-${nextDay}`;
    }
  } else {
    return `${year}-${month}-${Number(day) + 1}`;
  }
}

type rangeOptionType = {
  date: string;
  isWeekMode: boolean;
  rangeDate: [string, string];
  getLunarInfo: (year: number, month: number, day: number) => any;
  getEvents: (year: number, month: number, day: number) => any;
}

function isCurrentMonthToday(date: string) {
  const todayString = getToday();
  return todayString === date;
}

function rangeOption({selectDate, date}: any) {
  const { start, end } = selectDate;
  if (start === date) {
    const notCompleteClassName = end ? '' : ' selected-range-not-complete';
    return 'vc-day-selected selected-range-start' + notCompleteClassName;
  }
  if (end === date) {
    return 'vc-day-selected selected-range-end';
  }

  if (start && end && date) {
    const startTimeStamp: number = date2timeStamp(start);
    const endTimeStamp: number = date2timeStamp(end);
    const currentTimeStamp: number = date2timeStamp(date);

    if (startTimeStamp < currentTimeStamp && currentTimeStamp < endTimeStamp) {
      return 'vc-day-selected selected-range-includes';
    }
  }
}

function multiRangeOption({selectDate = [], date}: any) {
  let className;
  selectDate.some((selectItem: any) => {
    const { start, end } = selectItem;
    if (start === date) {
      const notCompleteClassName = end ? '' : ' selected-range-not-complete';
      className = 'vc-day-selected selected-range-start' + notCompleteClassName;
      return true;
    }
    if (end === date) {
      className = 'vc-day-selected selected-range-end';
      return true;
    }

    if (start && end && date) {
      const startTimeStamp: number = date2timeStamp(start);
      const endTimeStamp: number = date2timeStamp(end);
      const currentTimeStamp: number = date2timeStamp(date);

      if (startTimeStamp < currentTimeStamp && currentTimeStamp < endTimeStamp) {
        className = 'vc-day-selected selected-range-includes';
        return true;
      }
    }
  });
  return className;
}

function multiOption({selectDate, date}: any) {
  return selectDate.includes(date) ? 'vc-day-selected' : undefined;
}

function selectOption({date, selectDate}: any) {
  return selectDate === date ? 'vc-day-selected' : undefined;
}

type selectOptionType = {
  date: string;
  playload: any;
  isWeekMode: boolean;
  weekSwitch: boolean;
  selectDate: string;
  getLunarInfo: (year: number, month: number, day: number) => any;
  getEvents: (year: number, month: number, day: number) => any;
}

const disabledDate = (function () {
  let disabledDates: any = {};
  return function () {
    return {
      update(disabled: any[] = []) {
        disabledDates = disabled.reduce((previousValue, currentValue) => {
          previousValue[currentValue] = true;
          return previousValue;
        }, {});

        return disabledDate;
      },
      isDisabled(date: string) {
        return !!disabledDates[date];
      }
    };
  };
}());

const setTileContent = (function () {
  let tileContentInfo: any = {};

  return function () {
    return {
      update(tileContent: any) {
        tileContentInfo = tileContent || [];
      },
      getTileContent(date: string) {
        return {
          tileContent: (tileContentInfo || {})[date]
        };
      }
    };
  };
}());

export {
  getToday,
  rangeOption,
  multiOption,
  multiRangeOption,
  selectOption,
  disabledDate,
  setRemark,
  setTileContent,
  getLunarInfo,
  computedPrevMonth,
  computedNextYear,
  isCurrentMonthToday,
  date2timeStamp,
  computedNextDay,
  computedPrevDay,
  date2ymd,
};
