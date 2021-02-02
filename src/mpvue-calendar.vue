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
      :weeks="weeksInner"
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
          v-for="(item, index) in timetableList.list"
          :key="index"
        >
          <Timetable
            :tableIndex="index"
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
            :selectDate="selectDateInner"
            :begin="begin"
            :end="end"
            :format="format"
            :lunar="lunar"
            @onSelect="onSelect"
            @monthChange="monthChange"
          />
        </Slide>
      </Swipe>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, reactive, watch, toRefs } from 'vue';
  import { CalendarInterface } from './declare';
  import Tools from './components/tools/index.vue';
  import Swipe from './components/swipe/index.vue';
  import Slide from './components/swipe/slide.vue';
  import Timetable from './components/timetable/index.vue';
  import { delay, enWeeks, getToday, isZh, zhWeeks, computedNextMonth, computedPrevMonth,
    getDateByCount, date2ymd, getPrevDate, getNextDate,
  } from './components/utils';
  import './components/icon/icon.css';
  import './style.less';

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
      lunar: {
        type: Object,
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
    setup(props: CalendarInterface, { emit }: any) {
      const { holidays, tileContent, disabled, end, monFirst, monthRange,
        mode: tableMode, selectMode, selectDate, remarks, begin, weeks,
      } = toRefs(props);
      const timestamp = ref(+new Date()); // listener timestamp change to refresh timetable
      const [todayYear, todayMonth, todaytDay] = getToday(true);
      const year = ref(todayYear);
      const month = ref(todayMonth);
      const day = ref(todaytDay);
      const timetableHeight = ref(undefined);
      const swipeRef = ref();
      const timetableRef = ref();
      const weeksInner = ref(computedWeek());
      const useSwipe = ref(props.useSwipe);
      const initSelectValue = selectDate?.value || {
        select: '',
        multi: [],
        multiRange: [],
        range: { start: '', end: '' },
      }[selectMode.value];
      const timetableList = reactive({list: getTimetableList()});
      const selectDateInner = ref(initSelectValue);

      if (tableMode.value === 'monthRange') {
        useSwipe.value = false;
      }

      function swiperChangeEnd(index: number) {
        const isWeekMode = tableMode.value === 'week';
        if (index === 2) {
          const [nextYear, nextMonth, nextDay] = getNextDate(year.value, month.value, isWeekMode ? day.value : undefined);
          year.value = nextYear;
          month.value = nextMonth;

          if (isWeekMode) {
            day.value = nextDay;
          }

          return swipeRef.value.slide(1, 0);
        }

        if (index === 0) {
          const [prevYear, prevMonth, prevDay] = getPrevDate(year.value, month.value, isWeekMode ? day.value : undefined);
          year.value = prevYear;
          month.value = prevMonth;

          if (isWeekMode) {
            day.value = prevDay;
          }
          return swipeRef.value.slide(1, 0);
        }
      }

      function computedWeek() {
        if (Array.isArray(props.weeks)) return props.weeks;

        const language = isZh() ? 'zh': 'en';
        const weeksArray = {
          en: enWeeks,
          zh: zhWeeks,
        }[language];

        if (monFirst?.value) {
          return weeksArray.reduce((previousValue: any, currentValue: any, index: number) => {
            if (!index) {
              previousValue.first = currentValue;
              return previousValue;
            }

            previousValue.week.push(currentValue);

            if (index === weeksArray.length - 1) {
              return [...previousValue.week, previousValue.first];
            }

            return previousValue;
          }, {first: undefined, week: []});
        }

        return weeksArray;
      }

      function getTimetableList() {
        const isWeekMode = tableMode.value === 'week';

        if (!useSwipe.value) {
          return [{year: year.value, month: month.value, day: day.value, id: `${year.value}-${month.value}-${day.value}`}];
        }

        if (tableMode.value === 'monthRange') {
          return monthRange.value.map((item: string) => {
            const [rangeYear, rangeMonth] = item.split('-');
            return { year: rangeYear, month: rangeMonth };
          });
        }

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
        return [
          {year: prevYear, month: prevMonth, id: `${prevYear}-${prevMonth}`},
          {year: year.value, month: month.value, id: `${year.value}-${month.value}`},
          {year: nextYear, month: nextMonth, id: `${nextYear}-${nextMonth}`},
        ];
      }

      function nextChange(currentYear: number | string, currentMonth: number | string) {
        if (tableMode.value === 'week') {
          const nextDate = getDateByCount(`${year.value}-${month.value}-${day.value}`, 7);
          const [nextYear, nextMonth, nextDay] = date2ymd(nextDate);
          year.value = nextYear;
          month.value = nextMonth;
          return day.value = nextDay;
        }
        const nextMonth = computedNextMonth(currentMonth);
        month.value = nextMonth;
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
        const prevMonth = computedPrevMonth(currentMonth);
        month.value = prevMonth;
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

      function containerChange(element: any) {
        timetableHeight.value = element?.clientHeight;
      }

      function onSelect(param: any) {
        selectDateInner.value = param;

        emit('onSelect', param);
        delay().then(refreshRender);
      }

      function refreshRender() {
        timestamp.value = +new Date();
      }

      function monthChange(param: any) {
        const { prevMonthDay, nextMonthDay } = param || {};
        if (nextMonthDay) {
          return nextChange(year.value, month.value);
        }
        if (prevMonthDay) {
          prevChange(year.value, month.value);
        }
      }

      function render(renderYear: string | number, renderMonth: string | number, renderDay?: string | number) {
        if (renderYear && renderMonth) {
          year.value = renderYear;
          month.value = renderMonth;
        }

        if (renderDay) {
          day.value = renderDay;
        }
      }

      watch([month, day], () => {
        timetableList.list = getTimetableList();
      });

      watch(() => props.selectDate, () => {
        selectDateInner.value = selectDate.value;
      });

      watch(tableMode, () => {
        if (tableMode.value === 'monthRange') {
          useSwipe.value = false;
        }
        timetableList.list = getTimetableList();
        refreshRender();
      });

      watch([begin, end, disabled, props.disabled, holidays, props.holidays, remarks, props.remarks,
        tileContent, props.tileContent], () => {
          refreshRender();
      });

      watch([weeks, monFirst], () => {
        weeksInner.value = computedWeek();
      });

      return {
        month,
        year,
        day,
        nextChange,
        prevChange,
        selectMonth,
        selectYear,
        onSelect,
        monthChange,
        tableMode,
        timetableList,
        swiperChangeEnd,
        containerChange,
        timetableHeight,
        swipeRef,
        timetableRef,
        timestamp,
        render,
        selectDateInner,
        weeksInner,
      };
    }
  };
</script>
