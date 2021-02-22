<template>
  <div
    style='margin:0 auto'
    class="vc-calendar-timetable"
    :class="{
      'vc-calendar-timetable-prev': tableIndex === 0,
      'vc-calendar-timetable-current': tableIndex === 1,
      'vc-calendar-timetable-next': tableIndex === 2,
    }"
  >
    <div class="vc-calendar-timetable-wrap">
        <div
          :class="['vc-calendar-body', `mc-range-mode-${tableMode}`]"
        >
          <div class="vc-calendar-rang-head" v-if="tableMode === 'monthRange'">
            <div class="vc-calendar-rang-year-month-box">
              <span className="vc-calendar-rang-head-year">{{formatRangeMonth[0]}}</span>
              <span className="vc-calendar-rang-head-month">{{formatRangeMonth[1]}}</span>
            </div>
            <div class="vc-calendar-rang-week-box">
              <span v-for="(week, index) in weeks" :key="index">{{week}}</span>
            </div>
          </div>
          <div className="vc-calendar-content">
            <div v-for="(days,k1) in monthRender.value" :key="k1" class="vc-calendar-row" >
              <div
                v-for="(child,k2) in days"
                :key="k2"
                class="vc-calendar-day"
                :class="[
                  {
                    'vc-calendar-today': child.isToday,
                    'vc-calendar-dayoff': k2 === (monFirst ? 5 : 0) || k2 === 6,
                    'vc-calendar-disabled': child.disabled,
                    'vc-calendar-prev-month-day': child.prevMonthDay,
                    'vc-calendar-next-month-day': child.nextMonthDay,
                    'vc-calendar-row-first': k2 === 0,
                    'vc-calendar-row-last': k2 === 6,
                    'month-last-date': child.lastDay, 'month-first-date': 1 === child.day,
                    'mc-last-month': child.lastMonth,
                    'mc-next-month': child.nextMonth
                  },
                  child.className,
                  child.selectedClassName,
                  child.rangeClassName
                ]"
                @click="select(k1, k2, child, $event, index)"
              >
                <div class="vc-calendar-day-container">
                  <span :class="['vc-calendar-date']" >{{child.day}}</span>
                  <div :class="['vc-calendar-slot-element', child.tileContent.className]" v-if="child.tileContent">{{child.tileContent.content}}</div>
                  <div class="vc-calendar-remark-text" v-if="child.remark">{{child.remark}}</div>
                  <div
                    class="vc-calendar-almanac"
                    :class="{'vc-calendar-holiday': child.holiday, 'vc-calendar-isTerm': child.isTerm, 'isLunarFestival': child.isAlmanac || child.isLunarFestival, 'isGregorianFestival': child.isGregorianFestival}"
                  >
                    {{child.holiday || child.lunarHoliday || child.gregorianHoliday || child.lunar}}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="backgroundText" className="vc-calendar-month-background-text">{{month}}</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, reactive, watch, toRefs } from 'vue';
  import { disabledDate, computedPrevDay, date2ymd, selectOption, multiOption, rangeOption,
    multiRangeOption, getLunarInfo, isCurrentMonthToday, setTileContent, setRemark,
    computedPrevMonth, computedNextYear, computedNextDay
  } from './computed';
  import { rangeSelect, singleSelect, multiSelect, multiRange } from './controller';
  import { computedNextMonth, computedPrevYear } from '../utils';
  import { TimeTableInterface } from './declare';
  import './style.less';

  const disabledDateHandle = disabledDate();
  const setRemarkHandle = setRemark();
  const setTileContentHandle = setTileContent();

  export default {
    props: {
      format: {
        type: Function,
      },
      weeks: {
        type: Array,
      },
      tableMode: {
        type: String,
        default: 'month'
      },
      language: {
        type: String,
      },
      year: {
        type: [String, Number],
      },
      month: {
        type: [String, Number],
      },
      day: {
        type: [String, Number],
      },
      lunar: {
        type: Object,
      },
      monFirst: {
        type: Boolean,
        default: true
      },
      useSwipe: {
        type: Boolean,
        default: true
      },
      backgroundText: {
        type: Boolean,
        default: true
      },
      tableIndex: {
        type: Number,
      },
      begin: {
        type: String,
      },
      end: {
        type: String,
      },
      completion: {
        type: Boolean,
        default: false
      },
      holidays: {
        type: Object,
        default() {
          return {};
        }
      },
      tileContent: {
        type: Object,
        default() {
          return {};
        }
      },
      remarks: {
        type: Object,
        default() {
          return {};
        }
      },
      timestamp: {
        type: Number,
      },
      selectMode: {
        type: String,
      },
      disabled: {
        type: Array,
      },
      selectDate: {
        type: [String, Array, Object],
      },
    },
    emits: ['onSelect', 'onMonthChange'],
    setup(props: TimeTableInterface, { emit }: any) {
      const { year, month, selectMode, tableMode: propsTableMode, monFirst, begin: propsBegin,
        end: propsEnd, completion: propsCompletion, day, tileContent, disabled, remarks, holidays,
        selectDate,
      } = toRefs(props);

      const tableMode = ref(propsTableMode);
      const begin = ref(propsBegin);
      const end = ref(propsEnd);
      const completion = ref(propsTableMode.value === 'week' || propsCompletion.value);
      const formatRangeMonth = ref([year?.value, month?.value]);
      disabledDateHandle.update(disabled.value);
      setRemarkHandle.update(remarks.value);
      setTileContentHandle.update(tileContent.value);

      function selectComputed(date: string) {
        switch (selectMode.value) {
          case 'range':
            return rangeOption({selectDate: selectDate?.value, date} as any);
          case 'multiRange':
            return multiRangeOption({selectDate: selectDate?.value, date} as any);
          case 'multi':
            return multiOption({selectDate: selectDate?.value, date} as any);
          case 'select':
            return selectOption({selectDate: selectDate?.value, date});
        }
      }

      function select(k1: any, k2: any, child: any) {
        const { date, prevMonthDay, nextMonthDay } = child;

        if (prevMonthDay || nextMonthDay) {
          if (propsTableMode.value === 'monthRange') return;

          return emit('onMonthChange', {prevMonthDay, nextMonthDay});
        }

        let selectValue;
        switch (selectMode.value) {
          case 'select':
            selectValue = singleSelect(selectDate?.value as string, date);
            break;
          case 'multi':
            selectValue = multiSelect(selectDate?.value as string[], date);
            break;
          case 'range':
            selectValue = rangeSelect(selectDate?.value as {start?: string; end?: string}, date);
            break;
          case 'multiRange':
            selectValue = multiRange(selectDate?.value as {start?: string; end?: string}[], date);
            break;
        }

        emit('onSelect', selectValue);
      }

      function setDisabledDate(options: { year: string; month: string; i: string; date: string }) {
        const { year: disYear, month: disMonth, i, date } = options;
        const dateTimestamp = +new Date(Number(disYear), Number(disMonth) - 1, Number(i));
        const disabledOptions = {} as { disabled: boolean };
        if (begin.value) {
          const [beginY, beginM, beginD] = begin.value.split('-');
          const beginTimestamp = +new Date(Number(beginY), Number(beginM) - 1, Number(beginD));
          if (beginTimestamp > dateTimestamp) {
            disabledOptions.disabled = true;
          }
        }

        if (end.value) {
          const [endY, endM, endD] = end.value.split('-');
          const endTimestamp = +new Date(Number(endY), Number(endM) - 1, Number(endD));
          if (endTimestamp < dateTimestamp) {
            disabledOptions.disabled = true;
          }
        }

        if (disabledDateHandle.isDisabled(date)) {
          disabledOptions.disabled = true;
        }

        return disabledOptions;
      }

      function getToday(date: string) {
        return {
          isToday: isCurrentMonthToday(date),
        };
      }

      function renderOption({year, month, i, playload}: any) { // eslint-disable-line
        const date = `${year}-${month}-${i}`;
        const modeOptions = {
          selectedClassName: selectComputed(date)
        };
        const options = {
          day: i,
          holiday: holidays?.value?.[`${month}-${i}`],
          ...getLunarInfo(year, month, i, props.lunar),
          ...setRemarkHandle.getRemark(date),
          ...setTileContentHandle.getTileContent(date),
          ...setDisabledDate({year, month, i, date}),
          ...getToday(date),
        };

        return Object.assign(options, modeOptions);
      }

      const monthRender = reactive({value: render({year: year?.value, month: month?.value, day: day?.value})});

      function render({year, month, day, renderer, payload}: any) { // eslint-disable-line
        completion.value = propsTableMode.value === 'week' || propsCompletion.value;
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); //what day is the first day of the month
        const lastDateOfCurrentMonth = new Date(year, month, 0).getDate(); //last date of current month
        const lastDateOfLastMonth = new Date(year, month - 1, 0).getDate(); // last day Of last month

        let firstWeekDayCompletionCount;
        if (monFirst?.value) {
          firstWeekDayCompletionCount = (firstDayOfMonth === 0 ? 7 : firstDayOfMonth) - 1;
        } else {
          firstWeekDayCompletionCount = firstDayOfMonth === 0 ? 0 : firstDayOfMonth;
        }

        const firstWeekDayCount = 7 - firstWeekDayCompletionCount;
        const temp: any[] = [];

        if (tableMode.value === 'week') {
          let dayOfCurrentWeek = new Date(year, month - 1, day).getDay() - (monFirst?.value ? 1: 0); // what day is the current week
          if (dayOfCurrentWeek === -1) { // when current day is sunday and use monFirst mode
            dayOfCurrentWeek = 6;
          }

          temp.push(renderOption({year, month, i: day}));

          let countDate = [year, month, day];
          for (let i = 0; i < dayOfCurrentWeek; i++) {
            const [y, m, d] = countDate;
            const prevDate = computedPrevDay(y, m, d);
            countDate = date2ymd(prevDate);
            temp.unshift(renderOption({year: countDate[0], month: countDate[1], i: countDate[2]}));
          }

          countDate = [year, month, day];
          for (let i = dayOfCurrentWeek; i < 6; i++) {
            const [y, m, d] = countDate;
            const nextDate = computedNextDay(y, m, d);
            countDate = date2ymd(nextDate);
            temp.push(renderOption({year: countDate[0], month: countDate[1], i: countDate[2]}));
          }

          return [temp];
        }

        let line = 0;
        for (let i = 1; i <= lastDateOfCurrentMonth; i++) {
          if (!Array.isArray(temp[line])) temp[line] = [];

          if (line === 0) {
            temp[line].push(renderOption({year, month, i}));
            if (temp[line].length === firstWeekDayCount) {
              line += 1;
            }
          } else {
            temp[line].push(renderOption({year, month, i}));
            if (temp[line].length === 7) line += 1;
          }
        }

        if (completion.value) {
          //completion prev month
          let completionCounting = 0;
          const [prevYear, prevMonth] = [computedPrevYear(year, month), computedPrevMonth(month)];
          while (firstWeekDayCompletionCount !== completionCounting) {
            temp[0].unshift(Object.assign(
              renderOption({year: prevYear, month: prevMonth, i: lastDateOfLastMonth - completionCounting}),
              {prevMonthDay: true, disabled: true},
            ));
            completionCounting += 1;
          }

          //completion next month
          const completionWeeksCount = (5 - line) > 0 ? 5 - line : 0;
          const [nextYear, nextMonth] = [computedNextYear(year, month), computedNextMonth(month)];

          if (!Array.isArray(temp[line])) temp[line] = [];

          const lastWeekDayCompletionCount = 7 - temp[line].length + (7 * completionWeeksCount);
          let completionCountingNext = 0;

          while (lastWeekDayCompletionCount !== completionCountingNext) {
            if (temp[line].length === 7) {
              line += 1;
              temp[line] = [];
              continue;
            }

            completionCountingNext += 1;
            temp[line].push(Object.assign(
              renderOption({year: nextYear, month: nextMonth, i: completionCountingNext}),
              {nextMonthDay: true, disabled: true},
            ));
          }
        } else if (firstWeekDayCompletionCount) {
          temp[0].unshift(...Array.from({length: firstWeekDayCompletionCount}).fill('PLACEHOLDER'));
        }

        return temp;
      }

      function refreshRender() {
        monthRender.value = render({year: year?.value, month: month?.value, day: day?.value});
      }

      function formatYearAndMonth() {
        const { format } = props;
        if (format) {
          formatRangeMonth.value = format(year?.value as any, month?.value as any);
        } else {
          formatRangeMonth.value = [`${year?.value}-`, month?.value];
        }
      }

      formatYearAndMonth();

      watch(() => props.timestamp, () => {
        disabledDateHandle.update(disabled.value);
        setRemarkHandle.update(remarks.value);
        setTileContentHandle.update(tileContent.value);
        refreshRender();
      });

      watch(() => [props.monFirst, props.completion, props.year, props.month, props.day], () => {
        refreshRender();
      });

      watch(() => props.month, () => {
        formatYearAndMonth();
      });

      return {
        select,
        monthRender,
        selectComputed,
        refreshRender,
        formatRangeMonth,
      };
    }
  };
</script>
