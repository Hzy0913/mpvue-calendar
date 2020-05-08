<template>
  <div class="vc-calendar-tools" v-if="!isMonthRange">
    <div class="calendar-prev" @click="prev">
      <img :src="arrowLeft" v-if="arrowLeft">
      <i class="iconfont icon-arrow-left" v-else></i>
    </div>
    <div class="calendar-next" @click="next">
      <img :src="arrowRight" v-if="arrowRight">
      <i class="iconfont icon-arrow-right" v-else></i>
    </div>
    <div class="calendar-info" @click.stop="changeYear">
      <div class="mc-month">
        <div
          :class="['mc-month-inner', stopTransition ? 'stop-transition' : '', oversliding ? '' : 'month-transition']"
          :style="{'top': -translate + unit}"
          v-if="isIos"
        >
          <span
            v-for="month in monthTransitions"
            :key="month.text"
            :style="{position: 'relative', height: month.height, top: month.top}"
          >{{month.text}}</span>
        </div>
        <div class="mc-month-text" v-else>{{monthText}}</div>
      </div>
      <div class="mc-year">{{year}}</div>
    </div>
  </div>
</template>

<script>
  import { ref, reactive } from 'vue'

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
      arrowLeft: {
        type: String,
        default: ''
      },
      arrowRight: {
        type: String,
        default: ''
      },
      isIos: {
        type: String,
        default: true
      },
    },
    setup(props) {
      const { months } = props;
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

      // /

      const monthTransitions = reactive(monthTransition)


      // expose to template
      return {
        unit,
        next,
        translate,
        stopTransition,
        monthTransitions
      }
    }
  }
</script>
