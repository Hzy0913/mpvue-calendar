import calendar from '../../calendarinit'
function getToday() {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
}

function date2ymd(date: string): number[] {
  const [y, m, d] = date.split('-');
  return [Number(y), Number(m), Number(d)];
}

function getLunarInfo(y: string, m: string, d: string) {
  const lunarInfo = calendar.solar2lunar(y, m, d) as any;
  const {Term, lMonth, lDay, lYear} = lunarInfo || {};
  let yearEve = '';
  if (lMonth === 12 && lDay === calendar.monthDays(lYear, 12)) {
    yearEve = '除夕';
  }
  let lunarValue = lunarInfo.IDayCn;
  let isLunarFestival = false;
  let isGregorianFestival = false;
  // if (this.festival.lunar[`${lunarInfo.lMonth}-${lunarInfo.lDay}`]) {
  //   lunarValue = this.festival.lunar[`${lunarInfo.lMonth}-${lunarInfo.lDay}`];
  //   isLunarFestival = true;
  // } else if (this.festival.gregorian[`${m}-${d}`]) {
  //   lunarValue = this.festival.gregorian[`${m}-${d}`];
  //   isGregorianFestival = true;
  // }
  const lunarInfoObj = {
    date: `${y}-${m}-${d}`,
    lunar: yearEve || Term || lunarValue,
    isLunarFestival,
    isGregorianFestival,
    isTerm: !!yearEve || lunarInfo.isTerm
  };
  // if (Object.keys(this.almanacs).length) {
  //   Object.assign(lunarInfoObj, {
  //     almanac: this.almanacs[`${m}-${d}`] || '',
  //     isAlmanac: !!this.almanacs[`${m}-${d}`]
  //   });
  // }
  return lunarInfoObj;
}

function computedPrevYear(year: string, month: string): number {
  if ((Number(month) - 1) < 0) {
    return Number(year) - 1;
  }

  return +year;
}

function computedPrevMonth(month: string): number {
  if ((Number(month) - 1) === 0) {
    return 12;
  } else {
   return Number(month) - 1;
  }
}

function computedNextYear(year: string, month: string): number {
  if ((Number(month) + 1) > 12) {
    return Number(year) + 1;
  }
  return Number(year);
}

