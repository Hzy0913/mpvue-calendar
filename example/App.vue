<template>
  <div class="container">
    <div class="container-select-modes">
      <!--select mode-->
      <Calendar
        backgroundText
        completion
        class-name="select-mode"
        :format="formatOfSelecteMode"
        :holidays="holidays"
        :select-date="selectModeDate"
        language="en"
        @selectYear="selectYear"
        @selectMonth="selectMonth"
        @next="next"
        @prev="prev"
        @onMonthChange="onMonthChange"
        @onSelect="onSelect"
      />
      <!--multi mode-->
      <Calendar
        selectMode="multi"
        class-name="multi-mode"
        language="en"
        :tile-content="multiTileContent"
        :select-date="multiModeDate"
        :begin="begin"
        :end="end"
        @onSelect="onSelect"
      />
      <!--range mode-->
      <Calendar
        monFirst
        backgroundText
        selectMode="range"
        :lunar="lunar"
        class-name="range-mode"
        :format="formatOfRangeMode"
        :select-date="rangeModeDate"
        language="cn"
        @onSelect="onSelect"
      />
      <!--multiRange mode-->
      <Calendar
        monFirst
        completion
        backgroundText
        selectMode="multiRange"
        class-name="multiRange-mode"
        :select-date="multiRangeModeDate"
        :format="formatOfmultiMode"
        :weeks="weeks"
        @onSelect="onSelect"
      />
    </div>
    <div class="container-view-modes">
      <!--week mode-->
      <Calendar
        backgroundText
        :lunar="lunar"
        selectMode="range"
        class-name="week-mode"
        mode="week"
        ref="weekModeRef"
      />
      <button @click="backToToday" class="back-to-today">Back to Today</button>
      <!--monthRange mode-->
      <Calendar
        backgroundText
        selectMode="range"
        class-name="monthRange-mode"
        mode="monthRange"
        :monthRange="['2021-2', '2021-3', '2021-4']"
      />
    </div>
  </div>
</template>

<script>
  import Calendar from '../src/mpvue-calendar';
  import lunar from '../src/lunar';
  import { defineComponent, ref, reactive, onMounted, watchEffect, watch } from 'vue';

  export default {
    name: 'app',
    components: {
      Calendar
    },
    setup() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();

      const holidays = ref({
        '1-1': 'New Year',
        '2-2': 'Wetlands',
        '2-14': 'Valentine',
        '3-8': 'Women',
        '4-1': 'April Fools',
        '4-22': 'World Earth',
        '5-1': 'Labour',
        '6-1': 'Children',
        '8-1': 'Youth',
        '10-5': 'World Teachers',
        '10-31': 'Halloween',
        '12-25': 'Christmas',
      })
      const completion = ref(false)

      const getRandom = () => Math.floor(Math.random() * (28 - 1 + 1)) + 1
      const selectModeDate = ref(`${currentYear}-${currentMonth}-${getRandom()}`)
      const multiModeDate = ref([`${currentYear}-${currentMonth}-${getRandom()}`, `${currentYear}-${currentMonth}-${getRandom()}`, `${currentYear}-${currentMonth}-${getRandom()}`])
      const rangeModeDate = ref({start: `${currentYear}-${currentMonth}-10`, end: `${currentYear}-${currentMonth}-14`})
      const multiRangeModeDate = ref([{start: `${currentYear}-${currentMonth}-8`, end: `${currentYear}-${currentMonth}-12`}, {start: `${currentYear}-${currentMonth}-20`, end: `${currentYear}-${currentMonth}-23`}])

      const weekModeRef = ref()
      const begin = ref('2021-1-13')
      const end = ref('2025-2-13')
      const monthRange = ref(['2021-1', '2021-6', '2021-12'])
      const disabled = ref(['2021-1-2', '2021-1-4', '2021-1-23'])
      const multiTileContent = ref({
        [`${currentYear}-${currentMonth}-${currentDay}`]: {
          className: 'content-item-classname',
          content: 'some things'
        }
      })

      function onSelect(selectDate) {
        console.log(selectDate, 'selectDate')
      }

      function backToToday() {
        weekModeRef.value.setToday();
      }

      function rangeMonthFormat(year, month) {
        return [year, month + '月']
      }

      function formatOfSelecteMode(year, month) {
        const transform = {
          1: 'Jan',
          2: 'Feb',
          3: 'Mar',
          4: 'Apr',
          5: 'May',
          6: 'Jun',
          7: 'Jul',
          8: 'Aug',
          9: 'Sept',
          10: 'Oct',
          11: 'Nov',
          12: 'Dec',
        }
        return [`${year}`, `${transform[month]}`];
      }

      function formatOfRangeMode(year, month) {
        const transform = {
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六',
          7: '七',
          8: '八',
          9: '九',
          10: '十',
          11: '十一',
          12: '十二',
        }
        return [`${year}年`, `${transform[month]}月`];
      }

      function formatOfmultiMode(year, month) {
        return [`${year}年`, `${month}月`];
      }

      function selectYear(y, m) {
        console.log(y, m, 'selectYear')
      }

      function onMonthChange(y, m) {
        console.log(y, m, 'onMonthChange')
      }

      function selectMonth(y, m) {
        console.log(y, m, 'selectMonth')
      }

      function next(y, m, d) {
        console.log(y, m, d, 'nextnext')
      }

      function prev(y, m, d) {
        console.log(y, m, d, 'prevprev')
      }

      return {
        lunar,
        holidays,
        onSelect,
        monthRange,
        disabled,
        completion,
        begin,
        weeks: ['一', '二', '三', '四', '五', '六', '日'],
        end,
        selectModeDate,
        onMonthChange,
        next,
        prev,
        selectMonth,
        selectYear,
        weekModeRef,
        multiModeDate,
        multiRangeModeDate,
        rangeModeDate,
        backToToday,
        multiTileContent,
        formatOfmultiMode,
        formatOfRangeMode,
        formatOfSelecteMode,
      }
    }
  };
