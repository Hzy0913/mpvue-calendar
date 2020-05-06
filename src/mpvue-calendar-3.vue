<template>
  <div class="mpvue-calendar" ref="calendar">
    <Tools />
  </div>
</template>

<script>
  import { ref, reactive } from 'vue'
  import Tools from './tools'
  import './icon.css'

  export default {
    components: {
      Tools
    },
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })

      // expose to template
      return {
        count,
        object
      }
    }
  }
</script>
