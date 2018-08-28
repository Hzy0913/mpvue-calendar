## mpvue-calendar
基于vue-calendar的适配**mpvue**平台的的微信小程序日历组件
## 预览
![比邻binlive](http://img.binlive.cn/xcx.jpg)
## 安装
```
npm i mpvue-calendar
```
## 使用
- `import Calendar from 'mpvue-calendar'` 引入组件
- `components`中注册组件`Calendar `
- `template`中使用组件`<Calendar />`


## 参数及方法
| 参数or方法  | 类型  | 说明  |
| ------------ | ------------ | ------------ |
| months  | Array  | 自定义月份，不传默认为中文一到十二月  |
| weeks  | Array  | 自定义星期，不传默认为中文日到六  |
| value  | Array  | 默认选中日期  |
| begin  | Array  | 限制开始日期，不传则不限制  |
| end  | Array  | 限制结束日期，不传则不限制  |
| disabled  | Array  | 禁用日期  |
| events  | Object  | 自定义备注  |
| lunar  | Boolean  | 是否显示农历，默认为false  |
| clean  | Boolean  | 是否为简洁模式，简洁模式下自定义备注会显示为圆点，默认为false   |
| now  | Boolean or String | 是否显示今日，传入字符串时可以自定义日历上今日的文字，默认为true   |
| range  | Boolean  | 是否为范围模式，默认为false   |
| multi  | Boolean  | 是否为多选模式，默认为false   |
| select(val, val2)  | function  | 日期选中事件,在range模式下val为开始日期、val2为结束日期，其他val为选中日期   |
| setToday()  | function  | 返回今日   |
| dateInfo(y, m, d)  | function  | 传入年,月,日三个参数会返回当天的信息(农历、节气、星座、星期、天干地支等)   |
| selectYear(val)  | function  | 选择年份事件，val为选中的年份   |
| prev(val)  | function  | 选择上一月事件，val为月份   |
| next(val)  | function  | 选择下一月事件，val为月份   |
| arrowLeft  | String  | 自定义左箭头图片，填写图片路径，不填则使用默认图片   |
| arrowRight  | String  | 自定义右箭头图片，填写图片路径，不填则使用默认图片   |

- `value` 参数<br>
在普通模式下value为一维数组如2018年6月21为`[2018,6,21]`<br>在range和multi模式下value为二维数组，如range模式选中2018年6月21到6月28为`[[2018,6,21], [2018,6,28]]`<br> 在range模式下如果定义value参数必须定义开始日期和结束日期，如`[[2018,6,21], [2018,6,28]]`
- `events` 参数<br>
events为自定义备注，例如备注2018年6月21日为`{'2018-6-21': '今日备注', '2018-6-22':'明日备注'}`，在**clean**模式下备注为圆点，**lunar**农历模式下备注会替代农历优先展示
- `disabled` 参数<br>
disabled为禁用日期，如禁用2018-6-21日为`['2018-6-21']`
- `now` 参数<br>
now参数可以选择是否将今天日期展示为`今`字，传入false则不展示，传入字符串则展示你定义等字符串内容，默认为true展示今字样

## 示例
```javascript
<template>
  <div>
    <Calendar
      :months="months"
      :value="value"
      @next="next"
      @prev="prev"
      :events="events"
      lunar
      clean
      @select="select"
      ref="calendar"
      @selectMonth="selectMonth"
      @selectYear="selectYear"
      :arrowLeft="arrowLeft"
    />
    <button @click="setToday">返回今日</button>
    <button @click="dateInfo">今日信息</button>
  </div>
</template>

<script>
import Calendar from 'mpvue-calendar'
import arrowLeft from '../assets/arrowLeft.png'

export default {
  data () {
    return {
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      disabledArray: ['2018-6-27','2018-6-25'],
      value: [2018,6,7],
      begin:[2016,1,1],
      end:[2020,1,1],
      events: {'2018-6-7':'今日备注', '2018-6-8':'一条很长的明日备注'},
      arrowLeft: arrowLeft
    }
  },
  components: {
    Calendar
  },
  methods: {
    selectMonth(month,year){
      console.log(year,month)
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
      console.log(val)
      console.log(val2)
    }
  }
}
</script>
```
