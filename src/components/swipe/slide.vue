<template>
  <div
    :class="[{[className]: !!className}, useSwipe ? 'swipe-slide': 'vc-calendar-timetable-item']"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import './style.less';

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
  };
</script>
