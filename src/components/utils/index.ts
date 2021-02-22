function noop() {} // eslint-disable-line

function computedNextYear(year: string | number, month: string | number): number {
  if ((Number(month) + 1) > 12) {
    return Number(year) + 1;
  }
  return Number(year);
}

function computedPrevYear(year: string | number, month: string | number): number {
  if ((Number(month) - 1 - 1) < 0) {
    return Number(year) - 1;
  }

  return +year;
}

function date2ymd(date: string): number[] {
  const [y, m, d] = date.split('-');
  return [Number(y), Number(m), Number(d)];
}

function offloadFn(fn: any) {
  setTimeout(fn || noop, 0);
}

function language(): string {
  return (navigator.language || (navigator as any).browserLanguage).toLowerCase();
}

function isZh(languageValue?: string) {
  if (languageValue) {
    return languageValue === 'cn';
  }
  return language() === 'zh-cn';
}

const enWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const zhWeeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const zhMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

function getWeeks(languageParam: string) {
  return isZh(languageParam) ? zhWeeks : enWeeks;
}

function getMonths(languageParam: string | undefined) {
  return isZh(languageParam) ? zhMonths : enMonths;
}

function computedNextMonth(month: string | number) {
  if ((Number(month) + 1) > 12) {
    return 1;
  } else {
    return Number(month) + 1;
  }
}

function computedPrevMonth(month: string | number): number {
  if ((Number(month) - 1) === 0) {
    return 12;
  } else {
    return Number(month) - 1;
  }
}

function getDateByCount(date: string, count: number): string {
  const [y, m, d] = date2ymd(date);
  const timestamp = +new Date(y, m - 1, d);
  const dateObj = new Date(timestamp + count * 86400000);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  return `${year}-${month + 1}-${day}`;
}

function getPrevDate(year: string | number, month: string | number, day?: string | number): any[] {
  if (day) {
    return date2ymd(getDateByCount(`${year}-${month}-${day}`, -7));
  }
  return [computedPrevYear(year, month), computedPrevMonth(month)];
}

function getNextDate(year: string | number, month: string | number, day?: string | number): any[] {
  if (day) {
    return date2ymd(getDateByCount(`${year}-${month}-${day}`, 7));
  }
  return [computedNextYear(year, month), computedNextMonth(month)];
}

function delay(time?: number) {
  return new Promise(resolve => setTimeout(() => resolve(), time || 0));
}

function getToday(needArray?: boolean) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (needArray) {
    return [year, month, day];
  }
  return [year, month, day].join('-');
}

function getSomeNextMonths(year: string | number, month: string | number, count: number) {
  let currentYear = year;
  let currentMonth = month;
  return Array.from({length: count}).map((v, index) => {
    if (!index) {
      return `${currentYear}-${currentMonth}`;
    }
    const [y, m] = getNextDate(currentYear, currentMonth);
    currentYear = y;
    currentMonth = m;
    return `${currentYear}-${currentMonth}`;
  });
}

export {
  noop,
  isZh,
  delay,
  language,
  offloadFn,
  zhWeeks,
  enWeeks,
  date2ymd,
  getDateByCount,
  computedNextMonth,
  computedPrevMonth,
  getPrevDate,
  getNextDate,
  getToday,
  getWeeks,
  getMonths,
  computedPrevYear,
  computedNextYear,
  getSomeNextMonths,
};
