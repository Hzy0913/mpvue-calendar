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
              <span v-for="(week,k1) in weeks">{{week}}</span>
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
            <div className="vc-calendar-month-background-text">{{month}}</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted, watchEffect, watch, toRefs } from 'vue'
  import {
    disabledDate,
    computedPrevDay,
    date2ymd,
    selectOption,
    multiOption,
    rangeOption,
    multiRangeOption,
    getLunarInfo,
    isCurrentMonthToday,
    getToday,
    setTileContent,
    setRemark,
    computedPrevYear,
    computedPrevMonth,
    computedNextYear,
    date2timeStamp,
    computedNextDay
  } from './computed'
  import { rangeSelect, singleSelect, multiSelect, multiRange } from './controller';
  import { computedNextMonth, delay } from '../utils'
  import { TimeTableInterface, startType, deltaType } from './declare'
  import './style.less'

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
      day: {
        type: String,
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
      },
      speed: {
        type: Number,
        default: 300
      },
      tableIndex: {
        type: Number,
        default: 300
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
      loop: {
        type: Boolean,
        default: true
      },
      begin: {
        type: String,
        // default: '2021-2-11'
      },
      end: {
        type: String,
        // default: '2021-2-21'
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
      selectDate: {
        type: Object,
      },
      timestamp: {
        type: Object,
      },
      selectMode: {
        type: Object,
      },
      disabled: {
        type: Object,
      },
    },
    emits: ['onSelect', 'monthChange'],
    setup(props: any, { emit } : any) {
      const { year, month, selectMode = 'multiRange', tableMode: propsTableMode, monFirst,begin: propsBegin,
        end: propsEnd, completion: propsCompletion, weeks, day, monthRange = [], tileContent, tableIndex,
        weekMode, value, disabled = [], remarks, holidays, selectDate, timestamp, useSwipe, week, lunar,
      } = toRefs(props);

      console.log(holidays.value, 'lidays.valuelidays.value')
      // const { selectDate } = props;
      const tableMode = ref(propsTableMode)
      const completion = ref(propsTableMode.value === 'week' || propsCompletion.value)
      const begin = ref(propsBegin)
      const end = ref(propsEnd)
      const formatRangeMonth = ref([year.value, month.value])
      disabledDateHandle.update(disabled.value || [])
      setRemarkHandle.update(remarks.value)
      setTileContentHandle.update(tileContent.value)

      console.log(remarks, 'remarksremarksremarksremarks1123123')


      function selectComputed(date: string) {
        console.log(selectDate, selectMode.value, date, 'selectDate.select, date')
        switch (selectMode.value) {
          case 'range':
            return rangeOption({selectDate: selectDate.value, date} as any);
          case 'multiRange':
            return multiRangeOption({selectDate: selectDate.value, date} as any);
          case 'multi':
            return multiOption({selectDate: selectDate.value, date} as any);
          case 'select':
            return selectOption({selectDate: selectDate.value, date});
        }
      }

      function select(k1: any, k2: any, child: any, $event: any, index: any) {
        const { date, prevMonthDay, nextMonthDay } = child;

        if (prevMonthDay || nextMonthDay) {
          if (propsTableMode.value === 'monthRange') return;

          return emit('monthChange', {prevMonthDay, nextMonthDay});
        }

        console.log(selectDate.value, 'selectModeselectMode')

        let selectValue;
        switch (selectMode.value) {
          case 'select':
            selectValue = singleSelect(selectDate.value, date);
            break;
          case 'multi':
            selectValue = multiSelect(selectDate.value, date);
            break;
          case 'range':
            selectValue = rangeSelect(selectDate.value, date);
            break;
          case 'multiRange':
            selectValue = multiRange(selectDate.value, date);
            break;
        }

        emit('onSelect', selectValue);
      }

      function disabledDate({year, month, i, date}: { year: string, month: string, i: string, date: string }) {
        const dateTimestamp = +new Date(Number(year), Number(month) - 1, Number(i));
        const disabledOptions = {} as {disabled: Boolean};
        if (begin.value) {
          const [beginY, beginM, beginD] = begin.value.split('-');
          const beginTimestamp = +new Date(beginY, beginM - 1, beginD);
          if (beginTimestamp > dateTimestamp) {
            disabledOptions.disabled = true;
          }
        }

        if (end.value) {
          const [endY, endM, endD] = end.value.split('-');
          const endTimestamp = +new Date(endY, endM - 1, endD);
          if (endTimestamp < dateTimestamp) {
            disabledOptions.disabled = true;
          }
        }

        console.log(date,disabledDateHandle.isDisabled(date),'disabledDateHandledisabledDateHandle' )
        if (disabledDateHandle.isDisabled(date)) {
          disabledOptions.disabled = true;
        }

        return disabledOptions;
      }

      function getToday(date: string) {
        return {
          isToday: isCurrentMonthToday(date)
        }
      }

      function renderOption({year, month, i, playload}: any) {
        const isWeekMode = monthRange.length ? false : weekMode;
        const isMonthModeCurrentMonth = !weekMode && !playload;
        const date = `${year}-${month}-${i}`;
        const modeOptions = {
          selectedClassName: selectComputed(date)
        };
        const options = {
          day: i,
          holiday: holidays.value?.[`${month}-${i}`],
          ...getLunarInfo(year, month, i, props.lunar),
          ...setRemarkHandle.getRemark(date),
          ...setTileContentHandle.getTileContent(date),
          ...disabledDate({year, month, i, date}),
          ...getToday(date),
        }

        console.log(options,options.date,  111222345)

        return Object.assign(options, modeOptions);
      }

      const monthRender = reactive({value: render({year: year.value, month: month.value, day: day?.value})})
      console.log(monthRender, 111111)

      function render({year, month, day, renderer, payload}: any) {
        completion.value = propsTableMode.value === 'week' || propsCompletion.value;

        const isCustomRender = renderer === 'CUSTOMRENDER';
        const isWatchRenderValue = renderer === '_WATCHRENDERVALUE_';

        // if (renderer === '_WATCHRENDER_') return this.watchRender(payload);
        // if (this.range && isWatchRenderValue) {
        //   if (!Array.isArray((this.value || [])[0])) {
        //     this.rangeBegin = [];
        //     this.rangeEnd = [];
        //   } else {
        //     this.rangeBegin = [this.value[0][0], this.value[0][1] - 1, this.value[0][2]];
        //     this.rangeEnd = [this.value[1][0], this.value[1][1] - 1, this.value[1][2]];
        //   }
        // }
        // if (isWatchRenderValue && weekSwitch) {
        //   this.positionWeek = true;
        // }
        // if (isCustomRender) {
        //   this.year = y;
        //   this.month = m;
        //   this.positionWeek = true;
        //   if (weekSwitch && !payload) {
        //     this.startWeekIndex = 0;
        //     this.weekIndex = 0;
        //   }
        //   this.updateHeadMonth();
        // }


        const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); //what day is the first day of the month
        const lastDateOfCurrentMonth = new Date(year, month, 0).getDate(); //last date of current month
        const lastDateOfLastMonth = new Date(year, month - 1, 0).getDate(); // last day Of last month

        console.log(monFirst.value,'本月第一天周几',firstDayOfMonth, '本月最后一天', lastDateOfCurrentMonth, '上月最后一天',lastDateOfLastMonth, 'aaalastDayOfLastMonth')

        let firstWeekDayCompletionCount;
          if (monFirst.value) {
            firstWeekDayCompletionCount = (firstDayOfMonth === 0 ? 7 : firstDayOfMonth) - 1
          } else {
            firstWeekDayCompletionCount = firstDayOfMonth === 0 ? 0 : firstDayOfMonth
          }

        const firstWeekDayCount = 7 - firstWeekDayCompletionCount

        const temp: any[] = [];

        if (tableMode.value === 'week') {
          console.log(month, day, 'daydaydaydaydayday')
          const dayOfCurrentWeek = new Date(year, month - 1, day).getDay() - (monFirst ? 1: 0); // what day is the current week
          temp.push(renderOption({year, month, i: day}));

          let countDate = [year, month, day];
          for (let i = 0; i < dayOfCurrentWeek; i ++) {
            const [y, m , d] = countDate;
            const prevDate = computedPrevDay(y, m , d);
            console.log(prevDate, 'daydaydaydaydayday3')

            countDate = date2ymd(prevDate);
            temp.unshift(renderOption({year: countDate[0], month: countDate[1], i: countDate[2]}));
          }

          countDate = [year, month, day];
          for (let i = dayOfCurrentWeek; i < 6; i ++) {
            const [y, m, d] = countDate;
            const nextDate = computedNextDay(y, m, d);
            countDate = date2ymd(nextDate);
            temp.push(renderOption({year: countDate[0], month: countDate[1], i: countDate[2]}));
          }

          console.log(temp, 'temptemptemp')
          return [temp];
        }





        console.log(firstWeekDayCount, 'firstWeekDayCount')

        let line = 0;
        let nextMonthPushDays = 1;
        for (let i = 1; i <= lastDateOfCurrentMonth; i++) {
          const day = new Date(year, month - 1, i).getDay();

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
          console.log(firstWeekDayCompletionCount, completionCounting, 'firstWeekDayCompletionCountfirstWeekDayCompletionCount')
          while (firstWeekDayCompletionCount !== completionCounting) {
            temp[0].unshift(Object.assign(
              renderOption({year: prevYear, month: prevMonth, i: lastDateOfLastMonth - completionCounting}),
              {prevMonthDay: true, disabled: true},
            ));
            completionCounting += 1;
          }

          //completion next month
          const completionWeeksCount = (5 - line) > 0 ? 5 - line : 0
          const [nextYear, nextMonth] = [computedNextYear(year, month), computedNextMonth(month)];
          if (!Array.isArray(temp[line])) temp[line] = [];
          const lastWeekDayCompletionCount = 7 - temp[line].length + (7 * completionWeeksCount);
          console.log(line,completionWeeksCount,lastWeekDayCompletionCount, 'temp[line]temp[line]')

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
        } else {
          if (firstWeekDayCompletionCount) {
            temp[0].unshift(...Array.from({length: firstWeekDayCompletionCount}).fill('PLACEHOLDER'));
          }
        }


        return temp;
      }

      function refreshRender() {
        console.log('timetableReftimetableRef11111')
        monthRender.value = render({year: year.value, month: month.value, day: day.value})
      }


      // watch(remarks, () => {
      //   setRemarkHandle.update(remarks.value);
      //   refreshRender();
      // })
      watch(disabled, () => {
        // disabledDateHandle.update(disabled.value)
        // refreshRender();
      })

      // watch(remarks, () => {
      //   setTileContentHandle.update(tileContent.value)
      //   refreshRender();
      // })
      watch(timestamp, () => {
        disabledDateHandle.update(disabled.value);
        setRemarkHandle.update(remarks.value);
        setTileContentHandle.update(tileContent.value);
        console.log('setTileContentHandle.update(tileContent.value')
        refreshRender();
      })


      watch(() => [props.monFirst, props.completion, props.year, props.month, props.day], () => {
        console.log('onSelectonSelectonSelect333333')
        refreshRender();
      })

      function disabledDateClick() {
        // begin.value = '2021-2-11'
        // completion.value = true
      }


      function formatYearAndMonth() {
        const { format } = props;
        if (format) {
          formatRangeMonth.value = format(year.value, month.value);
        }
      }

      formatYearAndMonth();

      watch(month, () => {
        formatYearAndMonth();
      })

      return {
        tableIndex,
        monthRender,
        select,
        selectDate,
        selectComputed,
        disabledDateClick,
        begin,
        tableMode,
        year,
        month,
        weeks,
        refreshRender,
        formatRangeMonth,
      }
    }
  }
</script>
