<template>
  <div
    :class="[{[className]: !!className}, useSwipe ? 'swipe-slide': 'vc-calendar-timetable-item']"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import { SlideInterface } from './declare'
  import './style.less'

  export default {
    props: {
      className: {
        type: String,
        default: ''
      },
      useSwipe: {
        type: Boolean,
      },
    },
    setup(props: SlideInterface) {
      const { className, useSwipe } = props;

      return {
        className,
        useSwipe,
      }
    }
  }
</script>
