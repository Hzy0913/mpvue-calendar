<template>
  <div class="mpvue-calendar" >
    {{completion}}
    <Tools
      @next="nextChange"
      @prev="prevChange"
      @selectMonth="selectMonth"
      @selectYear="selectYear"
      :month="month"
      :year="year"
      :monFirst="monFirst"
    />
    <Swipe
      :initialSlide="1"
      @swiperChangeEnd="swiperChangeEnd"
      ref="swipeRef"
    >
      <Slide
        class-name="asdasdsd"
        v-for="(item, k1) in timetableList.list"
      >
        <Timetable
          :key="item.id"
          :month="item.month"
          :year="item.year"
          :day="item.day"
          :remarks="remarks"
          :almanacs="almanacs"
          :tileContent="tileContent"
          :completion="completion"
          :monFirst="monFirst"
          :tableMode="tableMode"
          @onSelect="onSelect"
          @monthChange="monthChange"
        />
      </Slide>
    </Swipe>

    <button
      @click="test()"
    >test</button>


  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, watchEffect, watch, toRefs } from 'vue'
  import Tools from './components/tools/index.vue'
  import Swipe from './components/swipe/index.vue'
  import Slide from './components/swipe/slide.vue'
  import Timetable from './components/timetable/index.vue'
  import { computedNextMonth, computedPrevMonth, getDateByCount, date2ymd, getPrevDate, getNextDate,  } from './components/utils'
  import './icon.css'

  export default {
    props: {
      almanacs: {
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
      monFirst: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: 'month'
      },
    },
    components: {
      Tools,
      Swipe,
      Slide,
      Timetable,
    },
    setup(props: any) {
      const { almanacs, tileContent, completion, monFirst, monthRange, mode: tableMode } = toRefs(props)
      const month = ref(1)
      const year = ref(2021)
      const day = ref(5)
      const timetableList = reactive({list: getTimetableList()})
      const remarks: any = reactive({
        '2021-2-1': '啦啦啦',
        '2021-2-11': '啦啦啦3333',
      });
      const swipeRef = ref();
      const count = ref(0)

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

      function start() {
        // console.log(888999992222)
        // const [nextYear, nextMonth] = getNextDate(year.value, monttt);
        // year.value = nextYear
        // month.value = nextMonth;
      }

      function getTimetableList() {
        if (tableMode.value === 'monthRange') {
          return monthRange.value.map((item: string) => {
            const [year, month] = item.split('-');
            return { year, month };
          });
        }


        console.log(month, 'monthRangemonthRange')
        const [prevYear, prevMonth, prevDay] = getPrevDate(year.value, month.value, day.value);
        const [nextYear, nextMonth, nextDay] = getNextDate(year.value, month.value, day.value);
        // const [next2Year, next2Month] = getNextDate(nextYear, nextMonth);
        return [
          {year: prevYear, month: prevMonth, day: prevDay, id: `${prevYear}-${prevMonth}`},
          {year: year.value, month: month.value, day: day.value, id: `${year.value}-${month.value}`},
          {year: nextYear, month: nextMonth, day: nextDay, id: `${nextYear}-${nextMonth}`},
          // {year: next2Year, month: next2Month, id: `${next2Year}-${next2Month}`},
        ];
      }

      function nextChange(currentYear: number, currentMonth: number | string) {
        if (tableMode.value === 'week') {
          const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, 7);
          const [nextYear, nextMonth, nextDay] = date2ymd(nextDate);
          year.value = nextYear;
          month.value = nextMonth;
          return day.value = nextDay;
        }
        console.log(tableMode, 'tableModetableMode')
        const nextMonth = computedNextMonth(currentMonth)
        month.value = nextMonth;
        console.log(nextMonth, currentMonth,year, 6667777)

        year.value = nextMonth === 1 ? year.value + 1 : year.value;
      }

      function prevChange(currentYear: number, currentMonth: number | string) {
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

        year.value = prevMonth === 12 ? year.value - 1 : year.value;
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
        remarks['2021-1-3'] = '按理说大流口水的'
      }

      function onSelect(param: any) {
        console.log(param, 'paramparamparam')
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

      watchEffect(() => {

        console.log(completion,month,
          year, 'completioncompletion')
      })

      watch(month, (count, prevCount) => {
        timetableList.list = getTimetableList();

      })
      watch(day, (count, prevCount) => {
        timetableList.list = getTimetableList();
      })

      watch(completion, () => {

          })

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
        almanacs,
        tileContent,
        completion,
        onSelect,
        monthChange,
        tableMode,
        timetableList,
        swiperChangeEnd,
        swipeRef,
      }
    }
  }
</script>
