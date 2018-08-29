<template>
  <div class="calendar">
    <div class="calendar-tools">
      <div class="calendar-prev" @click="prev">
        <img :src="arrowLeft">
      </div>
      <div class="calendar-next"  @click="next">
        <img :src="arrowRight">
      </div>
      <div class="calendar-info" @click.stop="changeYear">
        <div class="month">
          <div class="month-inner" :style="{'top': monthPosition +'rpx'}" v-if="isIos">
            <span v-for="m in months" :key="m" >{{m}}</span>
          </div>
          <div class="month-text" v-else>{{monthText}}</div>
        </div>
        <div class="year">{{year}}</div>
      </div>
    </div>
    <table cellpadding="5">
      <div class="c-head">
        <div class="c-head-box">
          <div v-for="(week, index) in weeks" :key="index" class="week">{{week}}</div>
        </div>
      </div>
      <div class="c-body">
        <tr v-for="(day,k1) in days" :key="k1" style="{'animation-delay',(k1*30)+'ms'}" :class="{'gregorianStyle': !lunar}">
          <td v-for="(child,k2) in day" :key="k2" :class="{'selected':child.selected,'disabled':child.disabled,'lunarStyle': lunar}" @click="select(k1,k2,$event)" class="day">
            <span v-if="showToday.show && showToday.today === child.day && !child.disabled" class="c-today">{{showToday.text}}</span>
            <span :class="{'red':k2==0||k2==6}" v-else>{{child.day}}</span>
            <div class="text remark-text" v-if="child.eventName && !clean">{{child.eventName}}</div>
            <div class="dot" v-if="child.eventName && clean"></div>
            <div class="text" :class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival,'isTerm':child.isTerm}" v-if="lunar && (!child.eventName || clean)">{{child.lunar}}</div>
          </td>
        </tr>
      </div>
    </table>
    <div class="calendar-years" :class="{'show':yearsShow}">
      <span v-for="y in years" :key="y" @click.stop="selectYear(y)" :class="{'active':y==year}">{{y}}</span>
    </div>
  </div>
</template>

