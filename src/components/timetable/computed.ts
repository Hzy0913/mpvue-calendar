import calendar from '../../calendarinit'
function getToday() {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
}

function date2ymd(date: string): number[] {
  const [y, m, d] = date.split('-');
  return [Number(y), Number(m), Number(d)];
}

function date2timeStamp(date: string): number {
  const [y, m, d] = date2ymd(date);
  return +new Date(y, m, d);
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

const setRemark = (function() {
  let remarksInfo: any = {};

  return function() {
    return {
      update(remarks: any) {
        remarksInfo = remarks;
      },
      getRemark(date: string) {
        if (remarksInfo) return {
          remark: remarksInfo[date]
        };
      }
    }
  }
})()

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
}

const rangeOption = function({selectDate, date}: any) {
  const { start, end } = selectDate;
  if (start === date) {
    return 'selected selected-range-start'
  }
  if (end === date) {
    return 'selected selected-range-end'
  }

  if (start && end && date) {
    const startTimeStamp: number = date2timeStamp(start);
    const endTimeStamp: number = date2timeStamp(end);
    const currentTimeStamp: number = date2timeStamp(date);
    if (startTimeStamp < currentTimeStamp && currentTimeStamp < endTimeStamp) {
      return 'selected selected-range-includes'
    }
  }
}

const multiOption = function({selectDate, date, begin, end, isWeekMode, rangeDate, playload, weekSwitch, getEvents, getLunarInfo, disabledDateHandle}: any) {
  console.log(selectDate,date, 111 )

  return selectDate.includes(date) ? 'selected' : undefined;

  // const [year, month, day] = date2ymd(date);
  // const [beginY, beginM, beginD] = begin.split('-').map(Number);
  // const [endY, endM, endD] = end.split('-').map(Number);
  //
  // const isSelected = value.includes(date);
  // let options = Object.assign(
  //   {day, selected: isSelected},
  //   getLunarInfo(year, month, day),
  //   getEvents(year, month, day),
  // );
  //
  // if (isSelected) {
  //   if (begin) {
  //     const beginStamp = +new Date(beginY, beginM - 1, beginD);
  //     if (beginStamp > +new Date(year, month - 1, day)) {
  //       options.disabled = true;
  //     }
  //   }
  //
  //   if (end) {
  //     const endStamp = +new Date(endY, endM - 1, endD);
  //     if (endStamp < +new Date(year, month, day)) {
  //       options.disabled = true;
  //     }
  //   }
  //
  //   if (disabledDateHandle.isDisabled(date)) {
  //     options.disabled = true;
  //   }
  // }
  //
  // isCurrentMonthToday(options) && (options.isToday = true);
  //
  // if (playload && !weekSwitch) {
  //   options.disabled = true;
  //   options.selected = false;
  // }
  //
  // return options;
}
function selectOption({date, selectDate}: any) {
  return selectDate === date ? 'selected' : undefined;
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

const setTileContent = (function() {
  let tileContentInfo: any = {};

  return function() {
    return {
      update(tileContent: any[]) {
        tileContentInfo = tileContent
      },
      getTileContent(date: string) {
        return {
          tileContent: (tileContentInfo || {})[date]
        };
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
  setRemark,
  setTileContent,
  getLunarInfo,
  computedPrevYear,
  computedPrevMonth,
  computedNextYear,
  computedNextMonth,
  isCurrentMonthToday,
  date2timeStamp,
}
