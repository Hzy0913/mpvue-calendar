<template>
  <div class="vc-calendar-tools" v-if="!isMonthRange">
    <div class="vc-calendar-tools-container">
      <div class="vc-calendar-prev" @click="prev">
        <img :src="arrowLeft" v-if="arrowLeft" />
        <i class="iconfont icon-arrow-left" v-else />
      </div>
      <div class="vc-calendar-next" @click="next">
        <img :src="arrowRight" v-if="arrowRight" />
        <i class="iconfont icon-arrow-right" v-else />
      </div>
      <div class="vc-calendar-info" @click.stop="switchDate">
        <div class="vc-calendar-month">{{month}}</div>
        <div class="vc-calendar-year">{{year}}</div>
      </div>
    </div>
    <div
      class="vc-calendar-picker"
      :class="{'vc-picker-show': pickerVisible}"
    >
      <div :class="['vc-calendar-months', {'vc-calendar-week-switch-months': weekSwitch}]">
        <span
          v-for="(m, i) in months"
          :key="m"
          @click.stop="selectMonth(i)"
          :class="{'active': i === month}"
        >{{m}}</span>
      </div>
      <div class="vc-calendar-years" v-if="!weekSwitch">
        <span
          v-for="y in years"
          :key="y"
          @click.stop="selectYearHandle(y)"
          :class="{'active': y === year}"
        >{{y}}</span>
      </div>
    </div>
    <div class="mc-head" :class="['mc-head', {'mc-month-range-mode-head': isMonthRange}]">
      <div class="mc-head-box">
        <div v-for="(weekItem, index) in week" :key="index" class="mc-week">{{weekItem}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, reactive } from 'vue'
  import './style.less'
  import { isZh, enWeeks, zhWeeks } from '../utils'

  export default {
    props: {
      months: {
        type: Array,
        default() {
          return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        }
      },
      isMonthRange: {
        type: Boolean,
        default: false
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
      arrowLeft: {
        type: String,
        default: ''
      },
      arrowRight: {
        type: String,
        default: ''
      },
      year: {
        type: Number,
        default: 2020
      },
      month: {
        type: String,
        default: '1'
      }
    },
    setup(props) {
      const { months, year, month, weekSwitch, monFirst, weeks, prev: prevProps,selectYear, next: nextProps, selectMonth: selectMonthProps, } = props;
      const pickerVisible = ref(false);

      const height = 42

      const unit = true ? 'px' : 'rpx';

      const current = ref(1)
      const translate = ref(current.value * height)
      const stopTransition = ref(false)

      const monthTransition = [];

      const monthItem = (i, height) => {
        return {
          text: months[i],
          height: height + unit,
        }
      }
      for (let i = 0; i < 12; i++) {
        monthTransition.push(monthItem(i, height));
        if (i===11) {
          monthTransition.unshift(monthItem(11, height))
          monthTransition.push(monthItem(0, height))
        }
      }

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


      function selectMonth(month: number) {
        pickerVisible.value = false;
        selectMonthProps && selectMonthProps(month)
      }

      function selectYearHandle(year: number) {
        pickerVisible.value = false;
        selectYear && selectYear(month)
      }

      function next() {
        nextProps && nextProps(month)
      }

      function prev() {
        prevProps && prevProps(month)
      }

      const switchDate = () => {
        pickerVisible.value = !pickerVisible.value;
      }

      const years = () => {
        const yearRange = [];
        for (let i = year - 7; i < year + 8; i++) {
          yearRange.push(i);
        }
        return yearRange;
      }

      console.log(year, month, 112312312)
      return {
        year,
        month,
        unit,
        next,
        week: computedWeek(),
        years: years(),
        weekSwitch,
        selectMonth,
        selectYearHandle,
        translate,
        stopTransition,
        pickerVisible,
        switchDate,
      }
    }
  }
</script>
