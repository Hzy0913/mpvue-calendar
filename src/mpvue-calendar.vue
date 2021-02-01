<template>
  <div
    class="mpvue-calendar"
    :class="[`mpvue-calendar-mode-${tableMode}`]"
  >
    <Tools
      @next="nextChange"
      @prev="prevChange"
      @selectMonth="selectMonth"
      @selectYear="selectYear"
      :month="month"
      :year="year"
      :monFirst="monFirst"
      :timetableHeight="timetableHeight"
      :format="format"
      :tableMode="tableMode"
      :weeks="weeks"
    />
    <div
      :style="{height: timetableHeight + 'px'}"
    >
      <Swipe
        :initialSlide="1"
        :useSwipe="useSwipe"
        @swiperChangeEnd="swiperChangeEnd"
        @containerChange="containerChange"
        ref="swipeRef"
      >
        <Slide
          :useSwipe="useSwipe"
          class-name="asdasdsd"
          v-for="(item, k1) in timetableList.list"
        >
          <Timetable
            :timestamp="timestamp"
            :weeks="weeks"
            ref="timetableRef"
            :useSwipe="useSwipe"
            :month="item.month"
            :year="item.year"
            :day="item.day"
            :remarks="remarks"
            :holidays="holidays"
            :tileContent="tileContent"
            :disabled="disabled"
            :completion="completion"
            :monFirst="monFirst"
            :tableMode="tableMode"
            :selectMode="selectMode"
            :selectDate="selectDate"
            :begin="begin"
            :end="end"
            :format="format"
            @onSelect="onSelect"
            @monthChange="monthChange"
          />
        </Slide>
      </Swipe>
    </div>
    <button
      @click="test()"
    >test</button>


  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watchEffect, watch, toRefs } from 'vue'
  import { CalendarInterface } from './declare'
  import Tools from './components/tools/index.vue'
  import Swipe from './components/swipe/index.vue'
  import Slide from './components/swipe/slide.vue'
  import Timetable from './components/timetable/index.vue'
  import {delay, enWeeks, getToday, isZh, zhWeeks} from './components/utils'
  import { computedNextMonth, computedPrevMonth, getDateByCount, date2ymd, getPrevDate, getNextDate,  } from './components/utils'
  import './icon.css'
  import './style.less'

  export default {
    props: {
      format: {
        type: Function,
      },
      holidays: {
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
      monthRange: {
        type: Object,
      },
      tileContent: {
        type: Object,
        default() {
          return {};
        }
      },
      completion: {
        type: Boolean,
        default: false
      },
      useSwipe: {
        type: Boolean,
        default: true
      },
      monFirst: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: 'month'
      },
      weeks: {
        type: Array,
        default: undefined
      },
      begin: {
        type: String,
      },
      end: {
        type: String,
      },
      selectMode: {
        type: String,
        default: 'select'
      },
      selectDate: {
        type: Object,
      },
      disabled: {
        type: Object,
      },
    },
    components: {
      Tools,
      Swipe,
      Slide,
      Timetable,
    },
    emits: ['onSelect'],
    setup(props: any, { emit } : any) {
      const { holidays, tileContent, disabled, end, completion, monFirst, monthRange, mode: tableMode, selectMode, selectDate: propSelectDate, remarks, begin } = toRefs(props)
      const timestamp = ref(+new Date()); // listener timestamp change to refresh timetable
      const [currentYear, currentMonth, currentDay] = getToday(true);
      const year = ref(currentYear)
      const month = ref(currentMonth)
      const day = ref(currentDay)
      const timetableHeight = ref(undefined);
      const swipeRef = ref();
      const timetableRef = ref();
      const count = ref(0);
      const weeks = ref(computedWeek() as string[]);
      const useSwipe = ref(props.useSwipe);
      const initSelectValue = propSelectDate?.value || ({
        select: '',
        multi: [],
        multiRange: [],
        range: { start: '', end: '' },
      } as any)[selectMode.value]
      const timetableList = reactive({list: getTimetableList()})

      if (tableMode.value === 'monthRange') {
        useSwipe.value = false;
      }

      const selectDate = ref(initSelectValue)


      function swiperChangeEnd(index: any, b: any) {
        const isWeekMode = tableMode.value === 'week';
        if (index === 2) {
          const [nextYear, nextMonth, nextDay] = getNextDate(year.value, month.value,  isWeekMode ? day.value : undefined);
          year.value = nextYear;
          month.value = nextMonth;

          if (isWeekMode) {
            day.value = nextDay;
          }

          return swipeRef.value.slide(1, 0)
        }

        if (index === 0) {
          const [prevYear, prevMonth, prevDay] = getPrevDate(year.value, month.value, isWeekMode ? day.value : undefined);
          year.value = prevYear;
          month.value = prevMonth;

          if (isWeekMode) {
            day.value = prevDay;
          }
          return swipeRef.value.slide(1, 0)
        }
      }

      function computedWeek() {
        if (Array.isArray(props.weeks)) return props.weeks;

        const language = isZh() ? 'zh': 'en';
        const weeksArray = {
          en: enWeeks,
          zh: zhWeeks,
        }[language]

        if (monFirst.value) {
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

      function start() {
        // console.log(888999992222)
        // const [nextYear, nextMonth] = getNextDate(year.value, monttt);
        // year.value = nextYear
        // month.value = nextMonth;
      }

      function getTimetableList() {
        const isWeekMode = tableMode.value === 'week';

        if (!useSwipe.value) {
          return [{year: year.value, month: month.value, day: day.value, id: `${year.value}-${month.value}-${day.value}`}];
        }

        if (tableMode.value === 'monthRange') {
          return monthRange.value.map((item: string) => {
            const [year, month] = item.split('-');
            return { year, month };
          });
        }

        console.log(isWeekMode, 'isWeekModeisWeekMode')
        if (isWeekMode) {
          const [prevYear, prevMonth, prevDay] = getPrevDate(year.value, month.value, day.value);
          const [nextYear, nextMonth, nextDay] = getNextDate(year.value, month.value, day.value);
          return [
            {year: prevYear, month: prevMonth, day: prevDay, id: `${prevYear}-${prevMonth}-${prevDay}`},
            {year: year.value, month: month.value, day: day.value, id: `${year.value}-${month.value}-${day.value}`},
            {year: nextYear, month: nextMonth, day: nextDay, id: `${nextYear}-${nextMonth}-${nextDay}`},
          ];
        }

        const [prevYear, prevMonth] = getPrevDate(year.value, month.value);
        const [nextYear, nextMonth] = getNextDate(year.value, month.value);
        console.log([
          `${prevYear}-${prevMonth}`,
          `${year.value}-${month.value}`,
          `${nextYear}-${nextMonth}`,
        ], 776666333111)
        return [
          {year: prevYear, month: prevMonth, id: `${prevYear}-${prevMonth}`},
          {year: year.value, month: month.value, id: `${year.value}-${month.value}`},
          {year: nextYear, month: nextMonth, id: `${nextYear}-${nextMonth}`},
        ];
      }

      function nextChange(currentYear: number | string, currentMonth: number | string) {
        if (tableMode.value === 'week') {
          const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, 7);
          console.log(nextDate, 'nextDatenextDate')
          const [nextYear, nextMonth, nextDay] = date2ymd(nextDate);
          year.value = nextYear;
          month.value = nextMonth;
          return day.value = nextDay;
        }
        console.log(tableMode, 'tableModetableMode')
        const nextMonth = computedNextMonth(currentMonth)
        month.value = nextMonth;
        console.log(nextMonth, currentMonth,year, 6667777)

        year.value = nextMonth === 1 ? Number(year.value) + 1 : year.value;
      }

      function prevChange(currentYear: number | string, currentMonth: number | string) {
        if (tableMode.value === 'week') {
          const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, -7);
          const [nextYear, nextMonth, nextDay] = date2ymd(nextDate);
          year.value = nextYear;
          month.value = nextMonth;
          return day.value = nextDay;
        }
        const prevMonth = computedPrevMonth(currentMonth)
        month.value = prevMonth;
        console.log(prevMonth, currentMonth,year, 6667777)

        year.value = prevMonth === 12 ? Number(year.value) - 1 : year.value;
      }

      function selectMonth(selectedYear: number, selectedMonth: number) {
        year.value = selectedYear;
        month.value = selectedMonth;
      }

      function selectYear(selectedYear: number, selectedMonth: number) {
        year.value = selectedYear;
        month.value = selectedMonth;
      }

      function test() {
        // remarks['2021-1-3'] = '按理说大流口水的'
      }

      function containerChange(element: any) {
        timetableHeight.value = element?.clientHeight;
        console.log(element, element?.clientHeight, 'paramparamparam')
      }

      function onSelect(param: any) {
        if (!propSelectDate?.value) {
          selectDate.value = param;
        }

        emit('onSelect', param);
        delay().then(refreshRender);
      }

      function refreshRender() {
        timestamp.value = +new Date()
      }

      function monthChange(param: any) {
        const { prevMonthDay, nextMonthDay } = param || {};
        if (nextMonthDay) {
          return nextChange(year.value, month.value)
        }
        if (prevMonthDay) {
          prevChange(year.value, month.value)
        }
      }

      function render(y: string | number, m: string | number, d?: string | number) {
        if (year && month) {
          year.value = y;
          month.value = m;
        }

        if (d) {
          day.value = d;
        }
      }

      watchEffect(() => {

        console.log(completion,month,
          year, 'completioncompletion')
      })

      watch([month, day], (count, prevCount) => {
        console.log(getTimetableList(), 'getTimetableList()getTimetableList()')
        timetableList.list = getTimetableList();
      })

      watch(propSelectDate, (current, prev) => {
        console.log('onSelectonSelectonSelectwatch(propSelectDate')
        selectDate.value = propSelectDate.value
      });

      // watch(remarks, (current, prev) => {
      //   remarks.value = props.remarks;
      // });

      // watch(propSelectDate, (count, prevCount) => {
      //   timetableList.list = getTimetableList();
      // })
      // watch(() => [props.begin, props.end, props.disabled], (count, prevCount) => {
      //   refreshRender();
      // })
      // watch(almanacs, (count, prevCount) => {
      //   refreshRender();
      // })

      watch(tableMode, (count, prevCount) => {
        if (tableMode.value === 'monthRange') {
          useSwipe.value = false;
        }
        console.log( getTimetableList(), count, prevCount, tableMode,'refreshRenderrefreshRender')
        timetableList.list = getTimetableList();
        refreshRender();
      })

      // watch(props.almanacs, () => {
      //   refreshRender();
      // })
      // watch(props.remarks, () => {
      //   refreshRender();
      // })
      watch([begin, end, disabled, props.disabled, holidays, props.holidays, remarks, props.remarks, tileContent, props.tileContent], () => {
        refreshRender();
      })

      watch(useSwipe.value, () => {

        // alert(3)
      })
      console.log(holidays.value, 'lidays.valuelidays.value111')

      watch([weeks, monFirst], () => {
        weeks.value = computedWeek();
      })
      // watch(props.tileContent, () => {
      //   refreshRender();
      // })

      return {
        count,
        monFirst,
        month,
        year,
        day,
        nextChange,
        prevChange,
        selectMonth,
        selectYear,
        test,
        remarks,
        holidays,
        tileContent,
        completion,
        onSelect,
        monthChange,
        tableMode,
        selectMode,
        timetableList,
        swiperChangeEnd,
        containerChange,
        timetableHeight,
        swipeRef,
        timetableRef,
        selectDate,
        disabled,
        timestamp,
        propSelectDate,
        render,
        begin,
        end,
        useSwipe,
        weeks,
        format: props.format,
      }
    }
  }
</script>
