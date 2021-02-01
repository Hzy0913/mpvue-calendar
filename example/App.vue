<template>
  <div id="app">
    <Calendar
      :holidays="holidays"
      :tileContent="tileContent"
      :completion="completion"
      :monFirst="monFirst"
      :remarks="remarks"
      :weeks="weeks"
      :disabled="disabled"
      :monthRange="monthRange"
      @onSelect="onSelect"
      selectMode="multiRange"
      :mode="mode"
      :begin="begin"
      :end="end"
      :useSwipe="true"
      :format="format"
      ref="calendarRef"
    />
    <button @click="click1">点击</button>
  </div>
</template>
<!--:selectDate="selectDate"-->

<script>
  import Calendar from '../src/mpvue-calendar';
  import { defineComponent, ref, reactive, onMounted, watchEffect, watch } from 'vue'
  // 'select', 'multi', 'range', 'multiRange'
  // monthRange week month
  export default {
    name: 'app',
    components: {
      Calendar
    },
    setup() {
      const holidays = ref({
        '1-15': '节日111'
      })
      const completion = ref(false)
      const mode = ref('week')
      const calendarRef = ref()
      const monFirst = ref(false)
      const begin = ref('2021-1-13')
      const end = ref('2021-2-13')
      const remarks = ref({'2021-1-13': '啦啦啦'})
      const monthRange = ref(['2021-1', '2021-6', '2021-12'])
      const disabled = ref(['2021-1-2', '2021-1-4', '2021-1-23'])

      // const selectDate = ref('2021-1-25')
      const selectDate = ref([{start: "2021-1-25", end: "2021-1-30"}])
      const tileContent = ref({
        '2021-1-5': {
          className: 'tip-1dd',
          content: '自咚咚咚'
        }
      })
      function onSelect(e) {
        // selectDate.value = e
        console.log(e, 'onSelectonSelectonSelect')
      }
      function click1() {
        end.value = '2021-1-19'
        // almanacs.value['1-5'] = '就发你分'
        // almanacs.value = {
        //   '1-5': 'aaas'
        // }
        mode.value = 'month'
        // completion.value = false
        console.log(calendarRef, 'calendarRef.value')
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

      return {
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
        click1
      }
    }
  };
</script>

<style>
  body {
    background-color: #fbf9fe;
  }
  .mpvue-calendar{
    width: 500px;
    margin: 0 auto;
  }
</style>
