<template>
  <div id="app">
    <Calendar />
  </div>
</template>

<script>
  import Calendar from './components/Calendar';

  export default {
    name: 'app',
    components: {
      Calendar
    }
  }
</script>

<style lang="less">
  body {
    background-color: #fbf9fe;
  }
</style>
