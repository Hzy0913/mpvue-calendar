<template>
  <div>
    <Calendar
      @next="next"
      @prev="prev"
      :events="events"
      :value="value"
      @select="select"
      ref="calendar"
      @selectMonth="selectMonth"
      @selectYear="selectYear"
      lunar
      range
      responsive
      :tileContent="tileContent"
      :almanacs="almanacs"
      :weekSwitch="false"
      rangeMonthFormat="yyyy年MM月"
    />
    <p v-if="info" class="pp">{{info.cYear}}-{{info.cMonth}}-{{info.cDay}}，{{info.Animal}}年，农历{{info.IMonthCn}}{{info.IDayCn}}，{{info.astro}}</p>
    <p v-if="info" class="pp">备注：{{info.eve}}</p>
    <button @click="setToday" class="today">返回今12日</button>
    <!--<button @click="dateInfo">今日信息</button>-->
    <!--<button @click="settileContent">今日信息</button>-->
  </div>
</template>

<script>
  import Calendar from '../../components/mpvue-calendar'
  import '../../components/style.css';

  export default {
    data () {
      return {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        disabledArray: ['2018-6-27','2018-6-25'],
        monthRange: ['2019-2', '2019-8'],
        value: [[2018,12, 18], [2018,12, 23]],
        begin:[2016,1,1],
        end:[2020,1,1],
        events: {'2018-11-20':'项目截止', '2018-11-17':'今日团建'},
        info: null,
        weekSwitch: false,
        almanacs: {'9-3': '抗战胜利日', '11-17': '学生日'},
        tileContent: [
          {date: '2018-9-22', className: 'xiu', content: '休'},
          {date: '2018-9-23', className: 'xiu', content: '休'},
          {date: '2018-9-24', className: 'xiu', content: '休'},
          {date: '2018-10-1', className: 'xiu', content: '休'},
          {date: '2018-10-2', className: 'xiu', content: '休'},
          {date: '2018-10-3', className: 'xiu', content: '休'},
          {date: '2018-10-4', className: 'xiu', content: '休'},
          {date: '2018-10-5', className: 'xiu', content: '休'},
          {date: '2018-10-6', className: 'xiu', content: '休'},
          {date: '2018-10-7', className: 'xiu', content: '休'},
          {date: '2018-9-29', className: 'ban', content: '班'},
          {date: '2018-9-30', className: 'ban', content: '班'},
        ]
      }
    },
    components: {
      Calendar
    },
    methods: {
      selectMonth(month,year){
        console.log(year,month)
      },
      settileContent(){
        this.tileContent.push({date: '2018-9-25', className: 'asadcccc', content: '休1'});
        this.almanacs = {'9-18': 'aaaaaa', '9-25': '123123撒打算的'};/**/
        this.$refs.calendar.renderer(2018, 1); //渲染2018年8月份
      },
      prev(month){
        console.log(month)
      },
      next(month){
        console.log(month)
      },
      selectYear(year){
        console.log(year)
      },
      setToday() {
        this.$refs.calendar.setToday();
      },
      dateInfo() {
        const info = this.$refs.calendar.dateInfo(2018, 8, 23);
        console.log(info);
      },
      select(val, val2) {
        const info = this.$refs.calendar.dateInfo(val[0], val[1], val[2]);
        const eve = this.events[`${val[0]}-${val[1]}-${val[2]}`]
        this.info = info;
        this.info.eve = eve;
        console.log(val)
        console.log(val2)
      }
    }
  }
</script>

<style>

</style>
