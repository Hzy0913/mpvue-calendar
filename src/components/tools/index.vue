<template>
  <div
    class="vc-calendar-tools"
    ref="toolsRef"
    v-if="tableMode !== 'monthRange'"
  >
    <div
      class="vc-calendar-tools-container"
    >
      <div class="vc-calendar-prev" @click="prev">
        <img :src="arrowLeft" v-if="arrowLeft" />
        <i class="iconfont icon-arrow-left" v-else />
      </div>
      <div class="vc-calendar-next" @click="next">
        <img :src="arrowRight" v-if="arrowRight" />
        <i class="iconfont icon-arrow-right" v-else />
      </div>
      <div class="vc-calendar-info" @click.stop="switchDate">
        <div class="vc-calendar-year">{{formatText[0]}}</div>
        <div class="vc-calendar-month">{{formatText[1]}}</div>
      </div>
    </div>
    <div
      class="vc-calendar-picker"
      :class="{'vc-picker-show': pickerVisible}"
      :style="{height: toolsStyle.timetableHeight + toolsStyle.weekHeadHeight + toolsStyle.toolsContainerHeight + 'px', paddingTop: toolsStyle.toolsHeight + 'px'}"
    >
      <div :class="['vc-calendar-months', {'vc-calendar-week-switch-months': weekSwitch}]">
        <span
          v-for="(m, i) in months"
          :key="m"
          @click.stop="selectMonth(i + 1)"
          :class="{'piecker-month-active': (i + 1) === month}"
        >
          <i>{{m}}</i>
        </span>
      </div>
      <div class="vc-calendar-years">
        <span
          v-for="y in years"
          :key="y"
          @click.stop="selectYearHandle(y)"
          :class="{'piecker-year-active': y === year}"
        >
          <i>{{y}}</i>
        </span>
      </div>
    </div>
    <div class="vc-calendar-week-head">
      <div class="vc-calendar-week-head-container">
        <div v-for="(weekItem, index) in weeks" :key="index" class="vc-calendar-week-item">{{weekItem}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, reactive, watchEffect, watch, toRefs } from 'vue'
  import './style.less'
  import { isZh, enWeeks, zhWeeks } from '../utils'
  import {document} from "../../../../tinymce/modules/boss/src/main/ts/ephox/boss/mutant/Properties";

  export default {
    props: {
      months: {
        type: Array,
        default() {
          return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        }
      },
      weeks: {
        type: Array,
      },
      weekSwitch: {
        type: Boolean,
        default: false
      },
      monFirst: {
        type: Boolean,
        default: false
      },
      format: {
        type: Function,
      },
      tableMode: {
        type: String,
        default: 'month'
      },
      arrowLeft: {
        type: String,
        default: ''
      },
      arrowRight: {
        type: String,
        default: ''
      },
      year: {
        type: Object,
      },
      month: {
        type: Object,
      },
      timetableHeight: {
        type: Object,
      }
    },
    emits: ['next', 'prev', 'selectMonth', 'selectYear'],
    setup(props: any, { emit } : any) {
      const { months, year, month, weekSwitch, monFirst, weeks, prev: prevProps,selectYear, next: nextProps, selectMonth: selectMonthProps, timetableHeight, tableMode} = toRefs(props);
      // const month = ref(propMonth);
      const pickerVisible = ref(false);
      const toolsStyle = reactive({
        toolsContainerHeight: 0,
        toolsHeight: 0,
        timetableHeight: 0,
        weekHeadHeight: 0,
      });
      const toolsRef = ref();
      const formatText = ref([] as string[]);
      const years = ref(createYears(year.value));
      const height = 42

      function selectMonth(month: number) {
        pickerVisible.value = false;
        console.log(year.value, month, 99983333)
        emit('selectMonth', year.value, month);
      }

      function selectYearHandle(year: number) {
        pickerVisible.value = false;
        years.value = createYears(year);
        emit('selectYear', year, month.value);
      }

      function next() {
        console.log(month.value, 999833)
        emit("next", year.value, month.value);
      }

      function prev() {
        emit("prev", year.value, month.value);
      }

      function switchDate() {
        if (tableMode.value === 'week') return;

        toolsStyle.toolsContainerHeight = toolsRef.value.clientHeight;
        // toolsRef.value.par

        // let a = document.querySelector('.vc-calendar-tools-container').parentNode
        // vc-calendar-timetable

        toolsStyle.toolsHeight = toolsRef.value.querySelector('.vc-calendar-tools-container').clientHeight;
        toolsStyle.weekHeadHeight = toolsRef.value.querySelector('.vc-calendar-week-head').clientHeight;
        toolsStyle.timetableHeight = toolsRef.value.parentNode.querySelector('.vc-calendar-timetable').clientHeight;
        console.log(toolsStyle, 'toolsReftoolsReftoolsRef')
        pickerVisible.value = !pickerVisible.value;
      }

      function formatYearAndMonth() {
        const { format } = props;
        if (format) {
          return formatText.value = format(year.value, month.value);
        }
        formatText.value = [`${year.value}年`, `${month.value}月`];
      }

      formatYearAndMonth()

      watch(year.value, (count, prevCount) => {
        console.log(count,prevCount, 1177366611)
        /* ... */
      })

      watch(month, (count, prevCount) => {
        formatYearAndMonth()
      })
      watch(monFirst, (count, prevCount) => {
        // week.value = computedWeek()

        console.log(count,prevCount, 111188933124)

        /* ... */
      })

      watchEffect(() => {
        console.log(month, 11111111)
      })

      function createYears(year: number) {
        const yearRange = [];
        for (let i = year - 7; i < year + 8; i++) {
          yearRange.push(i);
        }
        return yearRange;
      }

      return {
        year,
        month,
        next,
        prev,
        weeks,
        years,
        weekSwitch,
        selectMonth,
        selectYearHandle,
        pickerVisible,
        switchDate,
        timetableHeight,
        toolsStyle,
        toolsRef,
        tableMode,
        formatText,
      }
    }
  }
</script>