<script>
  import calendar from './calendarinit.js'
  import {arrowLeft, arrowRight} from './images'
  export default {
    props: {
      multi: {
        type: Boolean,
        default: false
      },
      arrowLeft: {
        type: String,
        default: arrowLeft
      },
      arrowRight: {
        type: String,
        default: arrowRight
      },
      clean: {
        type: Boolean,
        default: false
      },
      now: {
        type: [String, Number],
        default: true
      },
      range:{
        type: Boolean,
        default: false
      },
      value: {
        type: Array,
        default: function(){
          return []
        }
      },
      begin:  {
        type: Array,
        default: function(){
          return []
        }
      },
      end:  {
        type: Array,
        default: function(){
          return []
        }
      },
      zero:{
        type: Boolean,
        default: false
      },
      disabled:{
        type: Array,
        default: function(){
          return []
        }
      },
      lunar: {
        type: Boolean,
        default: false
      },
      weeks: {
        type: Array,
        default:function(){
          return ['日', '一', '二', '三', '四', '五', '六']
        }
      },
      months:{
        type: Array,
        default:function(){
          return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }
      },
      events:  {
        type: Object,
        default: function(){
          return {}
        }
      },
    },
    data() {
      return {
        years:[],
        yearsShow:false,
        year: 0,
        month: 0,
        monthPosition: 0,
        day: 0,
        days: [],
        multiDays:[],
        today: [],
        handleMultiDay: [],
        firstRender: true,
        isIos: false,
        showToday: {},
        monthText: '',
        festival:{
          lunar:{
            "1-1":"春节",
            "1-15":"元宵节",
            "2-2":"龙头节",
            "5-5":"端午节",
            "7-7":"七夕节",
            "7-15":"中元节",
            "8-15":"中秋节",
            "9-9":"重阳节",
            "10-1":"寒衣节",
            "10-15":"下元节",
            "12-8":"腊八节",
            "12-23":"祭灶节",
          },
          gregorian:{
            "1-1":"元旦",
            "2-14":"情人节",
            "3-8":"妇女节",
            "3-12":"植树节",
            "4-5":"清明节",
            "5-1":"劳动节",
            "5-4":"青年节",
            "6-1":"儿童节",
            "7-1":"建党节",
            "8-1":"建军节",
            "9-10":"教师节",
            "10-1":"国庆节",
            "12-24":"平安夜",
            "12-25":"圣诞节",
          },
        },
        rangeBegin:[],
        rangeEnd:[],
      }
    },
    watch:{
      events(){
        this.render(this.year,this.month)
      },
      value(){
        this.init();
      }
    },
    mounted() {
      var self = this;
      wx.getSystemInfo({
        success: function(res) {
          self.isIos = (res.system.split(' ') || [])[0] === 'iOS';
        }
      });
      this.init()
    },
    methods: {
      init(){
        let now = new Date();
        this.year = now.getFullYear()
        this.month = now.getMonth()
        this.day = now.getDate()
        if (this.value.length || this.multi) {
          if (this.range) {
            this.year = parseInt(this.value[0][0])
            this.month = parseInt(this.value[0][1]) - 1
            this.day = parseInt(this.value[0][2])
            let year2 = parseInt(this.value[1][0])
            let month2 = parseInt(this.value[1][1]) - 1
            let day2 = parseInt(this.value[1][2])
            this.rangeBegin = [this.year, this.month,this.day]
            this.rangeEnd = [year2, month2 , day2]
          }else if(this.multi){
            this.multiDays = this.value;
            const handleMultiDay = this.handleMultiDay;
            if (this.firstRender) {
              this.firstRender = false;
              const thatYear = (this.value[0] || [])[0];
              const thatMonth = (this.value[0] || [])[1];
              if (isFinite(thatYear) && isFinite(thatMonth)) {
                this.month = parseInt(thatMonth) - 1;
                this.year = parseInt(thatYear);
              }
            } else if (this.handleMultiDay.length) {
              this.month = parseInt(handleMultiDay[handleMultiDay.length - 1][1]) - 1;
              this.year = parseInt(handleMultiDay[handleMultiDay.length - 1][0]);
              this.handleMultiDay = [];
            } else {
              this.month = parseInt(this.value[this.value.length - 1][1]) - 1;
              this.year = parseInt(this.value[this.value.length - 1][0]);
            }
            this.day = parseInt((this.value[0] || [])[2])
          }else{
            this.year = parseInt(this.value[0])
            this.month = parseInt(this.value[1]) - 1
            this.day = parseInt(this.value[2])
          }
        }
        this.monthPosition = this.month * -40
        this.monthText = this.months[this.month];
        this.render(this.year, this.month)
      },
      // 渲染日期
      render(y, m) {
        let firstDayOfMonth = new Date(y, m, 1).getDay()
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate()
        let lastDayOfLastMonth = new Date(y, m, 0).getDate()
        const disabledFilter = (disabled) => {
          return disabled.filter(v => {
            const arr = v.split('-');
            return this.year == arr[0] && this.month == arr[1]-1 && i == arr[2]
          });
        }
        this.year = y
        let seletSplit = this.value
        let i, line = 0,temp = [],nextMonthPushDays = 1
        for (i = 1; i <= lastDateOfMonth; i++) {
          let day = new Date(y, m, i).getDay()
          let k
          if (day == 0) {
            temp[line] = []
          } else if (i == 1) {
            temp[line] = []
            k = lastDayOfLastMonth - firstDayOfMonth + 1
            for (let j = 0; j < firstDayOfMonth; j++) {
              temp[line].push(Object.assign(
                {day: k,disabled: true},
                this.getLunarInfo(this.computedPrevYear(),this.computedPrevMonth(true),k),
                this.getEvents(this.computedPrevYear(),this.computedPrevMonth(true),k),
              ))
              k++;
            }
          }
          if (this.range) {
            let options = Object.assign(
              {day: i},
              this.getLunarInfo(this.year,this.month+1,i),
              this.getEvents(this.year,this.month+1,i),
            )
            if (this.rangeBegin.length > 0) {
              let beginTime = Number(new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2]))
              let endTime = Number(new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]))
              let stepTime = Number(new Date(this.year, this.month, i))
              if (beginTime <= stepTime && endTime >= stepTime) {
                options.selected = true
              }
            }
            if (this.begin.length>0) {
              let beginTime = Number(new Date(parseInt(this.begin[0]),parseInt(this.begin[1]) - 1,parseInt(this.begin[2])))
              if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            if (this.end.length>0){
              let endTime = Number(new Date(parseInt(this.end[0]),parseInt(this.end[1]) - 1,parseInt(this.end[2])))
              if (endTime <  Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            if (this.disabled.length>0){
              if ((disabledFilter(this.disabled)).length) {
                options.disabled = true
              }
            }
            temp[line].push(options)
          }else if(this.multi){
            let options
            if(this.value.filter(v => {return this.year === v[0] && this.month === v[1]-1 && i === v[2] }).length>0 ){
              options = Object.assign({day: i,selected:true},this.getLunarInfo(this.year,this.month+1,i),this.getEvents(this.year,this.month+1,i))
            }else{
              options = Object.assign({day: i,selected:false},this.getLunarInfo(this.year,this.month+1,i),this.getEvents(this.year,this.month+1,i))
              if (this.begin.length>0) {
                let beginTime = Number(new Date(parseInt(this.begin[0]),parseInt(this.begin[1]) - 1,parseInt(this.begin[2])))
                if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.end.length>0){
                let endTime = Number(new Date(parseInt(this.end[0]),parseInt(this.end[1]) - 1,parseInt(this.end[2])))
                if (endTime <  Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.disabled.length>0){
                if ((disabledFilter(this.disabled)).length) {
                  options.disabled = true
                }
              }
            }
            temp[line].push(options)
          } else { // 单选
            let chk = new Date()
            let chkY = chk.getFullYear()
            let chkM = chk.getMonth()
            if (parseInt(seletSplit[0]) == this.year && parseInt(seletSplit[1]) - 1 == this.month && parseInt(seletSplit[2]) == i) {
              temp[line].push(Object.assign(
                {day: i,selected: true},
                this.getLunarInfo(this.year,this.month+1,i),
                this.getEvents(this.year,this.month+1,i),
              ))
              this.today = [line, temp[line].length - 1]
            }
            else if (chkY == this.year && chkM == this.month && i == this.day && this.value == "") {
              temp[line].push(Object.assign(
                {day: i,selected: true},
                this.getLunarInfo(this.year,this.month+1,i),
                this.getEvents(this.year,this.month+1,i),
              ))
              this.today = [line, temp[line].length - 1]
            }else{
              let options = Object.assign(
                {day: i,selected:false},
                this.getLunarInfo(this.year,this.month+1,i),
                this.getEvents(this.year,this.month+1,i),
              )
              if (this.begin.length>0) {
                let beginTime = Number(new Date(parseInt(this.begin[0]),parseInt(this.begin[1]) - 1,parseInt(this.begin[2])))
                if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.end.length>0){
                let endTime = Number(new Date(parseInt(this.end[0]),parseInt(this.end[1]) - 1,parseInt(this.end[2])))
                if (endTime <  Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.disabled.length>0){
                if ((disabledFilter(this.disabled)).length) {
                  options.disabled = true
                }
              }
              temp[line].push(options)
            }
          }
          if (day == 6 && i < lastDateOfMonth) {
            line++
          }else if (i == lastDateOfMonth) {
            let k = 1
            for (let d=day; d < 6; d++) {
              temp[line].push(Object.assign(
                {day: k,disabled: true},
                this.getLunarInfo(this.computedNextYear(),this.computedNextMonth(true),k),
                this.getEvents(this.computedNextYear(),this.computedNextMonth(true),k),
              ))
              k++
            }
            nextMonthPushDays=k
          }
        }
        if(line<=5 && nextMonthPushDays>0){
          for (let i = line+1; i<=5; i++) {
            temp[i] = []
            let start=nextMonthPushDays+(i-line-1)*7
            for (let d=start; d <= start+6; d++) {
              temp[i].push(Object.assign(
                {day: d,disabled: true},
                this.getLunarInfo(this.computedNextYear(),this.computedNextMonth(true),d),
                this.getEvents(this.computedNextYear(),this.computedNextMonth(true),d),
              ))
            }
          }
        }
        this.days = temp;
        if (typeof this.now === 'boolean' && !this.now) {
          this.showToday = {show: false};
        } else {
          const now = new Date();
          const nowYear = now.getFullYear();
          const nowMonth = now.getMonth();
          const nowDay = now.getDate();
          if (this.now && this.year === nowYear && this.month === nowMonth) {
            const now = new Date();
            const nowYear = now.getFullYear();
            const nowMonth = now.getMonth();
            const nowDay = now.getDate();
            this.showToday = {
              show: true,
              today: nowDay,
              text: typeof this.now === 'string' ? this.now : '今'
            };
          } else {
            this.showToday = {show: false};
          }
        }
      },
      computedPrevYear(){
        let value=this.year
        if(this.month-1<0){
          value--
        }
        return value
      },
      computedPrevMonth(isString){
        let value=this.month
        if(this.month-1<0){
          value=11
        }else{
          value--
        }
        if(isString){
          return value+1
        }
        return value
      },
      computedNextYear(){
        let value=this.year
        if(this.month+1>11){
          value++
        }
        return value
      },
      computedNextMonth(isString){
        let value=this.month
        if(this.month+1>11){
          value=0
        }else{
          value++
        }
        if(isString){
          return value+1
        }
        return value
      },
      getLunarInfo(y,m,d){
        let lunarInfo=calendar.solar2lunar(y,m,d)
        let lunarValue=lunarInfo.IDayCn
        let Term=lunarInfo.Term
        let isLunarFestival=false
        let isGregorianFestival=false
        if(this.festival.lunar[lunarInfo.lMonth+"-"+lunarInfo.lDay]!=undefined){
          lunarValue=this.festival.lunar[lunarInfo.lMonth+"-"+lunarInfo.lDay]
          isLunarFestival=true
        }else if(this.festival.gregorian[m+"-"+d]!=undefined){
          lunarValue=this.festival.gregorian[m+"-"+d]
          isGregorianFestival=true
        }
        return {
          lunar:Term || lunarValue,
          isLunarFestival:isLunarFestival,
          isGregorianFestival:isGregorianFestival,
          isTerm: lunarInfo.isTerm,
        }
      },
      getEvents(y,m,d){
        if(Object.keys(this.events).length==0)return false;
        let eventName=this.events[y+"-"+m+"-"+d]
        let data={}
        if(eventName!=undefined){
          data.eventName=eventName
        }
        return data
      },
      prev(e) {
        e.stopPropagation()
        if (this.month == 0) {
          this.month = 11
          this.year = parseInt(this.year) - 1
        } else {
          this.month = parseInt(this.month) - 1
        }
        this.monthPosition = this.month * -40
        this.monthText = this.months[this.month];
        this.render(this.year, this.month)
        this.$emit('selectMonth',this.month+1,this.year)
        this.$emit('prev',this.month+1,this.year)
      },
      next(e) {
        e.stopPropagation()
        if (this.month == 11) {
          this.month = 0
          this.year = parseInt(this.year) + 1
        } else {
          this.month = parseInt(this.month) + 1
        }
        this.monthPosition = this.month * -40
        this.monthText = this.months[this.month]
        this.render(this.year, this.month)
        this.$emit('selectMonth',this.month+1,this.year)
        this.$emit('next',this.month+1,this.year)
      },
      select(k1, k2, e) {
        if (e != undefined) e.stopPropagation()
        if (this.range) {
          if (this.rangeBegin.length == 0 || this.rangeEndTemp != 0) {
            this.rangeBegin = [this.year, this.month,this.days[k1][k2].day]
            this.rangeBeginTemp = this.rangeBegin
            this.rangeEnd = [this.year, this.month, this.days[k1][k2].day]
            this.rangeEndTemp = 0

          } else {
            this.rangeEnd = [this.year, this.month,this.days[k1][k2].day]
            this.rangeEndTemp = 1
            if (+new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]) < +new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2])) {
              this.rangeBegin = this.rangeEnd
              this.rangeEnd = this.rangeBeginTemp
            }
            let begin=[]
            let end=[]
            if(this.zero){
              this.rangeBegin.forEach((v,k)=>{
                if(k==1)v=v+1
                begin.push(this.zeroPad(v))
              })
              this.rangeEnd.forEach((v,k)=>{
                if(k==1)v=v+1
                end.push(this.zeroPad(v))
              })
            }else{
              begin=this.rangeBegin
              end=this.rangeEnd
            }
            this.$emit('select',begin,end)
          }
          this.render(this.year, this.month)
        }else if (this.multi) {
          const filterDayIndex = this.multiDays.findIndex(v => this.year === v[0] && this.month === v[1]-1 && this.days[k1][k2].day === v[2]);
          if(~filterDayIndex) {
            this.handleMultiDay = this.multiDays.splice(filterDayIndex, 1);
          } else {
            this.multiDays.push([this.year, this.month+1, this.days[k1][k2].day]);
          }
          this.days[k1][k2].selected = !this.days[k1][k2].selected
          this.$emit('select',this.multiDays)
        } else {
          if (this.today.length > 0) {
            this.days.forEach(v=>{
              v.forEach(vv=>{
                vv.selected= false
              })
            })
          }
          this.days[k1][k2].selected = true
          this.day = this.days[k1][k2].day
          this.today = [k1, k2]
          this.$emit('select',[this.year,this.zero?this.zeroPad(this.month + 1):this.month + 1,this.zero?this.zeroPad(this.days[k1][k2].day):this.days[k1][k2].day])
        }
      },
      changeYear(){
        if(this.yearsShow){
          this.yearsShow=false
          return false
        }
        this.yearsShow=true
        this.years=[];
        for(let i=~~this.year-10;i<~~this.year+10;i++){
          this.years.push(i)
        }
      },
      selectYear(value){
        this.yearsShow=false
        this.year=value
        this.render(this.year,this.month)
        this.$emit('selectYear',value)
      },
      setToday(){
        let now = new Date();
        this.year = now.getFullYear()
        this.month = now.getMonth()
        this.day = now.getDate()
        this.render(this.year,this.month)
        this.monthPosition = this.month * -40;
        this.monthText = this.months[this.month];
        this.days.forEach(v => {
          let day=v.find(vv => {
            return vv.day==this.day && !vv.disabled
          })
          if(day!=undefined ){
            day.selected=true
          }
        })
      },
      dateInfo(y, m, d) {
        return calendar.solar2lunar(y, m, d);
      },
      zeroPad(n){
        return String(n < 10 ? '0' + n : n)
      },
    }
  }
