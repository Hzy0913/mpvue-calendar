<template>
  <div>
      <h1>{{title}}</h1>
  </div>
</template>

<script>

export default {
  data () {
    title: 'mpvue-calendar'
  }
}
</script>

<style>
.log-list {
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}

.log-item {
  margin: 10rpx;
}
</style>
