<template>
  <div class="swipe-slide" :class="{[className]: !!className}">
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
    },
    setup(props: SlideInterface) {
      const { className } = props;

      return {
        className,
      }
    }
  }
</script>
