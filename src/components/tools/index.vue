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
        <div class="vc-calendar-year">{{year}}</div>
        <div class="vc-calendar-month">{{month}}</div>
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
          @click.stop="selectYear(y)"
          :class="{'active': y === year}"
        >{{y}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, reactive } from 'vue'
  import './style.less'

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
      weekSwitch: {
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
      const { months, year, month, weekSwitch } = props;
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


      // cruec
      const setPosition = (direction, month, isReset) => {

        console.log(month, 12132312)
        stopTransition.value = false;


        if (direction === 'next') {
          translate.value = height * month;

          if (month === 1 && !isReset) {
            stopTransition.value = true;
            translate.value = 0;
            setPosition(direction, month, true);
          }

        }


          //
          // if (current === i) {
          //   monthTransition[current].translate = 0;
          // } else if (next === i) {
          //   monthTransition[current].translate = height;
          // } else if (prev === i) {
          //   monthTransition[current].translate = -height;
          // } else if (next > 12) {
          //   monthTransition[0].translate = height;
          // } else if (prev < 0) {
          //   monthTransition[11].translate = -height;
          // }

        // monthTransitions.

      }


      const next = () => {
        const { value } = current;
        const nextMonth = value + 1;
        current.value = nextMonth === 13 ? 1 : nextMonth;

        setPosition('next', current.value)
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
      // /

      const monthTransitions = reactive(monthTransition)


      // expose to template

      console.log(year, month, 112312312)
      return {
        year,
        month,
        unit,
        next,
        years: years(),
        weekSwitch,
        translate,
        stopTransition,
        pickerVisible,
        monthTransitions,
        switchDate,
      }
    }
  }
</script>