function computedNextMonth(month: string) {
  let value = month;
  if ((Number(month) + 1) > 12) {
    return 1;
  } else {
    return Number(month) + 1;
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
  // if (!isToday) return false;
  // return weekMode ? isToday : (Number(todayString.split('-')[1]) === month + 1);
}

const rangeOption = function({date, isWeekMode, rangeDate, playload, weekSwitch, getEvents, getLunarInfo, disabledDateHandle}: any) {
  const [year, month, day] = date2ymd(date);
  const lastDay = new Date(year, month - 1, 0).getDate() === day ? {lastDay: true} : null;
  const options = Object.assign(
    {day},
    getLunarInfo(year, month, day),
    getEvents(year, month, day),
    lastDay
  );
  const [rangeBegin, rangeEnd] = rangeDate || [];
  const [beginY, beginM, beginD] = rangeBegin.split('-').map(Number);
  const [endY, endM, endD] = rangeEnd.split('-').map(Number);
  const isMonthModeCurrentMonth = !weekSwitch && !playload;

  if (isWeekMode || isMonthModeCurrentMonth) {
    (rangeBegin === date) && (options.rangeClassName = 'mc-range-begin');
    (rangeEnd === date) && (options.rangeClassName = 'mc-range-end');
  }

  if (year === endY && month === endM && day === endD) {
    options.rangeClassName = options.rangeClassName ? ['mc-range-begin', 'mc-range-second-to-last'] : 'mc-range-second-to-last';
  }

  if (rangeBegin) {
    const beginStamp = +new Date(beginY, beginM - 1, beginD);
    const endStamp = +new Date(endY, endM - 1, endD);
    const currentStamp = +new Date(year, month - 1, day);
    if (beginStamp <= currentStamp && endStamp >= currentStamp) {
      options.selected = true;
    }
  }

  if (rangeEnd) {
    const beginStamp = +new Date(beginY, beginM - 1, beginD);
    if (beginStamp > +new Date(year, month, day)) {
      options.disabled = true;
    }
  }

  if (playload && !weekSwitch) {
    options.disabled = true;
  } else if (disabledDateHandle.isDisabled(date)) {
    options.disabled = true;
  }

  const monthFirstDay = `${year}-${month}-1`;
  const monthLastDay = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
  if (monthFirstDay === date && options.selected && !options.rangeClassName) {
    options.rangeClassName = 'mc-range-month-first';
  }
  if (monthLastDay === date && options.selected && !options.rangeClassName) {
    options.rangeClassName = 'mc-range-month-last';
  }

  isCurrentMonthToday(date) && (options.isToday = true);
  (!weekSwitch && playload) && (options.selected = false);
  return options;
}

const multiOption = function({value, date, begin, end, isWeekMode, rangeDate, playload, weekSwitch, getEvents, getLunarInfo, disabledDateHandle}: any) {
  const [year, month, day] = date2ymd(date);
  const [beginY, beginM, beginD] = begin.split('-').map(Number);
  const [endY, endM, endD] = end.split('-').map(Number);

  const isSelected = value.includes(date);
  let options = Object.assign(
    {day, selected: isSelected},
    getLunarInfo(year, month, day),
    getEvents(year, month, day),
  );

  if (isSelected) {
    if (begin) {
      const beginStamp = +new Date(beginY, beginM - 1, beginD);
      if (beginStamp > +new Date(year, month - 1, day)) {
        options.disabled = true;
      }
    }

    if (end) {
      const endStamp = +new Date(endY, endM - 1, endD);
      if (endStamp < +new Date(year, month, day)) {
        options.disabled = true;
      }
    }

    if (disabledDateHandle.isDisabled(date)) {
      options.disabled = true;
    }
  }

  isCurrentMonthToday(options) && (options.isToday = true);

  if (playload && !weekSwitch) {
    options.disabled = true;
    options.selected = false;
  }

  return options;
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
function selectOption({year, month, i, selectDate, date, isWeekMode, playload, weekSwitch, getEvents, disabledDateHandle}: any) {
  const options: any = Object.assign(
    {day: i, selected: selectDate === `${year}-${month}-${i}`},
    getLunarInfo(year, month, i),
    // getEvents(year, month, i)
  );

  // if (this.begin.length) {
  //   const beginTime = +new Date(parseInt(this.begin[0], 10), parseInt(this.begin[1], 10) - 1, parseInt(this.begin[2], 10));
  //   if (beginTime > Number(new Date(year, month, i))) {
  //     options.disabled = true;
  //   }
  // }
  // if (this.end.length) {
  //   const endTime = +new Date(parseInt(this.end[0], 10), parseInt(this.end[1], 10) - 1, parseInt(this.end[2], 10));
  //   if (endTime < +(new Date(year, month, i))) {
  //     options.disabled = true;
  //   }
  // }


    if (disabledDateHandle.isDisabled(date)) {
      options.disabled = true;
    }

    isCurrentMonthToday(options) && (options.isToday = true);
    //
    // if (playload && !weekSwitch) {
    //   options.disabled = true;
    //   options.selected = false;
    // }
    return options;
}

const disabledDate = (function() {
  let disabledDate: any = {};
  return function() {
    return {
      update(disabled: any[]) {
        disabledDate = disabled.reduce((previousValue, currentValue) => {
          previousValue[currentValue] = true;
          return previousValue;
        }, {});

        return disabledDate;
      },
      isDisabled(date: string) {
        return !!disabledDate[date];
      }
    }
  }
})();

export {
  getToday,
  rangeOption,
  multiOption,
  selectOption,
  disabledDate,
  computedPrevYear,
  computedPrevMonth,
  computedNextYear,
  computedNextMonth
}
