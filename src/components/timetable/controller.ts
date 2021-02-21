import { date2timeStamp } from './computed';

function singleSelect(selectDate: string, date: string) {
  return date;
}

function multiSelect(selectDate: string[] = [], date: string) {
  const index = selectDate.indexOf(date);
  if (~index) {
    selectDate.splice(index, 1);
    return selectDate;
  }

  selectDate.push(date);
  return selectDate;
}

function rangeSelect(selectDate: { start?: string; end?: string }, date: string) {
  const { start, end } = selectDate;

  if (start && end) {
    return {
      start: date,
      end: ''
    };
  }

  if (start) {
    if (start === date) {
      return {};
    }

    if (date2timeStamp(start) > date2timeStamp(date)) {
      return {
        start: date,
        end: start
      };
    }

    return {
      start,
      end: date,
    };
  }

  return {
    start: date,
    end,
  };
}

function multiRange(selectDates: { start?: string; end?: string }[], date: string) {
  const selects = [...selectDates];
  let deleteIndex;

  if (!selects.length) {
    selects.push({start: date});
    return selects;
  }

  const searchResult = selects.some((selectItem: any, index: number) => {
    const { start, end } = selectItem;
    if (start && end) {
      if (date2timeStamp(start) < date2timeStamp(date) && date2timeStamp(date) < date2timeStamp(end)) {
        return true;
      }

      if (start === date || end === date) {
        deleteIndex = index;
        return true;
      }
    } else if (start) {
      const selectItemDate: { start: string; end: string } = { start: '', end: '' };
      if (start === date) {
        deleteIndex = index;
        return true;
      }
      if (date2timeStamp(start) > date2timeStamp(date)) {
        selectItemDate.start = date;
        selectItemDate.end = start;
      } else {
        selectItemDate.start = start;
        selectItemDate.end = date;
      }

      let isIncludeOtherRange;
      if (selects.length > 1) {
        isIncludeOtherRange = selects.some((item: any, i: number) => {
          if (i === selects.length - 1) return;
          const { start: prevItemDate } = item;

          if (date2timeStamp(selectItemDate.start) < date2timeStamp(prevItemDate) && date2timeStamp(prevItemDate) < date2timeStamp(selectItemDate.end)) {
            return true;
          }
        });
      }

      if (!isIncludeOtherRange) {
        selectItem.start = selectItemDate.start;
        selectItem.end = selectItemDate.end;
      }

      return true;
    }
  });

  if (typeof deleteIndex === 'number') {
    selects.splice(deleteIndex, 1);
  } else if (!searchResult) {
    selects.push({start: date});
  }
  return selects;
}

export {
  singleSelect,
  multiSelect,
  rangeSelect,
  multiRange,
};
