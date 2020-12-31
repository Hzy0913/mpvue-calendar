const getToday = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
}

function date2ymd(date: string): number[] {
  const [y, m, d] = date.split('-');
  return [Number(y), Number(m), Number(d)];
}

type rangeOptionType = {
  date: string;
  isWeekMode: boolean;
  rangeDate: [string, string];
  getLunarInfo: (year: number, month: number, day: number) => any;
  getEvents: (year: number, month: number, day: number) => any;
}

const rangeOption = function({date, isWeekMode, rangeDate, playload, weekSwitch, getEvents, getLunarInfo, disabledDateHandle, isCurrentMonthToday, isCurrentMonthToday}: rangeOptionType) {
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

const multiOption = function({value, date, begin, end, isWeekMode, rangeDate, playload, weekSwitch, getEvents, getLunarInfo, disabledDateHandle, isCurrentMonthToday, isCurrentMonthToday}: rangeOptionType) {
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

const selectOption = function({value, date, begin, end, isWeekMode, rangeDate, playload, weekSwitch, getEvents, getLunarInfo, disabledDateHandle, isCurrentMonthToday, isCurrentMonthToday}: rangeOptionType) {
  // value: sting
  const [year, month, day] = date2ymd(date);
  const [beginY, beginM, beginD] = begin.split('-').map(Number);
  const [endY, endM, endD] = end.split('-').map(Number);

  const options = Object.assign(
    {day, selected: date === value},
    getLunarInfo(year, month, day),
    getEvents(year, month, day)
  );

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


  isCurrentMonthToday(date) && (options.isToday = true);
  if (playload && !weekSwitch) {
    options.disabled = true;
    options.selected = false;
  }

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
}
