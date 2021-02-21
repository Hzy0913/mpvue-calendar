<template>
  <div class="container">
    <div class="container-select-modes">
      <Calendar
        backgroundText
        class-name="select-mode"
        :format="formatOfSelecteMode"
        :holidays="holidays"
        language="en"
      />
      <Calendar
        selectMode="multi"
        class-name="multi-mode"
        language="en"
        :tile-content="multiTileContent"
      />
      <Calendar
        monFirst
        backgroundText
        selectMode="range"
        :lunar="lunar"
        class-name="range-mode"
        :format="formatOfRangeMode"
        language="cn"
      />
      <Calendar
        monFirst
        backgroundText
        selectMode="multiRange"
        class-name="multiRange-mode"
        :format="formatOfmultiMode"
      />
    </div>
    <div class="container-view-modes">
      <Calendar
        backgroundText
        :lunar="lunar"
        selectMode="range"
        class-name="week-mode"
        mode="week"
        ref="selectModeRef"
      />
      <Calendar
        backgroundText
        selectMode="range"
        class-name="monthRange-mode"
        mode="monthRange"
        :monthRange="['2021-2', '2021-3', '2021-4']"
      />
    </div>

    <button @click="click1">点击</button>
  </div>
</template>

<script>
  import Calendar from '../src/mpvue-calendar';
  import lunar from '../src/calendarinit';
  import { defineComponent, ref, reactive, onMounted, watchEffect, watch } from 'vue';

  export default {
    name: 'app',
    components: {
      Calendar
    },
    setup() {
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
      const selectbegin = ref('2021-2-12')
      const selectend = ref({
        '2021-2-5': {
          className: 'tip-1dd',
          content: '自咚咚咚'
        }
      })
      const mode = ref('week')
      const calendarRef = ref()
      const selectModeRef = ref()
      const monFirst = ref(false)
      const begin = ref('2021-1-13')
      const end = ref('2025-2-13')
      const remarks = ref({'2021-1-13': '啦啦啦'})
      const monthRange = ref(['2021-1', '2021-6', '2021-12'])
      const disabled = ref(['2021-1-2', '2021-1-4', '2021-1-23'])
      const selectDate = ref([{start: "2021-1-25", end: "2021-1-30"}])
      const tileContent = ref({
        '2021-1-5': {
          className: 'tip-1dd',
          content: '自咚咚咚'
        }
      })

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();

      const multiTileContent = ref({
        [`${currentYear}-${currentMonth}-${currentDay}`]: {
          className: 'content-item-classname',
          content: 'some things'
        }
      })

      function onSelect(e) {
        // selectDate.value = e
        console.log(e, 'onSelectonSelectonSelect')
      }

      function click1() {
        // selectbegin.value = '2021-2-5';
        // selectend.value['2021-2-24'] = '的基督教的'
        selectend.value['2021-2-15'] = {
          className: 'tip-1dd',
          content: '自咚咚咚'
        }

        // selectend.value['2021-2-15'] = {
        //   '2021-2-15': {
        //     className: 'tip-1dd',
        //     content: '自咚咚咚'
        //   }
        // }
        console.log(selectend, 'calendarRef.value')

        // selectModeRef.value.setToday()
        // end.value = '2021-1-19'
        // almanacs.value['1-5'] = '就发你分'
        // almanacs.value = {
        //   '1-5': 'aaas'
        // }
        // mode.value = 'month'
        // completion.value = false
        // calendarRef.value.render(2021, 3)
        // selectDate.value = {start: "2021-1-2", end: "2021-1-30"}
        // completion.value = false;
        // monFirst.value = true;
        // remarks.value = {
        //   '2021-1-13': 'zxxccccccc'
        // }
        // remarks.value['2021-1-13'] = 'zxczxczxczx'
        // disabled.value = ['2021-1-12', '2021-1-14', '2021-1-13']
        // disabled.value.push('2021-1-22')
        // tileContent.value['2021-1-24'] = {
        //   className: 'tip-1dd',
        //   content: '的基督教的'
        // }
      }


      function format(year, month) {
        return [year, '----' + month]
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

      return {
        lunar,
        holidays,
        onSelect,
        tileContent,
        monFirst,
        monthRange,
        selectDate,
        remarks,
        disabled,
        completion,
        mode,
        calendarRef,
        format,
        begin,
        weeks: undefined,
        end,
        selectbegin,
        selectend,
        click1,
        selectModeRef,
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

  @media screen and (max-width: 600px) {
    .container{
      width: 100%;
    }
  }
</style>