</script>

<style lang="less">
  body, html {
    background-color: #fbf9fe;
    margin: 0;
    padding: 0;
  }
  .container{
    width: 1000px;
    margin: 0 auto;
    .select-mode{
      .vc-calendar-year{
        margin-right: 10px;
      }
    }
    .container-select-modes{
      display: flex;
      flex-wrap: wrap;
      .select-mode, .multi-mode, .range-mode, .multiRange-mode{
        &.mpvue-calendar{
          width: 400px;
          margin: 0 auto;
          flex: none;
        }
      }
    }
    .container-view-modes{
      display: flex;
      flex-wrap: wrap;
      position: relative;
      .week-mode, .multi-mode, .range-mode, .multiRange-mode, .monthRange-mode{
        &.mpvue-calendar{
          width: 400px;
          margin: 0 auto;
          flex: none;
        }
      }
    }
  }

  .select-mode{
    &:before{
      content: 'select mode';
      text-align: center;
      display: block;
      color: #38778a;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .vc-calendar-holiday{
      white-space: nowrap;
    }
  }

  .multi-mode{
    &:before{
      content: 'multi select mode';
      text-align: center;
      display: block;
      color: #38778a;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .content-item-classname{
      color: #fff;
      background: #0b6cbc;
      display: inline-block;
      white-space: nowrap;
      padding: 0 3px;
      border-radius: 3px;
      transform: scale(.8);
    }
  }

  .range-mode{
    &:before{
      content: 'range select mode';
      text-align: center;
      display: block;
      color: #38778a;
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .multiRange-mode{
    &:before{
      content: 'multi range select mode';
      text-align: center;
      display: block;
      color: #38778a;
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .week-mode{
    &:before{
      content: 'week mode';
      text-align: center;
      display: block;
      color: #38778a;
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .monthRange-mode{
    &:before{
      content: 'month range mode';
      text-align: center;
      display: block;
      color: #38778a;
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .back-to-today{
    position: absolute;
    left: 50px;
    top: 220px;
    box-shadow: 2px 0px 2px rgb(68, 146, 123, .2);
    position: absolute;
    left: 50px;
    top: 220px;
    height: 22px;
    border: none;
    cursor: pointer;
  }

  @media screen and (max-width: 600px) {
    .container{
      width: 100%;
    }
  }
</style>
