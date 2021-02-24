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
      :style="{height: toolsStyle.timetableHeight + toolsStyle.weekHeadHeight + toolsStyle.toolsHeight + 'px', paddingTop: toolsStyle.toolsHeight + 'px'}"
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
  import { ref, reactive, watch, toRefs } from 'vue';
  import './style.less';
  import '../icon/icon.css';

  export default {
    props: {
      months: {
        type: Array,
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
        type: [String, Number],
      },
      month: {
        type: [String, Number],
      },
      timetableHeight: {
        type: Number,
      }
    },
    emits: ['next', 'prev', 'selectMonth', 'selectYear', 'onMonthChange'],
    setup(props: any, { emit }: any) {
      const { year, month, tableMode } = toRefs(props);
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

      function selectMonth(selectedMonth: number) {
        pickerVisible.value = false;
        emit('selectMonth', year.value, selectedMonth);
        emit('onMonthChange', year.value, selectedMonth);
      }

      function selectYearHandle(selectedYear: number) {
        pickerVisible.value = false;
        years.value = createYears(selectedYear);
        emit('selectYear', selectedYear, month.value);
        emit('onMonthChange', selectedYear, month.value);
      }

      function next() {
        emit('next', year.value, month.value);
      }

      function prev() {
        emit('prev', year.value, month.value);
      }

      function switchDate() {
        if (tableMode.value === 'week') return;

        toolsStyle.toolsContainerHeight = toolsRef.value.clientHeight;
        toolsStyle.toolsHeight = toolsRef.value.querySelector('.vc-calendar-tools-container').clientHeight;
        toolsStyle.weekHeadHeight = toolsRef.value.querySelector('.vc-calendar-week-head').clientHeight;
        toolsStyle.timetableHeight = toolsRef.value.parentNode.querySelector('.vc-calendar-timetable-current').clientHeight;
        pickerVisible.value = !pickerVisible.value;
      }

      function formatYearAndMonth() {
        const { format } = props;
        if (format) {
          return formatText.value = format(year.value, month.value);
        }
        formatText.value = [`${year.value}-`, `${month.value}`];
      }

      formatYearAndMonth();

      watch(year, () => {
        formatYearAndMonth();
      });

      watch(month, () => {
        formatYearAndMonth();
        if (pickerVisible.value) {
          setTimeout(() => {
            toolsStyle.timetableHeight = toolsRef.value.parentNode.querySelector('.vc-calendar-timetable-current').clientHeight;
          });
        }

        if (!years.value.includes(year.value)) {
          years.value = createYears(year.value);
        }
      });

      function createYears(creatorYear: number) {
        const yearRange = [];
        for (let i = creatorYear - 7; i < creatorYear + 8; i++) {
          yearRange.push(i);
        }
        return yearRange;
      }

      return {
        next,
        prev,
        years,
        selectMonth,
        selectYearHandle,
        pickerVisible,
        switchDate,
        toolsStyle,
        toolsRef,
        formatText,
      };
    }
  };
</script>
