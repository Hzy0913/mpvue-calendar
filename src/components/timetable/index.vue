<template>
  <div
    style='max-width:500px; margin:0 auto'
    class="vc-calendar-timetable"
  >
    <div class="vc-calendar-timetable-wrap">
        <div
          :class="['vc-calendar-body', `mc-range-mode-${tableMode}`]"
        >
<!--          <div class="month-rang-head" v-if="isMonthRange">{{rangeOfMonths[index][2]}}</div>-->
          <div v-for="(days,k1) in monthRender.value" :key="k1" class="vc-calendar-row" >
            <div
              v-for="(child,k2) in days"
              :key="k2"
              class="vc-calendar-day"
              :class="[{
                'mc-today-element': child.isToday,
                'vc-calendar-dayoff': k2 === (monFirst ? 5 : 0) || k2 === 6,
                 'vc-calendar-disabled': child.disabled,
             'vc-calendar-prev-month-day': child.prevMonthDay,
             'vc-calendar-next-month-day': child.nextMonthDay,
             'vc-calendar-row-first': k2 === 0,
             'vc-calendar-row-last': k2 === 6,
              'month-last-date': child.lastDay, 'month-first-date': 1 === child.day,
               'mc-last-month': child.lastMonth, 'mc-next-month': child.nextMonth}, child.className, selectComputed(child.date), child.rangeClassName]"
              @click="select(k1, k2, child, $event, index)"
            >
              <div class="vc-calendar-day-container">
                <span :class="['vc-calendar-date']" >{{child.day}}</span>
                <div :class="['vc-calendar-slot-element', child.tileContent.className]" v-if="child.tileContent">{{child.tileContent.content}}</div>
                <div class="vc-calendar-remark-text" v-if="child.remark">{{child.remark}}</div>
                <div
                  class="vc-calendar-almanac"
                  :class="{'isLunarFestival': child.isAlmanac || child.isLunarFestival, 'isGregorianFestival': child.isGregorianFestival, 'isTerm': child.isTerm}"
                >
                  {{child.almanac || child.lunar}}
                </div>
              </div>
            </div>
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
  // import { disabledDate, rangeOption, multiOption, selectOption, getToday } from './computed'
  import { computedNextMonth } from '../utils'
  import { TimeTableInterface, startType, deltaType } from './declare'
  import './style.less'

  const disabledDateHandle = disabledDate();
  const setRemarkHandle = setRemark();
  const setTileContentHandle = setTileContent();

  export default {
    props: {
      monFirst: {
        type: Boolean,
        default: true
      },
      speed: {
        type: Number,
        default: 300
      },
      month: {
        type: Object,
      },
      year: {
        type: Object,
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
      almanacs: {
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
    },
    setup(props: any) {
      console.log(props, 'aaaaa')
      const { year, mode = 'range', tableMode: propsTableMode = 'month', monFirst,begin: propsBegin,end: propsEnd, completion: propsCompletion, weeks, month, monthRange = [], tileContent, weekMode, value, disabled = [], remarks, almanacs } = toRefs(props);
      const initSelectValue = ({
        select: '',
        multi: [],
        range: { start: '', end: '' },
      } as any)[mode]
      const selectDate = reactive({select: initSelectValue})
      const tableMode = ref(propsTableMode)
      const completion = propsTableMode === 'week' || propsCompletion
      const begin = ref(propsBegin)
      const end = ref(propsEnd)
      disabledDateHandle.update(disabled)
      setRemarkHandle.update(remarks)
      setTileContentHandle.update(tileContent)



      function selectComputed(date: string) {
        switch (mode) {
          case 'range':
            return rangeOption({selectDate: selectDate.select, date} as any);
          case 'multi':
          return multiOption({selectDate: selectDate.select, date} as any);
          case 'select':
            return selectOption({selectDate: selectDate.select, date});
        }
      }

      function select(k1: any, k2: any, child: any, $event: any, index: any) {
        const { date } = child;
        switch (mode) {
          case 'range':
            const { start, end } = selectDate.select
            if (start && end) {
              selectDate.select.start = date;
              return selectDate.select.end = '';
            }
            if (start) {
              if (date2timeStamp(start) > date2timeStamp(date)) {
                selectDate.select.start = date;
                return selectDate.select.end = start;
              }

              return selectDate.select.end = date;
            }
            return selectDate.select.start = date;
          case 'multi':
            if (selectDate.select.includes(date)) {
              return selectDate.select = selectDate.select.filter((v: any) => v !== date)
            }
            return selectDate.select.push(date)
          case 'select':
            return selectDate.select = date;
        }


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
        let modeOptions;
        console.log(almanacs, 111222345)
        const options = {
          day: i,
          almanac: almanacs[`${month}-${i}`],
          ...getLunarInfo(year, month, i),
          ...setRemarkHandle.getRemark(date),
          ...setTileContentHandle.getTileContent(date),
          ...disabledDate({year, month, i, date}),
          ...getToday(date),
        }

        // switch (mode) {
        //   case 'range':
        //     // return rangeOption({date, isCurrentMonthToday} as any);
        //   case 'multi':
        //     // return multiOption({date, isCurrentMonthToday} as any);
        //   case 'select':
        //     console.log(selectDate.select, 333331)
        //     modeOptions = selectOption({selectDate: selectDate.select, year, month, i,date, disabledDateHandle, completion, getTileContent: setTileContentHandle.getTileContent, getRemark: setRemarkHandle.getRemark} as any);
        // }

        return Object.assign(options, modeOptions);
      }

      const monthRender = reactive({value: render({year: 2021, month: 2})})
      console.log(monthRender, 111111)

      function render({year, month, day, renderer, payload}: any) {
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
          const dayOfCurrentWeek = new Date(year, month - 1, day).getDay() - (monFirst ? 1: 0); // what day is the current week
          temp.push(renderOption({year, month, i: day}));

          let countDate = [year, month, day];
          for (let i = 0; i < dayOfCurrentWeek; i ++) {
            const [y, m , d] = countDate;
            const prevDate = computedPrevDay(y, m , d);
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
          console.log(temp, 'temptemptemp')
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
              {nextMonthDay: false, disabled: true},
            ));
          }
        } else {
          if (firstWeekDayCompletionCount) {
            temp[0].unshift(...Array.from({length: firstWeekDayCompletionCount}).fill('PLACEHOLDER'));
          }
        }


        return temp;

        // const {completion} = this;
        // if (this.monFirst) {
        //   if (!firstDayOfMonth) {
        //     let lastMonthDay = lastDayOfLastMonth;
        //     const LastMonthItems = [];
        //     for (let d = 1; d <= 7; d++) {
        //       LastMonthItems.unshift(Object.assign(
        //         this.renderOption(this.computedPrevYear(y, m), this.computedPrevMonth(false, m), lastMonthDay, 'prevMonth'),
        //         {lastMonth: true}
        //       ));
        //       lastMonthDay--;
        //     }
        //     temp.unshift(LastMonthItems);
        //   }
        //   temp.forEach((item, index) => {
        //     if (!index) {
        //       return item.splice(0, 1);
        //     }
        //     temp[index - 1].length < 7 && temp[index - 1].push(item.splice(0, 1)[0]);
        //   });
        //   if (this.isMonthRange && temp[temp.length - 1][0].nextMonth) {
        //     temp.splice(temp.length - 1, 1); //if the first day of last line is nextMonth, delete this line
        //   }
        //   if (!completion && !weekSwitch) {
        //     const lastIndex = temp.length - 1;
        //     const secondToLastIndex = lastIndex - 1;
        //     const differentMonth = temp[lastIndex][0].date.split('-')[1] !== temp[secondToLastIndex][6].date.split('-')[1];
        //     differentMonth && temp.splice(lastIndex, 1);
        //   }
        // }
        // if (completion && !weekSwitch && temp.length <= 5 && nextMonthPushDays > 0) {
        //   for (let completionIndex = temp.length; completionIndex <= 5; completionIndex++) {
        //     temp[completionIndex] = [];
        //     const start = nextMonthPushDays + (completionIndex - line - 1) * 7;
        //     for (let d = start; d <= start + 6; d++) {
        //       temp[completionIndex].push(Object.assign(
        //         {day: d, disabled: true, nextMonth: true},
        //         this.getLunarInfo(this.computedNextYear(y, m), this.computedNextMonth(true, m), d),
        //         this.getEvents(this.computedNextYear(y, m), this.computedNextMonth(true, m), d)
        //       ));
        //     }
        //   }
        // }
        // if (this.tileContent.length) {
        //   temp.forEach((item, index) => {
        //     item.forEach(v => {
        //       const contents = this.tileContent.find(val => val.date === v.date);
        //       if (contents) {
        //         const {className, content} = contents || {};
        //         v.className = className;
        //         v.content = content;
        //       }
        //     });
        //   });
        // }
        // if (weekSwitch) {
        //   const tempLength = temp.length;
        //   const lastLineMonth = temp[tempLength - 1][0].date.split('-')[1]; // last line month
        //   const secondLastMonth = temp[tempLength - 2][0].date.split('-')[1]; // second-to-last line month
        //   lastLineMonth !== secondLastMonth && temp.splice(tempLength - 1, 1);
        // }
        // this.monthDays = temp;
        // if (weekSwitch && !this.isMonthRange) {
        //   if (this.positionWeek) {
        //     let payloadDay = '';
        //     let searchIndex = true;
        //     if (Array.isArray(payload)) { //range
        //       payloadDay = [payload[0], payload[1] + 1, payload[2]].join('-');
        //     } else if (this.multi || isWatchRenderValue) {
        //       if (this.thisTimeSelect) {
        //         payloadDay = this.thisTimeSelect;
        //       } else {
        //         payloadDay = this.multi ? this.value[this.value.length - 1].join('-') : this.value.join('-');
        //       }
        //     }
        //     if (payload === 'SETTODAY') {
        //       payloadDay = todayString;
        //     } else if (isCustomRender) {
        //       if (typeof payload === 'string') {
        //         payloadDay = [y, Number(m) + 1, payload].join('-');
        //         searchIndex = true;
        //       } else if (typeof payload === 'number') {
        //         const setIndex = payload > temp.length ? temp.length - 1 : payload;
        //         this.startWeekIndex = setIndex;
        //         this.weekIndex = setIndex;
        //         this.positionWeek = false;
        //         searchIndex = false;
        //       }
        //     }
        //     const positionDay = payloadDay || todayString;
        //     if (searchIndex) {
        //       temp.some((v, index) => {
        //         const isWeekNow = v.find(vv => vv.date === positionDay);
        //         if (isWeekNow) {
        //           this.startWeekIndex = index;
        //           this.weekIndex = index;
        //           return true;
        //         }
        //       });
        //     }
        //     this.positionWeek = false;
        //   }
        //   this.days = [temp[this.startWeekIndex]];
        //   if (this.initRender) {
        //     this.setMonthRangeofWeekSwitch();
        //     this.initRender = false;
        //   }
        // } else {
        //   this.days = temp;
        // }
        // const todayText = '今';
        // if (typeof this.now === 'boolean' && !this.now) {
        //   this.showToday = {show: false};
        // } else if (typeof this.now === 'string') {
        //   this.showToday = {
        //     show: true,
        //     text: this.now || todayText
        //   };
        // } else {
        //   this.showToday = {
        //     show: true,
        //     text: todayText
        //   };
        // }
        // this.monthRangeDays = [this.days];
        // isWatchRenderValue && this.updateHeadMonth();
        // return this.days;
      }


      watch(remarks, (count, prevCount) => {
        // setRemarkHandle.update(remarks)
        console.log(count,prevCount,remarks, 11344411)

        /* ... */
      })

      watchEffect(() => {

        console.log(month.value, completion,111111113)
        monthRender.value = render({year: year.value, month: month.value, day: 1})
      })
      function disabledDateClick() {
        // begin.value = '2021-2-11'
        // completion.value = true
      }
      console.log(monthRender, 11111333312)

      return {
        monthRender,
        select,
        selectDate,
        selectComputed,
        disabledDateClick,
        begin,
        tableMode,
        month,
      }
    }
  }
</script>
