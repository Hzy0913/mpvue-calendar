<template>
  <div class="mpvue-calendar" ref="calendar">
    <div class="calendar-tools">
      <div class="calendar-prev" @click="prev">
        <img :src="arrowLeft" v-if="!!arrowLeft">
        <i class="iconfont icon-arrow-left" v-else></i>
      </div>
      <div class="calendar-next"  @click="next">
        <img :src="arrowRight" v-if="!!arrowRight">
        <i class="iconfont icon-arrow-right" v-else></i>
      </div>
      <div class="calendar-info" @click.stop="changeYear">
        <div class="mc-month">
          <div :class="['mc-month-inner', oversliding ? '' : 'month-transition']" :style="{'top': monthPosition + unit}" v-if="isIos">
            <span v-for="(m, i) in monthsLoop" :key="i" >{{m}}</span>
          </div>
          <div class="mc-month-text" v-else>{{monthText}}</div>
        </div>
        <div class="mc-year">{{year}}</div>
      </div>
    </div>
    <table cellpadding="5">
      <div class="mc-head">
        <div class="mc-head-box">
          <div v-for="(week, index) in weeks" :key="index" class="mc-week">{{week}}</div>
        </div>
      </div>
      <div class="mc-body">
        <tr v-for="(day,k1) in days" :key="k1" :class="{'gregorianStyle': !lunar}">
          <td v-for="(child,k2) in day" :key="k2" :class="[{'selected': child.selected, 'disabled': child.disabled, 'lunarStyle': lunar}, child.className]" @click="select(k1, k2, child, $event)" class="mc-day" :style="itemStyle">
            <span v-if="showToday.show && showToday.today === child.day && !child.disabled" class="mc-today">{{showToday.text}}</span>
            <span :class="[{'mc-date-red': k2 === (monFirst ? 5 : 0) || k2 === 6}, 'calendar-date']" v-else>{{child.day}}</span>
            <div class="slot-element" v-if="!!child.content">{{child.content}}</div>
            <div class="mc-text remark-text" v-if="child.eventName && !clean">{{child.eventName}}</div>
            <div class="mc-dot" v-if="child.eventName && clean"></div>
            <div class="mc-text" :class="{'isLunarFestival': child.isAlmanac || child.isLunarFestival,'isGregorianFestival': child.isGregorianFestival,'isTerm': child.isTerm}" v-if="lunar && (!child.eventName || clean)">{{child.almanac || child.lunar}}</div>
          </td>
        </tr>
      </div>
    </table>
    <div class="mpvue-calendar-change" :class="{'show': yearsShow}">
      <div class="calendar-years">
        <span v-for="y in years" :key="y" @click.stop="selectYear(y)" :class="{'active': y === year}">{{y}}</span>
      </div>
      <div class="calendar-months">
        <span v-for="(m, i) in months" :key="m" @click.stop="changeMonth(i)" :class="{'active': i === month}">{{m}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import calendar from './calendarinit.js';
  import './icon.css';
  const isBrowser = !!window;
  export default {
    props: {
      multi: {
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
      clean: {
        type: Boolean,
        default: false
      },
      now: {
        type: [String, Boolean],
        default: true
      },
      range:{
        type: Boolean,
        default: false
      },
      completion:{
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
      almanacs:{
        type: Object,
        default: function(){
          return {}
        }
      },
      tileContent:{
        type: Array,
        default: function(){
          return []
        }
      },
      lunar: {
        type: Boolean,
        default: false
      },
      monFirst: {
        type: Boolean,
        default: false
      },
      weeks: {
        type: Array,
        default:function(){
          return this.monFirst ? ['一', '二', '三', '四', '五', '六', '日'] : ['日', '一', '二', '三', '四', '五', '六']
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
        isIos: true,
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
            "12-23":"小年",
          },
          gregorian:{
            "1-1":"元旦",
            "2-14":"情人节",
            "3-8":"妇女节",
            "3-12":"植树节",
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
        multiDaysData: [],
        itemStyle: {},
        unit: isBrowser ? 'px' : 'rpx',
        positionH: isBrowser ? -24 : -40,
        monthIndex: 0,
        oversliding: false
      }
    },
    watch:{
      events(){
        this.render(this.year, this.month);
      },
      disabled(){
        this.render(this.year, this.month);
      },
      value(){
        this.init();
      },
      tileContent(){
        this.render(this.year, this.month)
      },
      almanacs(){
        this.render(this.year, this.month)
      }
    },
    computed: {
      monthsLoop() {
        const loopArray = [];
        this.months.forEach(v => loopArray.push(v));
        loopArray.unshift(this.months[this.months.length - 1]);
        loopArray.push(this.months[0]);
        return loopArray;
      }
    },
    mounted() {
      const self = this;
      const calendar = this.$refs.calendar;
      const itemWidth = (calendar.clientWidth/7 - 4).toFixed(5) + 'px';
      this.itemStyle = {width: itemWidth, height: itemWidth, lineHeight: itemWidth};
      if (!isBrowser) {
        wx.getSystemInfo({
          success: function(res) {
            self.isIos = (res.system.split(' ') || [])[0] === 'iOS';
          }
        });
      }
      this.oversliding = true;
      this.init();
    },
    methods: {
      init() {
        let now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.day = now.getDate();
        this.monthIndex = this.month + 1;
        if (this.value.length || this.multi) {
          if (this.range) {
            this.year = parseInt(this.value[0][0]);
            this.month = parseInt(this.value[0][1]) - 1;
            this.day = parseInt(this.value[0][2]);
            let year2 = parseInt(this.value[1][0]);
            let month2 = parseInt(this.value[1][1]) - 1;
            let day2 = parseInt(this.value[1][2]);
            this.rangeBegin = [this.year, this.month, this.day];
            this.rangeEnd = [year2, month2, day2];
          } else if(this.multi) {
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
            this.day = parseInt((this.value[0] || [])[2]);
          } else {
            this.year = parseInt(this.value[0]);
            this.month = parseInt(this.value[1]) - 1;
            this.day = parseInt(this.value[2]);
          }
        }
        this.updateHeadMonth();
        this.render(this.year, this.month);
      },
      // 渲染日期
      render(y, m, renderer) {
        if (renderer) {
          this.year = y;
          this.month = m;
          this.updateHeadMonth();
        }
        let firstDayOfMonth = new Date(y, m, 1).getDay();
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate();
        let lastDayOfLastMonth = new Date(y, m, 0).getDate();
        const disabledFilter = (disabled) => {
          return disabled.filter(v => {
            const arr = v.split('-');
            return this.year == arr[0] && this.month == arr[1]-1 && i == arr[2];
          });
        }
        this.year = y;
        let seletSplit = this.value;
        let i, line = 0, temp = [], nextMonthPushDays = 1;
        for (i = 1; i <= lastDateOfMonth; i++) {
          let day = new Date(y, m, i).getDay();
          let k;
          if (day == 0) {
            temp[line] = [];
          } else if (i === 1) {
            temp[line] = [];
            k = lastDayOfLastMonth - firstDayOfMonth + 1;
            for (let j = 0; j < firstDayOfMonth; j++) {
              temp[line].push(Object.assign(
                {day: k,disabled: true, lastMonth: true},
                this.getLunarInfo(this.computedPrevYear(), this.computedPrevMonth(true), k),
                this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), k)
              ));
              k++;
            }
          }
          if (this.range) {
            let options = Object.assign(
              {day: i},
              this.getLunarInfo(this.year, this.month+1, i),
              this.getEvents(this.year, this.month+1, i)
            );
            if (this.rangeBegin.length > 0) {
              let beginTime = Number(new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2]));
              let endTime = Number(new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]));
              let stepTime = Number(new Date(this.year, this.month, i));
              if (beginTime <= stepTime && endTime >= stepTime) {
                options.selected = true;
              }
            }
            if (this.begin.length > 0) {
              let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])));
              if (beginTime > Number(new Date(this.year, this.month, i))) {
                options.disabled = true;
              }
            }
            if (this.end.length > 0){
              let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])));
              if (endTime <  Number(new Date(this.year, this.month, i))) {
                options.disabled = true;
              }
            }
            if (this.disabled.length > 0){
              if ((disabledFilter(this.disabled)).length) {
                options.disabled = true;
              }
            }
            temp[line].push(options);
          } else if(this.multi) {
            let options;
            if(this.value.filter(v => {return this.year === v[0] && this.month === v[1]-1 && i === v[2] }).length > 0){
              options = Object.assign(
                {day: i, selected:true},
                this.getLunarInfo(this.year, this.month+1, i),
                this.getEvents(this.year, this.month + 1, i)
              );
            } else {
              options = Object.assign(
                {day: i, selected: false},
                this.getLunarInfo(this.year, this.month+1, i),
                this.getEvents(this.year, this.month+1, i)
              );
              if (this.begin.length > 0) {
                let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])));
                if (beginTime > Number(new Date(this.year, this.month, i))) {
                  options.disabled = true;
                }
              }
              if (this.end.length > 0){
                let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])));
                if (endTime <  Number(new Date(this.year, this.month, i))) {
                  options.disabled = true;
                }
              }
              if (this.disabled.length > 0){
                if ((disabledFilter(this.disabled)).length) {
                  options.disabled = true;
                }
              }
            }
            temp[line].push(options);
          } else {
            // 单选
            let chk = new Date();
            let chkY = chk.getFullYear();
            let chkM = chk.getMonth();
            if (parseInt(seletSplit[0]) == this.year && parseInt(seletSplit[1]) - 1 == this.month && parseInt(seletSplit[2]) == i) {
              temp[line].push(Object.assign(
                {day: i, selected: true},
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i)
              ));
              this.today = [line, temp[line].length - 1];
            } else if (chkY == this.year && chkM == this.month && i == this.day && this.value == "") {
              temp[line].push(Object.assign(
                {day: i,selected: true},
                this.getLunarInfo(this.year,this.month+1,i),
                this.getEvents(this.year,this.month+1,i)
              ));
              this.today = [line, temp[line].length - 1];
            } else {
              let options = Object.assign(
                {day: i,selected:false},
                this.getLunarInfo(this.year,this.month+1,i),
                this.getEvents(this.year,this.month+1,i)
              );
              if (this.begin.length > 0) {
                let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])));
                if (beginTime > Number(new Date(this.year, this.month, i))) {
                  options.disabled = true;
                }
              }
              if (this.end.length > 0){
                let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])));
                if (endTime <  Number(new Date(this.year, this.month, i))) {
                  options.disabled = true;
                }
              }
              if (this.disabled.length > 0){
                if ((disabledFilter(this.disabled)).length) {
                  options.disabled = true;
                }
              }
              temp[line].push(options);
            }
          }
          if (day == 6 && i < lastDateOfMonth) {
            line++;
          } else if (i == lastDateOfMonth) {
            let k = 1;
            const lastDateOfMonthLength = this.monFirst ? 7 : 6;
            for (let d=day; d < lastDateOfMonthLength; d++) {
              temp[line].push(Object.assign(
                {day: k, disabled: true, nextMonth: true},
                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), k),
                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), k)
              ));
              k++;
            }
            nextMonthPushDays = k;
          }
        }
        const completion = this.completion;
        if (this.monFirst) {
          if (!firstDayOfMonth) {
            let lastMonthDay = lastDayOfLastMonth;
            const LastMonthItems = [];
            for (let i = 1; i <= 7; i++) {
              LastMonthItems.unshift(Object.assign(
                {day: lastMonthDay, disabled: true, lastMonth: true},
                this.getLunarInfo(this.computedPrevYear(), this.computedPrevMonth(true), lastMonthDay),
                this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), lastMonthDay)
              ));
              lastMonthDay --;
            }
            temp.unshift(LastMonthItems);
          }
          temp.forEach((item, index) => {
            if (!index) {
              return item.splice(0, 1);
            };
            temp[index-1].length < 7 && temp[index-1].push(item.splice(0, 1)[0]);
          });
          if (!completion) {
            const lastIndex = temp.length - 1;
            const secondToLastIndex = lastIndex - 1;
            const differentMonth = temp[lastIndex][0].date.split('-')[1] !== temp[secondToLastIndex][6].date.split('-')[1];
            differentMonth && temp.splice(lastIndex, 1);
          }
        }
        if(completion && temp.length <= 5 && nextMonthPushDays>0){
          for (let i = temp.length; i<=5; i++) {
            temp[i] = [];
            let start = nextMonthPushDays + (i - line -1) * 7;
            for (let d = start; d <= start + 6; d++) {
              temp[i].push(Object.assign(
                {day: d, disabled: true,  nextMonth: true},
                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), d),
                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), d)
              ))
            }
          }
        }
        if (this.tileContent.length) {
          temp.forEach((item, index) => {
            item.forEach((v, i) => {
              const contents = this.tileContent.find(val => val.date === v.date);
              if (contents) {
                const {className, content} = contents || {};
                v.className = className;
                v.content = content;
              }
            });
          });
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
      renderer(y, m) {
        const renderY = y || this.year;
        const renderM = typeof parseInt(m) === 'number' ? (m-1) : this.month;
        this.render(renderY, renderM, true);
      },
      computedPrevYear() {
        let value = this.year;
        if((this.month - 1) < 0){
          value--;
        }
        return value;
      },
      computedPrevMonth(isString) {
        let value = this.month;
        if((this.month - 1) < 0){
          value = 11;
        } else {
          value--;
        }
        if(isString) {
          return value + 1;
        }
        return value;
      },
      computedNextYear() {
        let value = this.year;
        if((this.month + 1) > 11){
          value++;
        }
        return value;
      },
      computedNextMonth(isString) {
        let value = this.month;
        if((this.month + 1) > 11){
          value = 0;
        } else {
          value++;
        }
        if(isString) {
          return value + 1;
        }
        return value;
      },
      getLunarInfo(y, m, d) {
        let lunarInfo = calendar.solar2lunar(y, m, d);
        let yearEve = '';
        if (lunarInfo.lMonth === 12 && lunarInfo.lDay === calendar.monthDays(lunarInfo.lYear, 12)) {
          yearEve = '除夕';
        }
        let lunarValue = lunarInfo.IDayCn;
        let Term = lunarInfo.Term;
        let isLunarFestival = false;
        let isGregorianFestival = false;
        if(this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay]) {
          lunarValue = this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay];
          isLunarFestival = true;
        } else if(this.festival.gregorian[m + "-" + d]) {
          lunarValue = this.festival.gregorian[m + "-" + d];
          isGregorianFestival = true;
        }
        const lunarInfoObj = {
          date: `${y}-${m}-${d}`,
          lunar: yearEve || Term || lunarValue,
          isLunarFestival: isLunarFestival,
          isGregorianFestival: isGregorianFestival,
          isTerm: !!yearEve || lunarInfo.isTerm
        };
        if (Object.keys(this.almanacs).length) {
          Object.assign(lunarInfoObj, {
            almanac: this.almanacs[m + "-" + d] || '',
            isAlmanac: !!this.almanacs[m + "-" + d]
          });
        }
        return lunarInfoObj;
      },
      getEvents(y, m, d){
        if(Object.keys(this.events).length == 0) return false;
        let eventName = this.events[y + "-" + m + "-" + d];
        let data = {};
        if(eventName!=undefined){
          data.eventName = eventName;
        }
        return data;
      },
      prev(e) {
        e.stopPropagation();
        if (this.monthIndex === 1) {
          this.month = 11;
          this.year = parseInt(this.year) - 1;
          this.monthIndex = this.monthIndex - 1;
        } else if (this.monthIndex === 0) {
          this.oversliding = true;
          this.monthIndex = 12;
          setTimeout(() => this.prev(e), 50);
        } else if (this.monthIndex === 13) {
          this.month = 11;
          this.year = parseInt(this.year) - 1;
          this.monthIndex = this.monthIndex - 1;
        } else {
          this.oversliding = false;
          this.month = parseInt(this.month) - 1;
          this.monthIndex = this.monthIndex - 1;
        }
        this.updateHeadMonth('custom');
        this.render(this.year, this.month);
        this.$emit('selectMonth', this.month + 1, this.year);
        this.$emit('prev', this.month + 1, this.year);
      },
      next(e) {
        e.stopPropagation();
        if (this.monthIndex === 12) {
          this.month = 0;
          this.year = parseInt(this.year) + 1;
          this.monthIndex = this.monthIndex + 1;
        } else if (this.monthIndex === 0 && this.month === 11) {
          this.month = 0;
          this.year = parseInt(this.year) + 1;
          this.monthIndex = this.monthIndex + 1;
        } else if (this.monthIndex === 13) {
          this.oversliding = true;
          this.monthIndex = 1;
          setTimeout(() => this.next(e), 50);
        } else {
          this.oversliding = false;
          this.month = parseInt(this.month) + 1;
          this.monthIndex = this.monthIndex + 1;
        }
        this.updateHeadMonth('custom');
        this.render(this.year, this.month);
        this.$emit('selectMonth', this.month + 1, this.year);
        this.$emit('next', this.month + 1, this.year);
      },
      select(k1, k2, data, e) {
        if (e) {
          e.stopPropagation();
        }
        if (data.lastMonth) {
          return this.prev(e);
        } else if (data.nextMonth) {
          return this.next(e);
        }
        if (data.disabled) return;
        (data || {}).event = (this.events || {})[data.date] || '';
        if (this.range) {
          if (this.rangeBegin.length == 0 || this.rangeEndTemp != 0) {
            this.rangeBegin = [this.year, this.month, this.days[k1][k2].day];
            this.rangeBeginTemp = this.rangeBegin;
            this.rangeEnd = [this.year, this.month, this.days[k1][k2].day];
            this.rangeEndTemp = 0;
          } else {
            this.rangeEnd = [this.year, this.month, this.days[k1][k2].day];
            this.rangeEndTemp = 1;
            if (+new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]) < +new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2])) {
              this.rangeBegin = this.rangeEnd;
              this.rangeEnd = this.rangeBeginTemp;
            }
            let begin = [];
            let end = [];
            if (this.zero) {
              this.rangeBegin.forEach((v,k)=>{
                if (k == 1) {
                  v = v + 1;
                }
                begin.push(this.zeroPad(v));
              });
              this.rangeEnd.forEach((v,k) => {
                if(k==1) {
                  v = v + 1;
                }
                end.push(this.zeroPad(v));
              });
            } else {
              begin = this.rangeBegin;
              end = this.rangeEnd;
            }
            this.$emit('select', begin, end);
          }
          this.render(this.year, this.month);
        } else if (this.multi) {
          const filterDayIndex = this.multiDays.findIndex(v => this.year === v[0] && this.month === v[1]-1 && this.days[k1][k2].day === v[2]);
          if(~filterDayIndex) {
            this.handleMultiDay = this.multiDays.splice(filterDayIndex, 1);
          } else {
            this.multiDays.push([this.year, this.month+1, this.days[k1][k2].day]);
          }
          this.days[k1][k2].selected = !this.days[k1][k2].selected;
          if (this.days[k1][k2].selected) {
            this.multiDaysData.push(data);
          } else {
            this.multiDaysData = this.multiDaysData.filter(item => item.date !== data.date);
          }
          this.$emit('select',this.multiDays, this.multiDaysData);
        } else {
          if (this.today.length > 0) {
            this.days.forEach(v=>{
              v.forEach(vv=> {
                vv.selected = false;
              });
            });
          }
          this.days[k1][k2].selected = true;
          this.day = this.days[k1][k2].day;
          this.today = [k1, k2];
          this.$emit('select', [this.year,this.zero ? this.zeroPad(this.month + 1) : this.month + 1, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day], data);
        }
      },
      changeYear() {
        if(this.yearsShow) {
          this.yearsShow = false;
          return false;
        }
        this.yearsShow = true;
        this.years = [];
        for (let i = this.year - 5; i < this.year + 7; i++){
          this.years.push(i);
        }
      },
      changeMonth(value) {
        this.yearsShow = false;
        this.month = value;
        this.render(this.year, this.month);
        this.updateHeadMonth();
        this.$emit('selectMonth', this.month + 1, this.year);
      },
      selectYear(value) {
        this.yearsShow = false;
        this.year = value;
        this.render(this.year, this.month);
        this.$emit('selectYear', value);
      },
      setToday() {
        let now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.day = now.getDate();
        this.render(this.year,this.month);
        this.updateHeadMonth();
        this.days.some(v => {
          const day = v.find(vv => vv.day === this.day && !vv.disabled);
          if (day) {
            day.selected = true;
            return true;
          }
        })
      },
      dateInfo(y, m, d) {
        return calendar.solar2lunar(y, m, d);
      },
      zeroPad(n){
        return String(n < 10 ? '0' + n : n)
      },
      updateHeadMonth(type) {
        if (!type) this.monthIndex = this.month + 1;
        this.monthPosition = this.monthIndex * this.positionH;
        this.monthText = this.months[this.month];
      }
    }
  }
</script>
