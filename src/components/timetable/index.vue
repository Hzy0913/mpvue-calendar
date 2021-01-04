<template>
  <div
    style='max-width:500px; margin:0 auto'
    class="vc-calendar-timetable"
  >
    <div class="vc-calendar-timetable-wrap">
      <table cellpadding="5">
        <div class="mc-head" :class="['mc-head', {'mc-month-range-mode-head': isMonthRange}]">
          <div class="mc-head-box">
            <div v-for="(weekItem, index) in week" :key="index" class="mc-week">{{weekItem}}</div>
          </div>
        </div>
        <div
          :class="['mc-body', {'mc-range-mode': range, 'week-switch': weekSwitch && !isMonthRange, 'month-range-mode': isMonthRange}]"
          v-for="(days, index) in monthRangeDays"
          :key='index'
        >
          <div class="month-rang-head" v-if="isMonthRange">{{rangeOfMonths[index][2]}}</div>
          <tr v-for="(day,k1) in days" :key="k1" :class="{'gregorianStyle': !lunar}">
            <td
              v-for="(child,k2) in day"
              :key="k2"
              :class="[{'selected': child.selected, 'mc-today-element': child.isToday, 'disabled': child.disabled,
             'mc-range-select-one': rangeBgHide && child.selected, 'lunarStyle': lunar, 'mc-range-row-first': k2 === 0 && child.selected,
              'month-last-date': child.lastDay, 'month-first-date': 1 === child.day, 'mc-range-row-last': k2 === 6 && child.selected,
               'mc-last-month': child.lastMonth, 'mc-next-month': child.nextMonth}, child.className, child.rangeClassName]"
              @click="select(k1, k2, child, $event, index)"
              class="mc-day"
              :style="itemStyle"
            >
              <span v-if="showToday.show && child.isToday" class="mc-today calendar-date">{{showToday.text}}</span>
              <span :class="[{'mc-date-red': k2 === (monFirst ? 5 : 0) || k2 === 6}, 'calendar-date']" v-else>{{child.day}}</span>
              <div class="slot-element" v-if="!!child.content">{{child.content}}</div>
              <div class="mc-text remark-text" v-if="child.eventName && !clean">{{child.eventName}}</div>
              <div class="mc-dot" v-if="child.eventName && clean" />
              <div
                class="mc-text"
                :class="{'isLunarFestival': child.isAlmanac || child.isLunarFestival, 'isGregorianFestival': child.isGregorianFestival, 'isTerm': child.isTerm}"
                v-if="lunar && (!child.eventName || clean)"
              >
                {{child.almanac || child.lunar}}
              </div>
              <div class="mc-range-bg" v-if="range && child.selected" />
            </td>
          </tr>
        </div>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import { disabledDate, selectOption, getToday, computedPrevYear, computedPrevMonth, computedNextYear, computedNextMonth} from './computed'
  // import { disabledDate, rangeOption, multiOption, selectOption, getToday } from './computed'
  import { isZh, enWeeks, zhWeeks } from '../utils'
  import { TimeTableInterface, startType, deltaType } from './declare'
  import './style.less'

  const disabledDateHandle = disabledDate();

  export default {
    props: {
      weeks: {
        type: Array,
        // default() {
        //   return monFirst ? ['一', '二', '三', '四', '五', '六', '日'] : ['日', '一', '二', '三', '四', '五', '六'];
        // }
      },
      monFirst: {
        type: Boolean,
        default: false
      },
      speed: {
        type: Number,
        default: 300
      },
      loop: {
        type: Boolean,
        default: true
      },
      completion: {
        type: Boolean,
        default: false
      },
    },
    setup(props: any) {
      console.log(props, 'aaaaa')
      const { mode = 'select', monFirst, completion, weeks, month, monthRange = [], weekMode, value, disabled = [] } = props;
      disabledDateHandle.update(disabled)



      function computedWeek() {
        if (Array.isArray(weeks)) return weeks;

        const language = isZh() ? 'zh': 'en';
        const weeksArray = {
          en: enWeeks,
          zh: zhWeeks,
        }[language]

        if (monFirst) {
          return weeksArray.reduce((previousValue, currentValue, index) => {
            if (!index) {
              previousValue.first = currentValue;
              return previousValue;
            }

            previousValue.week.push(currentValue);

            if (index === weeksArray.length - 1) {
              return [...previousValue.week, previousValue.first];
            }

            return previousValue;
          }, {first: undefined, week: []} as any)
        }

        return weeksArray;
      }

      function renderOption({year, month, i, playload, date}: any) {
        const isWeekMode = monthRange.length ? false : weekMode;
        const isMonthModeCurrentMonth = !weekMode && !playload;

        switch (mode) {
          case 'range':
            // return rangeOption({date, isCurrentMonthToday} as any);
          case 'multi':
            // return multiOption({date, isCurrentMonthToday} as any);
          case 'select':
            return selectOption({year, month, i, disabledDateHandle, completion} as any);
        }
      }

      const monthRender = render({year: 2021, month: 2})
      console.log(monthRender, 111111)

      function render({year, month, renderer, payload}: any) {
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

        console.log('本月第一天周几',firstDayOfMonth, '本月最后一天', lastDateOfCurrentMonth, '上月最后一天',lastDateOfLastMonth, 'aaalastDayOfLastMonth')

        const firstWeekDayCount = 7 - firstDayOfMonth + (monFirst ? 1: 0)

        console.log(firstWeekDayCount, 'firstWeekDayCount')

        let line = 0;
        let nextMonthPushDays = 1;
        const temp: any[] = [];
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

          // let k;
          // if (day === 0) {
          //   temp[line] = [];
          // } else if (i === 1) {
          //   temp[line] = [];
          //   k = lastDayOfLastMonth - firstDayOfMonth + 1;
          //   for (let j = 0; j < firstDayOfMonth; j++) { //generate prev month surplus option
          //     temp[line].push(
          //       // this.renderOption(computedPrevYear(year, month), computedPrevMonth(false, month), k, 'prevMonth'),
          //       // {lastMonth: true}
          //     );
          //     k++;
          //   }
          // }
          //
          // // renderOption(year, month, i)
          // temp[line].push(); //generate current month option
          //
          // if (day === 6 && i < lastDateOfMonth) {
          //   line++;
          // } else if (i === lastDateOfMonth) {
          //   let nextDay = 1;
          //   const lastDateOfMonthLength = monFirst ? 7 : 6;
          //   for (let d = day; d < lastDateOfMonthLength; d++) { //generate next month surplus option
          //     temp[line].push(
          //       // this.renderOption(this.computedNextYear(y, m), this.computedNextMonth(false, m), nextDay, 'nextMonth'),
          //       // {nextMonth: true}
          //     );
          //     nextDay++;
          //   }
          //   nextMonthPushDays = nextDay;
          // }
        }

        if (completion) {
          let firstWeekDayCompletionCount = 7 - firstWeekDayCount;
          let completionCounting = 0;
          const [prevYear, prevMonth] = [computedPrevYear(year, month), computedPrevMonth(month)];
          while (firstWeekDayCompletionCount !== completionCounting) {
            temp[0].unshift(renderOption({year: prevYear, month: prevMonth, i: lastDateOfLastMonth - completionCounting}));
            completionCounting += 1;
          }

          const completionWeeksCount = (6 - line) > 0 ? 7 : 0
          const [nextYear, nextMonth] = [computedNextYear(year, month), computedNextMonth(month)];
          console.log(line,temp[line], 'temp[line]temp[line]')
          if (!Array.isArray(temp[line])) temp[line] = [];
          const lastWeekDayCompletionCount = 7 - temp[line].length + completionWeeksCount;
          let completionCountingNext = 0;

          while (lastWeekDayCompletionCount !== completionCountingNext) {
            if (temp[line].length === 7) {
              line += 1;
              temp[line] = [];
              continue;
            }
            completionCountingNext += 1;
            temp[line].push(renderOption({year: nextYear, month: nextMonth, i: completionCountingNext}));
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



      return {
        week: computedWeek()
      }
    }
  }
</script>
