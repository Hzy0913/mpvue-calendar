<template>
  <div class="calendar-wrapper">
    <div class="calendar">
      <Calendar
        :clean="clean"
        :lunar="lunar"
        ref="calendar"
        :range="isrange"
        :multi="ismulti"
        :almanacs="almanacs"
        :tileContent="tileContent"
        @select="select"
        @next="next"
        @prev="prev"
        :value="value"
        :disabled="disabledArray"
        :weekSwitch="weekSwitch"
        :events="events"
        :monthRange="monthRange"
        rangeMonthFormat="yyyy年MM月"
        monFirst
        responsive
      />
    </div>
    <div class="box">
      <div class="setToday" @click="setToday">返回今日</div>
      <div class="setToday" @click="renderer">渲染指定月份(2018-8)</div>
      <div class="setToday" @click="dateInfo">打印日期信息(2018-8-23)</div>
    </div>
    <div class="box-mode">
      <div :class="[{'selectMode': isrange}, 'mode-btn']" @click="rangeMode">范围模式</div>
      <div :class="[{'selectMode': ismulti}, 'mode-btn']" @click="multiMode">多选模式</div>
      <div :class="[{'selectMode': !ismulti && !isrange}, 'mode-btn']" @click="valueMode">单选模式</div>
      <div :class="[{'selectMode': !ismulti && !isrange}, 'mode-btn', 'mode-switch']" @click="switchMode">按{{weekSwitch ? '月' : '周'}}切换</div>
      <br/>
      <div :class="[{'selectMode': isrange}, 'mode-btn']" @click="setMonthRange">显示{{monthRangeText}}月份</div>
      <div class="data-info" >
        <p><span>选中日期:</span></p>
        <div class="content">
          <span v-for="(value, index) in renderValues" :key="index">{{value}}</span>
        </div>
      </div>
    </div>
    <div class="data-info" v-if="!!dataInfo.cYear">
      <p><span>公历日期:</span>{{dataInfo.cYear}}-{{dataInfo.cMonth}}-{{dataInfo.cDay}}</p>
      <p><span>星期:</span>{{dataInfo.ncWeek}}</p>
      <p><span>星座:</span>{{dataInfo.astro}}</p>
      <p><span>属相:</span>{{dataInfo.Animal}}</p>
      <p><span>农历日期:</span>{{dataInfo.lYear}}-{{dataInfo.lMonth}}-{{dataInfo.lDay}}</p>
      <p><span>农历写法:</span>{{dataInfo.IMonthCn}}{{dataInfo.IDayCn}}</p>
      <p><span>传统历法:</span>{{dataInfo.gzYear}}年  {{dataInfo.gzMonth}}月  {{dataInfo.gzDay}}日</p>
      <p><span>节气:</span>{{dataInfo.Term}}</p>
    </div>
  </div>
</template>

<script>
  import Calendar from '../../src/mpvue-calendar'
  import '../../src/browser-style.css'
  import {holiday} from './holiday'
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  export default {
    data () {
      return {
        value: [[year, month, 16], [year, month, 22]],
        isrange: true,
        weekSwitch: false,
        ismulti: false,
        dataInfo: {},
        monFirst: true,
        clean: false, //简洁模式
        lunar: true, //显示农历
        events: {'2019-2-7':'今日备注', '2019-2-8':'一条很长的明日备注'},
        tileContent: holiday,
        renderValues: [],
        disabledArray: ['2019-1-27','2019-2-25'],
        almanacs: {'11-14': '学生日', '11-22': '感恩日'},
        monthRange: []
      }
    },
    components: {
      Calendar
    },
    mounted() {
      this.handelRenderValues();
    },
    computed: {
      monthRangeText() {
        return this.monthRange.length ? '固定' : '指定范围';
      }
    },
    methods: {
      clickSomeThing(data) {
        this.value = [[2019, 4, 1], [2019,4,8]];
        this.events = {'2019-2-12': '啦啦啦啦啦啦'};
        this.disabledArray.push('2018-11-7');
        this.almanacs['11-4'] = '1231231231';
        console.log(data);
      },
      setMonthRange(data) {
        this.monthRange = !!this.monthRange.length ? [] : ['2019-4', '2020-1'];
      },
      switchMode(data){
        this.weekSwitch = !this.weekSwitch;
        setTimeout(() => {
          this.$refs.calendar.renderer(2019, 1); //渲染2018年8月份
        }, 0)
      },
      handelRenderValues(data){
        if (this.ismulti) {
          this.renderValues = this.value.map(v => v.join('-'))
        } else if (this.isrange) {
          const values = [];
          const valueData = data || this.value;
          this.value.forEach((v, i) => {
            values.push(v.join('-'));
            if (!i) {
              values.push('~');
            }
          });
          this.renderValues = values;
        } else {
          this.renderValues = [this.value.join('-')];
        }
      },
      multiMode(value){
        this.ismulti = true;
        this.isrange = false;
        this.value = [[year, month, 16], [year, month, 18]];
        this.handelRenderValues();
        this.$refs.calendar.renderer(year, month);
      },
      rangeMode(value){
        this.ismulti = false;
        this.isrange = true;
        this.value = [[year, month, 16], [year, month, 22]];
        this.handelRenderValues();
        this.$refs.calendar.renderer(year, month);
      },
      valueMode(value){
        this.ismulti = false;
        this.isrange = false;
        this.value = [year, month, 16];
        this.handelRenderValues();
        this.$refs.calendar.renderer(year, month);
      },
      selectMonth(month,year){
        console.log(year,month)
      },
      prev(y, m, w){
        console.log(y, m, w)
      },
      next(year, month, week){
        console.log(year, month, week)
      },
      selectYear(year){
        console.log(year)
      },
      setToday() {
        this.$refs.calendar.setToday();
      },
      dateInfo() {
        const info = this.$refs.calendar.dateInfo(2018, 8, 23);
        this.dataInfo = info;
        console.log(info);
      },
      renderer() {
        if (this.monthRange.length) {
          this.monthRange = ['2018-8', '2018-8'];
        }
        this.$refs.calendar.renderer(2018, 8); //渲染2018年8月份
      },
      select(val, val2) {
        if (this.isrange) {
          this.handelRenderValues([val, val2]);
        } else if (this.ismulti) {
          this.handelRenderValues(val);
        } else {
          this.handelRenderValues([val]);
        }
        console.log(val);
        console.log(val2);
      }
    }
  }
</script>

<style>
  @import './style.css';
</style>
