<template>
  <div class="calendar-tools" v-if="!isMonthRange">
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
          :class="['mc-month-inner', oversliding ? '' : 'month-transition']"
          :style="{'top': monthPosition + unit}"
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
      const unit = true ? 'px' : 'rpx';

      const count = ref(0)

      const monthTransition = [];
      const height = 41
      for (let i = 0; i < 12; i++) {
        monthTransition.push({
          text: months[i],
          height: height + unit,
          top: -(height * i) + unit,
        });
      }


      // cruec
      const setPosition = (current, height) => {
        const next = current + 1;
        const prev = current - 1;


        for (let i = 0; i < 12; i++) {
          if (current === i) {
            monthTransition[current].translate = 0;
          } else if (next === i) {
            monthTransition[current].translate = height;
          } else if (prev === i) {
            monthTransition[current].translate = -height;
          } else if (next > 12) {
            monthTransition[0].translate = height;
          } else if (prev < 0) {
            monthTransition[11].translate = -height;
          }
        }

        monthTransitions.

      }

      // /

      const monthTransitions = reactive(monthTransition)


      // expose to template
      return {
        count,
        monthTransitions
      }
    }
  }
</script>