</script>

<style>
  .calendar {
    margin:auto;
    width: 100%;
    min-width:300px;
    background: #fff;
    user-select:none;
    position: relative;
  }
  .calendar-tools{
    height:40px;
    font-size: 20px;
    line-height: 40px;
    color:#5e7a88;
    box-shadow: 0rpx 4rpx 8rpx rgba(25, 47, 89, 0.1);
    margin-bottom: 30rpx;
    border-top: 1px solid rgba(200, 200, 200, .1);
  }
  .calendar-tools span{
    cursor: pointer;
  }
  .calendar-prev{
    width: 14.28571429%;
    float:left;
    text-align: center;
  }
  .calendar-prev img, .calendar-next img{
    width: 34rpx;
    height: 34rpx;
  }
  .calendar-info{
    padding-top: 3px;
    font-size:16px;
    line-height: 1.3;
    text-align: center;
    width: 220rpx;
    margin: 0 auto;
  }
  .calendar-info>div.month{
    margin:auto;
    height:40rpx;
    width:100px;
    text-align: center;
    color:#5e7a88;
    overflow: hidden;
    position: relative;
  }
  .calendar-info>div.month .month-inner{
    position: absolute;
    left:0;
    top:0;
    height:480rpx;
    transition:top .5s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .calendar-info .month-text{
    display:block;
    font-size:28rpx;
    height:40rpx;
    width:200rpx;
    overflow:hidden;
    text-align:center;
  }
  .calendar-info>div.month .month-inner>span{
    display: block;
    font-size: 14px;
    height:20px;
    width:100px;
    overflow: hidden;
    text-align: center;
  }
  .calendar-info>div.year{
    font-size:10px;
    line-height: 1;
    color:#999;
  }
  .calendar-next{
    width: 14.28571429%;
    float:right;
    text-align: center;
  }

  .calendar table {
    clear: both;
    width: 100%;
    margin-bottom:10px;
    border-collapse: collapse;
    color: #444444;
  }
  .calendar td {
    margin:2px !important;
    padding:0px 0;
    width: 14.28571429%;
    height:88rpx;
    text-align: center;
    vertical-align: middle;
    font-size:14px;
    line-height: 125%;
    cursor: pointer;
    position: relative;
    vertical-align: top;
  }
  .calendar td.week{
    font-size:10px;
    pointer-events:none !important;
    cursor: default !important;
  }
  .calendar td.disabled {
    color: #ccc;
    pointer-events:none !important;
    cursor: default !important;
  }
  .calendar td.disabled div{
    color: #ccc;
  }
  .calendar td span{
    display:block;
    height:76rpx;
    width:76rpx;
    font-size: 28rpx;
    line-height:76rpx;
    margin:0px auto;
    border-radius:50%;
  }
  .calendar td:not(.disabled) span.red{
    color:#ea6151;
  }
  .c-today{
    color: #3b75fb;
  }
  .calendar td.selected span{
    background-color: #3b75fb;
    color: #fff;
  }
  .calendar td .text{
    position: absolute;
    top:28px;
    left:0;
    right:0;
    text-align: center;
    padding:2px;
    font-size:20rpx;
    line-height: 1.2;
    color:#444;
  }
  .calendar td .isGregorianFestival,
  .calendar td .isTerm,
  .calendar td .isLunarFestival{
    color:#ea6151;
  }
  .calendar td.selected span.red{
    background-color: #3b75fb;
    color: #fff;
  }
  .selected .text {
    color: #fff !important;
  }
  .calendar .lunarStyle span{
    width: 80rpx;
    height: 80rpx;
    line-height:54rpx;
  }
  .calendar .lunarStyle .text{
    top: 44rpx;
  }
  .calendar thead td {
    text-transform: uppercase;
    height:30px;
    vertical-align: middle;
  }
  .calendar-button{
    text-align: center;
  }
  .calendar-button span{
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    min-width: 5em;
    vertical-align: baseline;
    background:#5e7a88;
    color:#fff;
    margin: 0 .25em 0 0;
    padding: .6em 2em;
    font-size: 1em;
    line-height: 1em;
    text-align: center;
    border-radius: .3em;
  }
  .calendar-button span.cancel{
    background:#efefef;
    color:#666;
  }
  .calendar-years{
    position: absolute;
    left:0px;
    top:85rpx;
    right:0px;
    bottom:0px;
    background:#fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap:wrap;
    overflow: auto;
    transition:all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
  }
  .calendar-years.show{
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0px);
  }
  .calendar-years>span{
    margin:1px 5px;
    display: inline-block;
    width:60px;
    line-height: 30px;
    border-radius: 20px;
    text-align:center;
    border:1px solid #fbfbfb;
    color:#999;
  }
  .calendar-years>span.active{
    border:1px solid #587dff;
    background-color: #587dff;
    box-shadow: 4rpx 4rpx 2rpx rgba(88, 125, 255, 0.4);
    color:#fff;
  }
  .c-head {
    margin-bottom: 20rpx;
  }
  .c-head div {
    overflow: hidden;
  }
  .c-head-box div {
    flex:1;
    text-align: center;
  }
  .c-head-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: space-between
  }
  .c-head-box div {
    font-size: 28rpx;
  }
  .c-body tr {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: space-between
  }
  .dot {
    width: 10rpx;
    height: 10rpx;
    background-color: #ea6151;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: 5rpx;
  }
  .remark-text {
    padding-left: 8rpx;
    padding-right: 8rpx;
    box-sizing: border-box;
    height: 34rpx;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
</style>
